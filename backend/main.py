import os
from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from werkzeug.security import generate_password_hash, check_password_hash
import database
from .schemas.models import UserRegister, UserLogin, InteractionData, PredictionRequest, ChatRequest
from .services.ai_service import ai_service
import json

app = FastAPI(title="AuraShop AI API", version="2.0.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Resolve paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")
TEMPLATE_DIR = os.path.join(BASE_DIR, "templates")

# Mount Static Files
if os.path.exists(STATIC_DIR):
    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

templates = Jinja2Templates(directory=TEMPLATE_DIR)

@app.post("/_/backend/register")
async def register(user: UserRegister):
    hashed_pw = generate_password_hash(user.password)
    if database.create_user(user.email, hashed_pw):
        return {"message": "User created successfully"}
    raise HTTPException(status_code=400, detail="User already exists")

@app.post("/_/backend/login")
async def login(user: UserLogin):
    db_user = database.get_user_by_email(user.email)
    if db_user and check_password_hash(db_user['password_hash'], user.password):
        return {
            "message": "Login successful",
            "user": {"email": db_user['email']}
        }
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/_/backend/track")
async def track(interaction: InteractionData):
    database.log_interaction(
        interaction.session_id, 
        interaction.event_type, 
        interaction.element_id, 
        json.dumps(interaction.data)
    )
    return {"status": "success"}

@app.post("/_/backend/predict")
async def predict(req: PredictionRequest):
    interactions = req.interactions
    # Simplified intent logic (could be moved to a service)
    intent = "BROWSING"
    hover_events = [i for i in interactions if i.get('event_type') == 'hover']
    max_hover = max([h.get('data', {}).get('duration', 0) for h in hover_events]) if hover_events else 0
    
    if max_hover > 4000:
        intent = "COMPARING_PRODUCTS"
    elif max_hover > 2000:
        intent = "READY_TO_BUY"
        
    return {"intent": intent, "signals": {"max_hover": max_hover}}

@app.post("/_/backend/chat")
async def chat(req: ChatRequest):
    ai_response = await ai_service.get_chat_response(req.message, req.intent, req.history)
    database.log_ai_interaction(req.session_id, req.message, ai_response['message'], req.intent)
    return {
        "response": ai_response['message'],
        "suggestions": ai_response['suggested_product_ids']
    }

# SPA Fallback
@app.get("/{path:path}", response_class=HTMLResponse)
async def serve_spa(request: Request, path: str):
    # Check if requesting a static file manually
    static_file_path = os.path.join(STATIC_DIR, path)
    if path != "" and os.path.exists(static_file_path):
        from fastapi.responses import FileResponse
        return FileResponse(static_file_path)
    
    # Otherwise return index.html
    return templates.TemplateResponse("index.html", {"request": request})

# Database Init
@app.on_event("startup")
async def startup_event():
    try:
        database.init_db()
    except Exception as e:
        print(f"DB Error: {e}")
