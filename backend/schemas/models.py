from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any

class UserRegister(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class InteractionData(BaseModel):
    session_id: str
    event_type: str
    element_id: Optional[str] = None
    data: Dict[str, Any] = {}

class PredictionRequest(BaseModel):
    interactions: List[Dict[str, Any]]

class ChatRequest(BaseModel):
    session_id: str
    message: str
    intent: str = "BROWSING"
    history: List[Dict[str, Any]] = []
