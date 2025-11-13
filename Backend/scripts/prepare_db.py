import duckdb
import pandas as pd
from pathlib import Path

# Resolve absolute paths regardless of where the script is run
BASE_DIR = Path(__file__).resolve().parent.parent
RAW = BASE_DIR / "data" / "raw"
DB_PATH = BASE_DIR / "data" / "db" / "olist.duckdb"

DB_PATH.parent.mkdir(parents=True, exist_ok=True)

con = duckdb.connect(str(DB_PATH))

# Table file mapping
files = {
    "orders": "olist_orders_dataset.csv",
    "order_items": "olist_order_items_dataset.csv",
    "customers": "olist_customers_dataset.csv",
    "products": "olist_products_dataset.csv",
    "payments": "olist_order_payments_dataset.csv",
    "reviews": "olist_order_reviews_dataset.csv",
    "sellers": "olist_sellers_dataset.csv",
    "geolocation": "olist_geolocation_dataset.csv",
    "translations": "product_category_name_translation.csv",
}

print("🚀 Building DuckDB from Olist CSVs...\n")

for table, filename in files.items():
    file_path = RAW / filename

    # Check existence before loading
    if not file_path.exists():
        print(f"❌ Skipped {table}: File not found -> {file_path}")
        continue

    try:
        df = pd.read_csv(file_path, encoding="utf-8")
        con.register(table, df)
        con.execute(f"CREATE OR REPLACE TABLE {table} AS SELECT * FROM {table}")
        print(f"✅ Loaded table '{table}' ({len(df):,} rows)")
    except Exception as e:
        print(f"⚠️ Error loading {table}: {e}")

print("\n📦 Finalizing database...")
con.close()
print(f"🎯 Olist DuckDB built successfully at: {DB_PATH}")