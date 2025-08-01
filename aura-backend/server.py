import os
import io
import base64
from flask import Flask, request, jsonify, session, send_from_directory, send_file, make_response
from flask_cors import CORS
from dotenv import load_dotenv
from PIL import Image
import json
import google.generativeai as genai
import firebase_admin
from firebase_admin import credentials, firestore, auth, initialize_app
import uuid

# --- Initial Setup ---
load_dotenv()

# Create Flask app
if os.environ.get('FLASK_ENV') == 'production':
    app = Flask(__name__, static_folder='static', static_url_path='')
else:
    app = Flask(__name__)

app.secret_key = os.getenv('FLASK_SECRET_KEY', os.urandom(24))

# --- CORS Configuration ---
# Check multiple ways to determine if we're in production
IS_PROD = (
    os.environ.get('FLASK_ENV') == 'production' or 
    os.environ.get('NODE_ENV') == 'production' or
    os.environ.get('RENDER') is not None or  # Render.com detection
    os.environ.get('HEROKU') is not None     # Heroku detection
)

print(f"🔍 Environment variables:")
print(f"   FLASK_ENV: {os.environ.get('FLASK_ENV')}")
print(f"   NODE_ENV: {os.environ.get('NODE_ENV')}")
print(f"   RENDER: {os.environ.get('RENDER')}")
print(f"   HEROKU: {os.environ.get('HEROKU')}")
print(f"   IS_PROD determined as: {IS_PROD}")

if IS_PROD:
    frontend_url = os.environ.get('FRONTEND_URL', 'https://aura-voice-assistant-1.onrender.com')
    allowed_origins = [
        frontend_url,
        'https://aura-voice-assistant-1.onrender.com',
        'https://aura-voice-assistant.onrender.com'
    ]
    print(f"🌐 Production CORS origins: {allowed_origins}")
else:
    allowed_origins = ['http://localhost:5173', 'http://127.0.0.1:5173']
    print("🌐 Development CORS origins: localhost")

CORS(app, 
     resources={
         r"/api/*": {
             "origins": allowed_origins,
             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
             "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"],
             "supports_credentials": True
         }
     })

# --- Request Handlers ---
@app.before_request
def handle_preflight():
    print(f"🔍 Request: {request.method} {request.path} from {request.headers.get('Origin')}")
    
    if request.method == "OPTIONS":
        response = make_response()
        origin = request.headers.get('Origin')
        print(f"🔍 CORS preflight from origin: {origin}")
        
        if IS_PROD:
            frontend_url = os.environ.get('FRONTEND_URL', 'https://aura-voice-assistant-1.onrender.com')
            allowed_origins_preflight = [
                frontend_url,
                'https://aura-voice-assistant-1.onrender.com',
                'https://aura-voice-assistant.onrender.com'
            ]
        else:
            allowed_origins_preflight = ["http://localhost:5173", "http://127.0.0.1:5173"]
        
        if origin in allowed_origins_preflight:
            response.headers.add("Access-Control-Allow-Origin", origin)
            print(f"✅ CORS allowed for origin: {origin}")
        else:
            print(f"❌ CORS blocked for origin: {origin}")
        
        response.headers.add('Access-Control-Allow-Headers', "Content-Type,Authorization,X-Requested-With")
        response.headers.add('Access-Control-Allow-Methods', "GET,POST,PUT,DELETE,OPTIONS")
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response

@app.after_request
def after_request(response):
    origin = request.headers.get('Origin')
    
    # Only add CORS headers for API routes
    if request.path.startswith('/api/'):
        if IS_PROD:
            frontend_url = os.environ.get('FRONTEND_URL', 'https://aura-voice-assistant-1.onrender.com')
            allowed_origins_after = [
                frontend_url,
                'https://aura-voice-assistant-1.onrender.com',
                'https://aura-voice-assistant.onrender.com'
            ]
        else:
            allowed_origins_after = ["http://localhost:5173", "http://127.0.0.1:5173"]
        
        if origin in allowed_origins_after:
            response.headers.add('Access-Control-Allow-Origin', origin)
            response.headers.add('Access-Control-Allow-Credentials', 'true')
    
    return response

