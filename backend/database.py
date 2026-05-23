import sqlite3
import os
from contextlib import contextmanager
from typing import Optional, Dict, Any
import random

# Resolve database path relative to this file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

if os.environ.get('VERCEL'):
    DB_PATH = '/tmp/aura_shop.db'
else:
    DB_PATH = os.path.join(BASE_DIR, 'aura_shop.db')

@contextmanager
def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def init_db():
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Interactions
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS interactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                session_id TEXT,
                event_type TEXT,
                element_id TEXT,
                data TEXT
            )
        ''')
        
        # AI Logs
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS ai_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                session_id TEXT,
                user_message TEXT,
                ai_response TEXT,
                intent_prediction TEXT
            )
        ''')
        
        # Users
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE,
                password_hash TEXT
            )
        ''')
        
        # Products
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                description TEXT,
                price TEXT,
                image TEXT
            )
        ''')
        conn.commit()

def seed_products():
    with get_db_connection() as conn:
        count = conn.execute('SELECT COUNT(*) as count FROM products').fetchone()['count']
        if count == 0:
            print("Seeding 1000 products...")
            adjectives = ["Neural", "Quantum", "Cyber", "Holo", "Plasma", "Aero", "Void", "Flux", "Neon", "Sonic", "Aura", "Prism", "Zenith", "Pulse", "Nova", "Stealth", "Orbit"]
            nouns = ["Drive", "Core", "Matrix", "Lens", "Suit", "Drone", "Pad", "Ring", "Projector", "Interface", "Watch", "Buds", "Hub", "Controller", "Key", "Lamp", "Chair"]
            
            products_to_insert = []
            for i in range(1, 1001):
                name = f"{random.choice(adjectives)} {random.choice(nouns)} {random.randint(1, 99)}"
                desc = f"A state-of-the-art {name.lower()} with enhanced capabilities."
                price = f"${random.randint(49, 4999)}"
                image = f"https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80&sig={i}"
                products_to_insert.append((name, desc, price, image))
            
            conn.executemany('''
                INSERT INTO products (name, description, price, image)
                VALUES (?, ?, ?, ?)
            ''', products_to_insert)
            conn.commit()
            print("Seeding complete.")

def log_interaction(session_id: str, event_type: str, element_id: Optional[str], data: str):
    with get_db_connection() as conn:
        conn.execute('''
            INSERT INTO interactions (session_id, event_type, element_id, data)
            VALUES (?, ?, ?, ?)
        ''', (session_id, event_type, element_id, data))
        conn.commit()

def log_ai_interaction(session_id: str, user_message: str, ai_response: str, intent_prediction: str):
    with get_db_connection() as conn:
        conn.execute('''
            INSERT INTO ai_logs (session_id, user_message, ai_response, intent_prediction)
            VALUES (?, ?, ?, ?)
        ''', (session_id, user_message, ai_response, intent_prediction))
        conn.commit()

def create_user(email: str, password_hash: str) -> bool:
    try:
        with get_db_connection() as conn:
            conn.execute('INSERT INTO users (email, password_hash) VALUES (?, ?)', (email, password_hash))
            conn.commit()
            return True
    except sqlite3.IntegrityError:
        return False

def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    with get_db_connection() as conn:
        user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
        if user:
            return dict(user)
    return None
