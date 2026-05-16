import os
import json
import sqlite3
import google.generativeai as genai
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from werkzeug.security import generate_password_hash, check_password_hash
from contextlib import contextmanager
from dotenv import load_dotenv

load_dotenv()

# --- DATABASE LOGIC ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = '/tmp/aura_shop.db' if os.environ.get('VERCEL') else os.path.join(BASE_DIR, 'aura_shop.db')

@contextmanager
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def init_db():
    with get_db() as conn:
        conn.execute('CREATE TABLE IF NOT EXISTS interactions (id INTEGER PRIMARY KEY AUTOINCREMENT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, session_id TEXT, event_type TEXT, element_id TEXT, data TEXT)')
        conn.execute('CREATE TABLE IF NOT EXISTS ai_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, session_id TEXT, user_message TEXT, ai_response TEXT, intent_prediction TEXT)')
        conn.execute('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE, password_hash TEXT)')
        conn.commit()

# --- SCHEMAS ---
class UserAuth(BaseModel):
    email: EmailStr
    password: str

class Interaction(BaseModel):
    session_id: str
    event_type: str
    element_id: Optional[str] = None
    data: Dict[str, Any] = {}

class Prediction(BaseModel):
    interactions: List[Dict[str, Any]]

class Chat(BaseModel):
    session_id: str
    message: str
    intent: str = "BROWSING"

# --- APP INIT ---
app = FastAPI(title="AuraShop AI Unified")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# AI Setup
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    ai_model = genai.GenerativeModel('gemini-1.5-flash')
else:
    ai_model = None

# Paths
STATIC_DIR = os.path.join(BASE_DIR, "static")
TEMPLATE_DIR = os.path.join(BASE_DIR, "templates")

if os.path.exists(STATIC_DIR):
    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

templates = Jinja2Templates(directory=TEMPLATE_DIR) if os.path.exists(TEMPLATE_DIR) else None

# --- ROUTES ---
@app.post("/_/backend/register")
async def register(user: UserAuth):
    hashed = generate_password_hash(user.password)
    try:
        with get_db() as conn:
            conn.execute('INSERT INTO users (email, password_hash) VALUES (?, ?)', (user.email, hashed))
            conn.commit()
        return {"message": "Success"}
    except:
        raise HTTPException(status_code=400, detail="User exists")

@app.post("/_/backend/login")
async def login(user: UserAuth):
    with get_db() as conn:
        row = conn.execute('SELECT * FROM users WHERE email = ?', (user.email,)).fetchone()
        if row and check_password_hash(row['password_hash'], user.password):
            return {"message": "ok", "user": {"email": row['email']}}
    raise HTTPException(status_code=401, detail="Invalid")

@app.post("/_/backend/track")
async def track(i: Interaction):
    with get_db() as conn:
        conn.execute('INSERT INTO interactions (session_id, event_type, element_id, data) VALUES (?, ?, ?, ?)', 
                     (i.session_id, i.event_type, i.element_id, json.dumps(i.data)))
        conn.commit()
    return {"status": "ok"}

@app.post("/_/backend/predict")
async def predict(p: Prediction):
    # Dynamic intent logic
    intent = "BROWSING"
    hovers = [i for i in p.interactions if i.get('event_type') == 'hover']
    max_h = max([h.get('data', {}).get('duration', 0) for h in hovers]) if hovers else 0
    if max_h > 3000: intent = "COMPARING"
    return {"intent": intent}

@app.post("/_/backend/chat")
async def chat(c: Chat):
    if not ai_model: return {"response": "AI Offline"}
    
    prompt = f"User is {c.intent}. They said: {c.message}. Respond as MindAI shopping assistant in JSON: {{'message': 'text', 'suggested_product_ids': []}}"
    try:
        res = ai_model.generate_content(prompt).text
        if "```json" in res: res = res.split("```json")[1].split("```")[0].strip()
        data = json.loads(res)
        with get_db() as conn:
            conn.execute('INSERT INTO ai_logs (session_id, user_message, ai_response, intent_prediction) VALUES (?, ?, ?, ?)',
                         (c.session_id, c.message, data['message'], c.intent))
            conn.commit()
        return {"response": data['message'], "suggestions": data['suggested_product_ids']}
    except:
        return {"response": "How can I help you today?"}

# --- SPA SERVING ---
@app.get("/{path:path}")
async def serve(request: Request, path: str):
    # Determine the file to serve
    if path == "" or path == "/":
        file_path = os.path.join(TEMPLATE_DIR, "index.html")
    else:
        file_path = os.path.join(STATIC_DIR, path)
        if not os.path.exists(file_path):
            file_path = os.path.join(TEMPLATE_DIR, "index.html")
    
    if os.path.exists(file_path):
        return FileResponse(file_path)
    
    return HTMLResponse("<h1>AuraShop AI</h1><p>Backend Active. Frontend assets not found at " + file_path + "</p>")

@app.on_event("startup")
async def startup():
    init_db()