# --- Firebase and AI Setup ---
try:
    if not firebase_admin._apps:
        # Try env variable first (for Render)
        service_account_json = os.environ.get("FIREBASE_SERVICE_ACCOUNT_JSON")

        if service_account_json:
            cred_dict = json.loads(service_account_json)
            # Fix escaped newlines in private key
            if "private_key" in cred_dict:
                cred_dict["private_key"] = cred_dict["private_key"].replace("\\n", "\n")
            cred = credentials.Certificate(cred_dict)
            print("✅ Firebase initialized from env variable.")
        else:
            # Fallback to local file (for dev)
            cred = credentials.Certificate("firebase-service-account.json")
            print("✅ Firebase initialized from local file.")

        firebase_admin.initialize_app(cred)
    
    db = firestore.client()
except Exception as e:
    print(f"❌ Firebase initialization failed: {e}")
    db = None


try:
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    model = genai.GenerativeModel('gemini-2.0-flash')
    print("✅ Gemini AI configured.")
except Exception as e:
    print(f"❌ Gemini config failed: {e}")
    model = None

# --- Helper Functions ---
def get_user_session():
    if 'uid' not in session:
        session['uid'] = str(uuid.uuid4())
        print(f"🔐 New session: {session['uid']}")
    return session['uid']

# ✅ IMPORTANT: Define API routes FIRST before catch-all routes

# --- API Routes (these must be defined before catch-all) ---
@app.route('/api/chat', methods=['POST'])
def api_chat():
    print("🎯 API chat endpoint hit")
    try:
        if not db or not model:
            return jsonify({"error": "Backend services not running."}), 500

        uid = get_user_session()
        chat_ref = db.collection('chats').document(uid)
        data = request.json
        user_prompt = data.get('prompt', '')
        image_base64 = data.get('image_base64')

        if not user_prompt and not image_base64:
            return jsonify({"error": "Prompt or image required."}), 400

        gemini_content = []
        if user_prompt:
            gemini_content.append(user_prompt)

        if image_base64:
            try:
                image_data = base64.b64decode(image_base64)
                img = Image.open(io.BytesIO(image_data))
                gemini_content.append(img)
            except Exception as e:
                print(f"❌ Image decode failed: {e}")
                return jsonify({"error": "Invalid image format."}), 400

        chat_doc = chat_ref.get()
        history = chat_doc.to_dict().get('messages', []) if chat_doc.exists else []
        chat_session = model.start_chat(history=history)
        response = chat_session.send_message(gemini_content)

        def serialize_content(content):
            return {
                "role": content.role,
                "parts": [part.text if hasattr(part, 'text') else str(part) for part in content.parts]
            }

        chat_ref.set({
            "messages": [serialize_content(msg) for msg in chat_session.history]
        })

        return jsonify({"response": response.text})
    except Exception as e:
        print(f"❌ Gemini error: {e}")
        return jsonify({"error": f"Gemini failed to respond: {str(e)}"}), 500

@app.route('/api/get_history', methods=['GET'])
def api_get_history():
    print("🎯 API get_history endpoint hit")
    try:
        uid = get_user_session()
        print(f"👤 Getting history for UID: {uid}")
        
        if not db:
            print("❌ Database not available")
            return jsonify({"error": "Database not available."}), 500
            
        chat_ref = db.collection('chats').document(uid)
        chat_doc = chat_ref.get()

        if chat_doc.exists:
            messages = chat_doc.to_dict().get('messages', [])
            print(f"📜 Retrieved {len(messages)} messages for UID: {uid}")
            return jsonify(messages)
        else:
            print(f"📭 No chat history found for UID: {uid}")
            return jsonify([])
            
    except Exception as e:
        print(f"❌ Error in get_history: {e}")
        return jsonify({"error": f"Failed to get history: {str(e)}"}), 500

