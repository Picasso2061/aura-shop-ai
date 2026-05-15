import sqlite3
import os

# Resolve database path relative to this file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'aura_shop.db')

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Table for logging user interactions
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
    
    # Table for AI assistant logs
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
    
    # Table for Users
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            password_hash TEXT
        )
    ''')
    
    conn.commit()
    conn.close()

def log_interaction(session_id, event_type, element_id, data):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO interactions (session_id, event_type, element_id, data)
        VALUES (?, ?, ?, ?)
    ''', (session_id, event_type, element_id, data))
    conn.commit()
    conn.close()

def log_ai_interaction(session_id, user_message, ai_response, intent_prediction):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO ai_logs (session_id, user_message, ai_response, intent_prediction)
        VALUES (?, ?, ?, ?)
    ''', (session_id, user_message, ai_response, intent_prediction))
    conn.commit()
    conn.close()

def create_user(email, password_hash):
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('INSERT INTO users (email, password_hash) VALUES (?, ?)', (email, password_hash))
        conn.commit()
        conn.close()
        return True
    except sqlite3.IntegrityError:
        return False

def get_user_by_email(email):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
    user = cursor.fetchone()
    conn.close()
    if user:
        return {"id": user[0], "email": user[1], "password_hash": user[2]}
    return None

if __name__ == '__main__':
    init_db()
    print("Database initialized.")
