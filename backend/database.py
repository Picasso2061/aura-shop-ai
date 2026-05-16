import sqlite3
import os
from contextlib import contextmanager
from typing import Optional, Dict, Any

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
        conn.commit()

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