@app.route('/api/clear_chat', methods=['POST'])
def api_clear_chat():
    print("🎯 API clear_chat endpoint hit")
    try:
        uid = get_user_session()
        print(f"🗑️ Clearing chat for UID: {uid}")
        
        if not db:
            return jsonify({"error": "Database not available."}), 500
            
        chat_ref = db.collection('chats').document(uid)
        chat_ref.set({"messages": []})
        
        print(f"✅ Chat cleared for UID: {uid}")
        return jsonify({"success": True, "message": "Chat cleared successfully"})
        
    except Exception as e:
        print(f"❌ Error clearing chat: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/info', methods=['GET'])
def api_info():
    print("🎯 API info endpoint hit")
    return jsonify({
        "message": "AURA+ Backend API",
        "version": "1.0.0",
        "status": "running",
        "firebase_connected": db is not None,
        "gemini_connected": model is not None,
        "endpoints": [
            "/api/chat - POST - Send message to AI",
            "/api/get_history - GET - Retrieve chat history", 
            "/api/clear_chat - POST - Clear chat history",
            "/health - GET - Health check"
        ]
    })

@app.route('/health', methods=['GET'])
def health_check():
    print("🎯 Health endpoint hit")
    return jsonify({
        "status": "healthy",
        "environment": os.environ.get('FLASK_ENV', 'development'),
        "firebase_connected": db is not None,
        "gemini_connected": model is not None,
        "frontend_url": os.environ.get('FRONTEND_URL', 'https://aura-voice-assistant-1.onrender.com') if IS_PROD else 'localhost:5173',
        "allowed_origins": allowed_origins
    })

# --- Legacy Routes (for backward compatibility) ---
@app.route('/chat', methods=['POST'])
def legacy_chat():
    print("🔄 Legacy chat route - redirecting to API")
    return api_chat()

@app.route('/get_history', methods=['GET'])
def legacy_get_history():
    print("🔄 Legacy get_history route - redirecting to API")
    return api_get_history()

@app.route('/clear_chat', methods=['POST'])
def legacy_clear_chat():
    print("🔄 Legacy clear_chat route - redirecting to API")
    return api_clear_chat()

# ✅ IMPORTANT: React serving routes MUST be defined LAST

# --- React Serving Routes ---
@app.route('/')
def serve_root():
    if IS_PROD:
        print("📄 Serving React root (Production)")
        try:
            # Check multiple possible locations for React build
            possible_locations = [
                os.path.join(app.static_folder, 'index.html') if app.static_folder else None,
                os.path.join(os.getcwd(), 'client', 'build', 'index.html'),
                os.path.join(os.getcwd(), 'client', 'dist', 'index.html'),
                os.path.join(os.getcwd(), 'build', 'index.html'),
                os.path.join(os.getcwd(), 'dist', 'index.html'),
            ]
            
            print(f"🔍 Looking for React build in:")
            for location in possible_locations:
                if location:
                    print(f"   - {location}")
                    if os.path.exists(location):
                        print(f"✅ Found React build at: {location}")
                        return send_file(location)
            
            print("❌ React build not found in any expected location")
            return jsonify({
                "error": "React build not found",
                "message": "Please build your React app first",
                "expected_locations": [loc for loc in possible_locations if loc],
                "current_directory": os.getcwd(),
                "static_folder": app.static_folder,
                "suggestion": "Run 'npm run build' in your React app directory"
            }), 404
            
        except Exception as e:
            print(f"❌ Error serving React root: {e}")
            return jsonify({"error": "Failed to serve application"}), 500
    else:
        print("📄 Development mode - Backend API only")
        return jsonify({
            "message": "AURA+ Backend API - Development Mode",
            "status": "running",
            "mode": "development",
            "frontend": "Run React dev server separately on http://localhost:5173",
            "api_endpoints": {
                "chat": "/api/chat",
                "history": "/api/get_history",
                "clear": "/api/clear_chat",
                "info": "/api/info",
                "health": "/health"
            },
            "firebase_connected": db is not None,
            "gemini_connected": model is not None,
            "note": "Visit http://localhost:5173 for the React frontend"
        })

@app.route('/<path:filename>')
def serve_static_or_react(filename):
    # Skip API routes - they should never reach here
    if filename.startswith('api/'):
        print(f"❌ API route {filename} reached catch-all - this should not happen")
        return jsonify({"error": f"API endpoint /{filename} not found"}), 404
    
    if IS_PROD:
        # Check if it's a static file first
        if '.' in filename:
            static_path = os.path.join(app.static_folder, filename)
            if os.path.exists(static_path):
                print(f"📁 Serving static file: {filename}")
                return send_from_directory(app.static_folder, filename)
        
        # For all other paths (like /chatbot), serve React app
        print(f"📄 Serving React app for path: {filename}")
        try:
            index_path = os.path.join(app.static_folder, 'index.html')
            if os.path.exists(index_path):
                return send_file(index_path)
            else:
                print("❌ React build index.html not found")
                return jsonify({"error": "React build not found"}), 404
        except Exception as e:
            print(f"❌ Error serving React for {filename}: {e}")
            return jsonify({"error": "Failed to serve application"}), 500
    else:
        print(f"📄 Development mode - {filename} not found")
        return jsonify({
            "error": f"Path /{filename} not found in development mode",
            "message": "Run React dev server separately",
            "react_dev_server": "http://localhost:5173"
        }), 404

# --- Error Handlers ---
@app.errorhandler(404)
def not_found(error):
    print(f"❌ 404 Error for path: {request.path}")
    
    if request.path.startswith('/api/'):
        print(f"❌ API endpoint not found: {request.path}")
        return jsonify({"error": f"API endpoint {request.path} not found"}), 404
    
    if IS_PROD:
        print(f"📄 404 - serving React app for: {request.path}")
        try:
            index_path = os.path.join(app.static_folder, 'index.html')
            if os.path.exists(index_path):
                return send_file(index_path)
            else:
                print("❌ React build index.html not found in 404 handler")
        except Exception as e:
            print(f"❌ Error in 404 handler: {e}")
    else:
        print(f"📄 Development mode - 404 for: {request.path}")
        return jsonify({
            "error": f"Path {request.path} not found in development mode",
            "message": "This is the Flask backend API only. Run React dev server separately.",
            "react_dev_server": "http://localhost:5173",
            "available_endpoints": ["/api/chat", "/api/get_history", "/api/clear_chat", "/api/info", "/health"]
        }), 404
    
    return jsonify({"error": "Not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    print(f"❌ Internal server error: {error}")
    return jsonify({"error": "Internal server error"}), 500

# --- Run Server ---
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug_mode = os.environ.get('FLASK_ENV') != 'production'
    
    print(f"🚀 Starting server on port {port}")
    print(f"🔧 Debug mode: {debug_mode}")
    print(f"🌍 Environment: {os.environ.get('FLASK_ENV', 'development')}")
    print(f"🗂️ Static folder: {app.static_folder}")
    
    if debug_mode:
        print("📝 Development mode - API endpoints:")
        print("   - http://localhost:5000/api/chat")
        print("   - http://localhost:5000/api/get_history")
        print("   - http://localhost:5000/api/clear_chat")
        print("   - http://localhost:5000/health")
        print("🚀 Start React dev server with: npm run dev (on port 5173)")
        print("🌐 Access React app at: http://localhost:5173")
    else:
        frontend_url = os.environ.get('FRONTEND_URL', 'https://aura-voice-assistant-1.onrender.com')
        print(f"🌐 Production frontend URL: {frontend_url}")
        print(f"🌐 Allowed CORS origins: {allowed_origins}")
        print("📝 Production API endpoints:")
        print("   - /api/chat")
        print("   - /api/get_history") 
        print("   - /api/clear_chat")
        print("   - /health")
        
        # Check if React build exists
        if app.static_folder and os.path.exists(app.static_folder):
            index_path = os.path.join(app.static_folder, 'index.html')
            if os.path.exists(index_path):
                print("✅ React build found")
            else:
                print("❌ React build index.html not found!")
        else:
            print("❌ Static folder not found!")
    
    app.run(host='0.0.0.0', port=port, debug=debug_mode)
