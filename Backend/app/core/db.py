import duckdb
from pathlib import Path

# Always resolve from backend root, not /app/
BASE_DIR = Path(__file__).resolve().parent.parent.parent
DB_PATH = BASE_DIR / "data" / "db" / "olist.duckdb"

def run_query(sql: str):
    """
    Execute SQL safely against the Olist DuckDB and return results as list of dicts.
    """
    try:
        with duckdb.connect(str(DB_PATH), read_only=True) as con:
            df = con.execute(sql).fetchdf()
            return df.to_dict(orient="records")
    except Exception as e:
        print(f"⚠️ SQL Execution Error: {e}")
        return [{"error": str(e)}]