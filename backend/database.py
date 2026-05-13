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

if __name__ == '__main__':
    init_db()
    print("Database initialized.")
