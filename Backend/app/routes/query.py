from fastapi import APIRouter, Body
from pydantic import BaseModel, ValidationError
from app.core.db import run_query
from app.core.ai_client import call_gemini
import logging

# --- Configuration ---
router = APIRouter(tags=["AI Query"])

PRIMARY_SQL_MODEL   = "models/gemini-1.5-flash"
FALLBACK_SQL_MODEL  = "models/gemini-1.5-flash"
SUMMARY_MODELS_TRY  = ["models/gemini-1.5-flash", "models/gemini-1.5-flash-lite"] # Reduced list for faster attempts

# --- Pydantic Validation Models ---
# This is the core fix: We define what a *successful* response from
# call_gemini MUST look like. It must be a dictionary with a key
# "text" that holds a string.
class GeminiResponse(BaseModel):
    text: str

# --- Helper Functions ---

def parse_gemini_response(resp: dict | str | None) -> str | None:
    """
    Safely parses the output from call_gemini using Pydantic validation.
    This replaces the brittle `resp.get("text")` logic.
    """
    if not resp or not isinstance(resp, dict):
        logging.warning(f"Gemini response was not a dict: {resp}")
        return None
    
    try:
        # Validate that the dict has a "text" field
        valid_resp = GeminiResponse.model_validate(resp)
        return valid_resp.text.strip()
    
    except ValidationError as e:
        # This catches 400/503s that return as dicts like {"error": "..."}
        logging.error(f"Gemini response failed validation: {e} - Response: {resp}")
        return None
    except Exception as e:
        # Catchall for other unexpected errors
        logging.error(f"Unexpected error parsing Gemini response: {e} - Response: {resp}")
        return None

def clean_sql(sql_text: str) -> str:
    """Cleans and normalizes SQL text."""
    if not sql_text:
        return ""
    for marker in ["```sql", "```", "SQL\n", "sql\n"]:
        sql_text = sql_text.replace(marker, "")
    return sql_text.strip().rstrip(";") + ";"  # normalize

def local_summary(rows: list[dict]) -> str:
    """Hard fallback to generate a local summary on model outage."""
    if not rows:
        return "No data returned for this query."
    
    cols = list(rows[0].keys())
    count_key = next((k for k in ["order_count","total_orders","count","orders","n"] if k in cols), None)
    label_key = next((k for k in ["customer_state","state","seller_state","product_category_name","date","month"] if k in cols), cols[0])
    
    top = rows[0]
    
    if count_key and label_key in top:
        try:
            val = int(top[count_key])
        except Exception:
            val = top[count_key]
        return f"Top {label_key.replace('_',' ')}: {top[label_key]} with {val} orders. Showing top {min(len(rows),10)} rows."
    
    return f"{len(rows)} rows × {len(cols)} columns. Sample columns: {', '.join(cols[:4])}."

def try_summarize(data_preview: list[dict]) -> str:
    """Try Gemini summary with graceful fallback."""
    prompt = (
        f"You are a senior analyst at Maersk. "
        f"Write a crisp 2–3 line executive summary for the first 5 rows:\n{data_preview[:5]}"
    )
    
    for m in SUMMARY_MODELS_TRY:
        resp = call_gemini(prompt, model=m)
        
        # USE THE NEW SAFE PARSER
        text = parse_gemini_response(resp)
        
        # This check is now much more reliable
        if text:
            return text
            
    # Hard fallback: on-model-outage, synthesize locally
    logging.warning("All summary models failed, using local_summary.")
    return local_summary(data_preview)

@router.post("/query")
def handle_query(payload: dict = Body(...)):
    question = payload.get("question", "").strip()
    if not question:
        return {"error": "Missing question"}

    system_prompt = """
    You are a data analyst for Maersk, working on the Olist e-commerce dataset.
    Translate user questions into precise, executable SQL queries for DuckDB.

    Dataset:
    - orders(customer_id, order_status, order_purchase_timestamp, order_id, ...)
    - order_items(order_id, product_id, price, freight_value)
    - customers(customer_id, customer_state, customer_city, customer_zip_code_prefix)
    - products(product_id, product_category_name, product_weight_g)
    - payments(order_id, payment_type, payment_value)
    - reviews(order_id, review_score)
    - sellers(seller_id, seller_city, seller_state)
    - geolocation(geolocation_zip_code_prefix, geolocation_lat, geolocation_lng)
    - translations(product_category_name, product_category_name_english)

    Rules:
    1) Use lowercase table names.
    2) Join tables when columns are in different tables.
    3) Never hallucinate columns.
    4) Return ONLY raw SQL (no markdown/code fences).
    """

    gemini_prompt = f"{system_prompt}\n\nUser question: {question}"
    
    # --- SQL generation with fallback ---
    resp_primary = call_gemini(gemini_prompt, model=PRIMARY_SQL_MODEL)
    
    # USE THE NEW SAFE PARSER
    sql_text = parse_gemini_response(resp_primary)

    if not sql_text or "select" not in sql_text.lower():
        logging.warning(f"Primary SQL model failed or returned invalid SQL. Output: {sql_text}. Retrying with fallback...")
        resp_fallback = call_gemini(gemini_prompt, model=FALLBACK_SQL_MODEL)
        
        # USE THE NEW SAFE PARSER
        sql_text = parse_gemini_response(resp_fallback)

    if not sql_text or "select" not in sql_text.lower():
        logging.error(f"All SQL models failed to produce valid SQL. Last output: {sql_text}")
        return {"error": "AI model could not produce valid SQL", "gemini_output": sql_text}

    sql_text = clean_sql(sql_text)

    # --- Execute SQL ---
    try:
        data = run_query(sql_text)
    except Exception as e:
        logging.error(f"SQL execution failed for query: {sql_text} - Error: {e}")
        return {"error": f"SQL execution failed: {e}", "sql": sql_text, "data_preview": []}

    # Your brilliant heuristic for "orders by state"
    if data and len(data) > 0 and len(data[0].keys()) == 1:
        logging.debug("Running heuristic query for single-column result.")
        try:
            improved = run_query("""
                SELECT c.customer_state, COUNT(*) AS order_count
                FROM orders o
                JOIN customers c ON o.customer_id = c.customer_id
                GROUP BY c.customer_state
                ORDER BY order_count DESC
                LIMIT 10;
            """)
            if improved:
                data = improved
        except Exception:
            logging.warning("Heuristic query failed, falling back to original data.")
            pass # Fallback to original data if heuristic fails

    if not data:
        logging.info(f"SQL query returned no data: {sql_text}")
        return {"error": "Query ran successfully but returned no data", "sql": sql_text, "data_preview": []}
    
    if "error" in str(data).lower():
        logging.error(f"SQL query returned an error: {data}")
        return {"error": "SQL execution failed", "sql": sql_text, "data_preview": data}

    # --- Summarize with resilient fallback ---
    summary_text = try_summarize(data)

    return {
        "sql": sql_text,
        "data_preview": data[:10], # Send only the top 10 rows
        "summary": summary_text,
    }