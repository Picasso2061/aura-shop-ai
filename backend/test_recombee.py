import sqlite3
import os
from dotenv import load_dotenv
from recombee_api_client.api_client import RecombeeClient, Region
from recombee_api_client.api_requests import AddItemProperty, SetItemValues, Batch
from recombee_api_client.api_requests import AddDetailView, RecommendItemsToUser

import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app import init_db, seed_products

load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'aura_shop.db')

RECOMBEE_DB_ID = os.getenv("RECOMBEE_DB_ID")
RECOMBEE_PRIVATE_TOKEN = os.getenv("RECOMBEE_PRIVATE_TOKEN")

if not RECOMBEE_DB_ID or not RECOMBEE_PRIVATE_TOKEN:
    print("Missing credentials!")
    exit(1)

client = RecombeeClient(RECOMBEE_DB_ID, RECOMBEE_PRIVATE_TOKEN, region=Region.EU_WEST)

init_db()
seed_products()


print("Syncing products...")
try:
    client.send(AddItemProperty('name', 'string'))
    client.send(AddItemProperty('description', 'string'))
    client.send(AddItemProperty('price', 'string'))
    client.send(AddItemProperty('image', 'string'))
except Exception as e:
    pass

conn = sqlite3.connect(DB_PATH)
conn.row_factory = sqlite3.Row
rows = conn.execute('SELECT * FROM products LIMIT 50').fetchall()

batch_reqs = []
for row in rows:
    batch_reqs.append(SetItemValues(
        str(row['id']),
        {
            'name': row['name'],
            'description': row['description'],
            'price': row['price'],
            'image': row['image']
        },
        cascade_create=True
    ))

if batch_reqs:
    print(f"Uploading {len(batch_reqs)} items to Recombee...")
    try:
        client.send(Batch(batch_reqs))
        print("Items uploaded successfully!")
    except Exception as e:
        print("Upload error:", e)
else:
    print("No items found in DB. Have you started the app yet?")

print("Testing tracking: User 'test_user_1' viewing Item '1'")
try:
    client.send(AddDetailView('test_user_1', '1', cascade_create=True))
    print("Track view successfully.")
except Exception as e:
    print("Track view error:", e)

print("Testing recommendation for 'test_user_1'")
try:
    rec = client.send(RecommendItemsToUser('test_user_1', 3))
    print("Recommendation results:", rec)
except Exception as e:
    print("Recommendation error:", e)
