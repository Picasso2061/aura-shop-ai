import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv
import database
import json

load_dotenv()

# Resolve paths relative to this file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_FOLDER = os.path.join(BASE_DIR, '..', 'frontend', 'dist')

app = Flask(__name__, static_folder=STATIC_FOLDER, static_url_path='/')
CORS(app)

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
else:
    print("WARNING: GEMINI_API_KEY not found in environment variables.")
    model = None

@app.route('/api/track', methods=['POST'])
def track_interaction():
    data = request.json
    session_id = data.get('session_id')
    event_type = data.get('event_type')
    element_id = data.get('element_id')
    extra_data = json.dumps(data.get('data', {}))
    
    database.log_interaction(session_id, event_type, element_id, extra_data)
    return jsonify({"status": "success"}), 200

@app.route('/api/predict', methods=['POST'])
def predict_intent():
    data = request.json
    interactions = data.get('interactions', [])
    
    # Granular analysis of micro-signals
    scroll_events = [i for i in interactions if i.get('event_type') == 'scroll']
    click_events = [i for i in interactions if i.get('event_type') == 'click']
    hover_events = [i for i in interactions if i.get('event_type') == 'hover']
    
    avg_scroll_velocity = sum([s.get('data', {}).get('velocity', 0) for s in scroll_events]) / len(scroll_events) if scroll_events else 0
    max_hover_duration = max([h.get('data', {}).get('duration', 0) for h in hover_events]) if hover_events else 0
    
    intent = "BROWSING"
    
    # 1. Searching: High scroll speed, looking for patterns
    if avg_scroll_velocity > 500:
        intent = "QUICK_SEARCHING"
    
    # 2. Deciding/Comparing: Deep engagement with specific elements
    elif max_hover_duration > 4000 or len(click_events) > 3:
        intent = "COMPARING_PRODUCTS"
        
    # 3. High Purchase Intent: Lingering on checkout or product details
    elif any('product' in i.get('element_id', '') for i in click_events) and max_hover_duration > 2000:
        intent = "READY_TO_BUY"
        
    # 4. Hesitating: Erratic behavior near navigation buttons
    elif any(i.get('element_id') == 'back-button' for i in hover_events):
        intent = "HESITATING"

    return jsonify({
        "intent": intent,
        "signals": {
            "scroll_velocity": avg_scroll_velocity,
            "max_hover": max_hover_duration,
            "clicks": len(click_events)
        }
    }), 200

@app.route('/api/chat', methods=['POST'])
def chat():
    if not model:
        return jsonify({"error": "LLM not configured"}), 500
        
    data = request.json
    session_id = data.get('session_id')
    user_message = data.get('message')
    intent = data.get('intent', 'BROWSING')
    
    CATALOG = [
        {"id": 1, "name": "Neural Watch X", "price": "$299"},
        {"id": 2, "name": "Aura Lens Pro", "price": "$899"},
        {"id": 3, "name": "Sonic Bloom Buds", "price": "$199"},
        {"id": 4, "name": "Glass Pad 14", "price": "$1299"},
        {"id": 5, "name": "Eco Hub Prime", "price": "$149"},
        {"id": 6, "name": "Stealth Controller", "price": "$79"}
    ]

    prompt = f"""
    You are MindAI, a futuristic shopping assistant for AuraShop.
    
    SYSTEM CONTEXT:
    - User Intent: {intent}
    - Recent Interactions: {json.dumps(data.get('history', []))}
    - Product Catalog: {json.dumps(CATALOG)}
    
    GUIDELINES:
    1. If the user is COMPARING_PRODUCTS, recommend two specific items from the catalog and explain why.
    2. If the user is QUICK_SEARCHING, suggest the top 3 items that might interest them.
    3. If the user is READY_TO_BUY, focus on the item they hovered on most.
    
    OUTPUT FORMAT:
    Return your response in JSON format:
    {{
        "message": "Your helpful response here",
        "suggested_product_ids": [id1, id2]
    }}
    
    User message: {user_message}
    """
    
    try:
        response = model.generate_content(prompt)
        ai_raw = response.text
        
        # Strip markdown code blocks if present
        if ai_raw.startswith("```json"):
            ai_raw = ai_raw.replace("```json", "").replace("```", "").strip()
            
        try:
            ai_json = json.loads(ai_raw)
            ai_response = ai_json.get('message', '')
            suggestions = ai_json.get('suggested_product_ids', [])
        except:
            ai_response = ai_raw
            suggestions = []
        
        database.log_ai_interaction(session_id, user_message, ai_response, intent)
        
        return jsonify({
            "response": ai_response,
            "suggestions": suggestions
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    database.init_db()
    app.run(debug=True, port=5000)
