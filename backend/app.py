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
from recombee_api_client.api_client import RecombeeClient, Region
from recombee_api_client.api_requests import AddItemProperty, SetItemValues, Batch, AddDetailView, AddCartAddition, AddPurchase, RecommendItemsToUser, RecommendItemsToItem
from recombee_api_client.exceptions import APIException

load_dotenv()

RECOMBEE_DB_ID = os.getenv("RECOMBEE_DB_ID")
RECOMBEE_PRIVATE_TOKEN = os.getenv("RECOMBEE_PRIVATE_TOKEN")
recombee_client = None
if RECOMBEE_DB_ID and RECOMBEE_PRIVATE_TOKEN:
    recombee_client = RecombeeClient(RECOMBEE_DB_ID, RECOMBEE_PRIVATE_TOKEN, region=Region.EU_WEST)

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
        conn.execute('CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT, price TEXT, image TEXT)')
        conn.commit()

def seed_products():
    import random
    with get_db() as conn:
        count = conn.execute('SELECT COUNT(*) as count FROM products').fetchone()['count']
        if count == 0:
            adjectives = ["Neural", "Quantum", "Cyber", "Holo", "Plasma", "Aero", "Void", "Flux", "Neon", "Sonic", "Aura", "Prism", "Zenith", "Pulse", "Nova", "Stealth", "Orbit"]
            nouns = ["Drive", "Core", "Matrix", "Lens", "Suit", "Drone", "Pad", "Ring", "Projector", "Interface", "Watch", "Buds", "Hub", "Controller", "Key", "Lamp", "Chair"]
            products_to_insert = []
            for i in range(1, 51):
                name = f"{random.choice(adjectives)} {random.choice(nouns)} {random.randint(1, 99)}"
                desc = f"A state-of-the-art {name.lower()} with enhanced capabilities."
                price = f"${random.randint(49, 4999)}"
                image = f"https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80&sig={i}"
                products_to_insert.append((name, desc, price, image))
            conn.executemany('INSERT INTO products (name, description, price, image) VALUES (?, ?, ?, ?)', products_to_insert)
            conn.commit()

            if recombee_client:
                try:
                    recombee_client.send(AddItemProperty('name', 'string'))
                    recombee_client.send(AddItemProperty('description', 'string'))
                    recombee_client.send(AddItemProperty('price', 'string'))
                    recombee_client.send(AddItemProperty('image', 'string'))
                    
                    rows = conn.execute('SELECT * FROM products').fetchall()
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
                    recombee_client.send(Batch(batch_reqs))
                    print("Successfully synced 50 products to Recombee!")
                except Exception as e:
                    print("Recombee sync error:", e)

# --- SCHEMAS ---
class UserAuth(BaseModel):
    email: EmailStr
    password: str

class InteractionEvent(BaseModel):
    event_type: str
    element_id: Optional[str] = None
    data: Dict[str, Any] = {}
    timestamp: Optional[int] = None

class TrackPayload(BaseModel):
    session_id: str
    events: List[InteractionEvent]

class Prediction(BaseModel):
    interactions: List[Dict[str, Any]]

class Chat(BaseModel):
    session_id: str
    message: str
    intent: str = "BROWSING"
    history: Optional[List[Dict[str, Any]]] = None

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


# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
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

@app.get("/_/backend/products")
async def get_products(limit: int = 50, offset: int = 0):
    with get_db() as conn:
        rows = conn.execute('SELECT * FROM products LIMIT ? OFFSET ?', (limit, offset)).fetchall()
        return [dict(row) for row in rows]

@app.post("/_/backend/track")
async def track(payload: TrackPayload):
    with get_db() as conn:
        batch_reqs = []
        for ev in payload.events:
            conn.execute('INSERT INTO interactions (session_id, event_type, element_id, data) VALUES (?, ?, ?, ?)', 
                         (payload.session_id, ev.event_type, ev.element_id, json.dumps(ev.data)))
            
            if recombee_client and ev.element_id:
                try:
                    user_id = payload.session_id
                    item_id = str(ev.element_id)
                    if ev.event_type in ['view', 'click', 'hover']:
                        batch_reqs.append(AddDetailView(user_id, item_id, cascade_create=True))
                    elif ev.event_type == 'add_to_cart':
                        batch_reqs.append(AddCartAddition(user_id, item_id, cascade_create=True))
                    elif ev.event_type == 'purchase':
                        batch_reqs.append(AddPurchase(user_id, item_id, cascade_create=True))
                except Exception as e:
                    pass

        conn.commit()
        
        if recombee_client and batch_reqs:
            try:
                recombee_client.send(Batch(batch_reqs))
            except Exception as e:
                print("Recombee batch track error:", e)
                
    return {"status": "ok"}

