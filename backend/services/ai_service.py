import os
import json
import google.generativeai as genai
from typing import List, Dict, Any

class AIService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
        else:
            self.model = None

    async def get_chat_response(self, user_message: str, intent: str, history: List[Dict[str, Any]]) -> Dict[str, Any]:
        if not self.model:
            return {"message": "AI Service currently unavailable.", "suggested_product_ids": []}

        catalog = [
            {"id": 1, "name": "Neural Watch X", "price": "$299"},
            {"id": 2, "name": "Aura Lens Pro", "price": "$899"},
            {"id": 3, "name": "Sonic Bloom Buds", "price": "$199"},
            {"id": 4, "name": "Glass Pad 14", "price": "$1299"},
            {"id": 5, "name": "Eco Hub Prime", "price": "$149"},
            {"id": 6, "name": "Stealth Controller", "price": "$79"}
        ]

        prompt = f"""
        You are MindAI, a futuristic shopping assistant for AuraShop.
        
        CONTEXT:
        - User Intent: {intent}
        - Catalog: {json.dumps(catalog)}
        
        OUTPUT: Return ONLY a JSON object with:
        {{ "message": "string", "suggested_product_ids": [int] }}
        
        User: {user_message}
        """

        try:
            response = self.model.generate_content(prompt)
            text = response.text
            # Clean up potential markdown
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            return json.loads(text)
        except Exception as e:
            print(f"AI Error: {e}")
            return {"message": f"I'm here to help! How can I assist you with our {intent.lower()} products?", "suggested_product_ids": []}

ai_service = AIService()