@app.post("/_/backend/predict")
async def predict(p: Prediction):
    intent = "BROWSING"
    suggestions = []
    
    # 1. Intent prediction via Gemini or fallback
    if ai_model and p.interactions:
        try:
            events_str = json.dumps([{k: v for k, v in i.items() if k in ['event_type', 'element_id', 'data']} for i in p.interactions[-10:]])
            prompt = f"Analyze these user interactions: {events_str}. Predict their intent ('BROWSING', 'COMPARING', 'SEARCHING'). Respond in valid JSON format ONLY: {{\\\"intent\\\": \\\"intent_string\\\"}}"
            res = ai_model.generate_content(prompt).text
            if "```json" in res: res = res.split("```json")[1].split("```")[0].strip()
            elif "```" in res: res = res.split("```")[1].strip()
            data = json.loads(res)
            intent = data.get("intent", "BROWSING")
        except Exception as e:
            print("AI Intent error:", e)
            
    # 2. Recommendations via Recombee
    if recombee_client and p.interactions:
        try:
            session_id = p.interactions[-1].get('session_id', 'anonymous')
            last_item_id = p.interactions[-1].get('element_id')
            if p.interactions[-1].get('event_type') in ['view', 'click'] and last_item_id:
                rec = recombee_client.send(RecommendItemsToItem(str(last_item_id), session_id, 3))
            else:
                rec = recombee_client.send(RecommendItemsToUser(session_id, 3))
            suggestions = [int(r['id']) for r in rec['recomms']]
        except Exception as e:
            print("Recombee predict error:", e)
            
    # Fallback suggestions if Recombee fails or is disabled
    if not suggestions:
        import random
        suggestions = [random.randint(1, 50) for _ in range(3)]

    return {"intent": intent, "suggestions": suggestions}

@app.post("/_/backend/chat")
async def chat(c: Chat):
    if not ai_model: 
        import random
        suggestions = [random.randint(1, 50) for _ in range(3)]
        with get_db() as conn:
            conn.execute('INSERT INTO ai_logs (session_id, user_message, ai_response, intent_prediction) VALUES (?, ?, ?, ?)',
                         (c.session_id, c.message, "Here are some recommendations based on your input!", c.intent))
            conn.commit()
        return {
            "response": f"I see you're {c.intent}. Here are some recommendations based on your input: '{c.message}'!",
            "suggestions": suggestions
        }
    
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
        return {"response": "How can I help you today?", "suggestions": []}

# --- SPA SERVING ---
@app.get("/{path:path}")
async def serve(request: Request, path: str):
    # Determine the file to serve
    if path == "" or path == "/":
        file_path = os.path.join(TEMPLATE_DIR, "index.html")
    else:
        file_path = os.path.join(STATIC_DIR, path)
        
        # Security: if it's an asset request that doesn't exist, don't serve index.html (prevents MIME errors)
        if not os.path.exists(file_path):
            if path.startswith("assets/"):
                return HTMLResponse("Asset not found", status_code=404)
            file_path = os.path.join(TEMPLATE_DIR, "index.html")
    
    if os.path.exists(file_path):
        return FileResponse(file_path)
    
    return HTMLResponse("<h1>AuraShop AI</h1><p>Backend Active. Frontend assets not found at " + file_path + "</p>")

# --- INITIALIZATION (Safe for Serverless Cold Starts) ---
try:
    init_db()
    seed_products()
    
    from werkzeug.security import generate_password_hash
    seed_users = [
        ("test@aurashop.ai", "password123"),
        ("oladapotimothy2016@gmail.com", "password123")
    ]
    
    with get_db() as db:
        for email, password in seed_users:
            row = db.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
            if not row:
                db.execute(
                    "INSERT INTO users (email, password_hash) VALUES (?, ?)",
                    (email, generate_password_hash(password))
                )
                db.commit()
                print(f"Seed user created: {email}")
except Exception as e:
    print("Error initializing DB:", e)
