# import os
# import io
# import base64
# from flask import Flask, request, jsonify, session, send_from_directory, send_file, make_response
# from flask_cors import CORS
# from dotenv import load_dotenv
# from PIL import Image
# import json
# import google.generativeai as genai
# import firebase_admin
# from firebase_admin import credentials, firestore, auth, initialize_app
# import uuid

# # --- Initial Setup ---
# load_dotenv()

# # For development - serve React dev server files
# # For production - serve React build files
# if os.environ.get('FLASK_ENV') == 'production':
#     app = Flask(__name__, static_folder='client/build', static_url_path='')
# else:
#     app = Flask(__name__)

# app.secret_key = os.getenv('FLASK_SECRET_KEY', os.urandom(24))

# # ✅ Fixed CORS configuration
# IS_PROD = os.environ.get('FLASK_ENV') == 'production'

# if IS_PROD:
#     allowed_origins = ['https://aura-voice-assistant-1.onrender.com']  # 👈 Exact frontend domain
#     print(f"🌐 Production CORS origins: {allowed_origins}")
# else:
#     allowed_origins = ['http://localhost:5173', 'http://127.0.0.1:5173']
#     print("🌐 Development CORS origins: localhost")

# CORS(app, 
#      resources={r"/*": {
#          "origins": allowed_origins,
#          "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
#          "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"],
#          "supports_credentials": True
#      }})

# # Handle preflight OPTIONS requests explicitly
# @app.before_request
# def handle_preflight():
#     if request.method == "OPTIONS":
#         response = make_response()
        
#         # Get the origin from the request
#         origin = request.headers.get('Origin')
        
#         if os.environ.get('FLASK_ENV') == 'production':
#             allowed_origins = os.environ.get('ALLOWED_ORIGINS', 'https://aura-voice-assistant.onrender.com').split(',')
#             allowed_origins = [origin.strip() for origin in allowed_origins]
#         else:
#             allowed_origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
        
#         if origin in allowed_origins:
#             response.headers.add("Access-Control-Allow-Origin", origin)
        
#         response.headers.add('Access-Control-Allow-Headers', "Content-Type,Authorization,X-Requested-With")
#         response.headers.add('Access-Control-Allow-Methods', "GET,POST,PUT,DELETE,OPTIONS")
#         response.headers.add('Access-Control-Allow-Credentials', 'true')
        
#         return response

# # --- Firebase Admin Init ---
# try:
#     if not firebase_admin._apps:  # prevents double-initialization on reloads
#         service_account_json = os.environ.get("FIREBASE_SERVICE_ACCOUNT_JSON")
#         if not service_account_json:
#             raise ValueError("Missing FIREBASE_SERVICE_ACCOUNT_JSON environment variable")

#         cred_dict = json.loads(service_account_json)
#         cred = credentials.Certificate(cred_dict)
#         firebase_admin.initialize_app(cred)
#         print("✅ Firebase Admin SDK initialized.")
#     db = firestore.client()
# except Exception as e:
#     print(f"❌ Firebase initialization failed: {e}")
#     db = None

# # --- Gemini AI Init ---
# try:
#     genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
#     model = genai.GenerativeModel('gemini-2.0-flash')
#     print("✅ Gemini AI configured.")
# except Exception as e:
#     print(f"❌ Gemini config failed: {e}")
#     model = None

# # --- Helper: Manage User Sessions ---
# def get_user_session():
#     if 'uid' not in session:
#         session['uid'] = str(uuid.uuid4())  # anonymous unique ID
#         print(f"🔐 New session: {session['uid']}")
#     return session['uid']

# # --- API Routes (prefixed with /api for clarity) ---
# @app.route('/chat', methods=['POST'])
# def chat():
#     if not db or not model:
#         return jsonify({"error": "Backend services not running."}), 500

#     uid = get_user_session()
#     chat_ref = db.collection('chats').document(uid)
#     data = request.json
#     user_prompt = data.get('prompt', '')
#     image_base64 = data.get('image_base64')

#     if not user_prompt and not image_base64:
#         return jsonify({"error": "Prompt or image required."}), 400

#     gemini_content = []
#     if user_prompt:
#         gemini_content.append(user_prompt)

#     if image_base64:
#         try:
#             image_data = base64.b64decode(image_base64)
#             img = Image.open(io.BytesIO(image_data))
#             gemini_content.append(img)
#         except Exception as e:
#             print(f"❌ Image decode failed: {e}")
#             return jsonify({"error": "Invalid image format."}), 400

#     try:
#         # Fetch existing history from Firestore
#         chat_doc = chat_ref.get()
#         history = chat_doc.to_dict().get('messages', []) if chat_doc.exists else []

#         # Start Gemini chat with history
#         chat_session = model.start_chat(history=history)
#         response = chat_session.send_message(gemini_content)

#         # Serialize Gemini response for storage
#         def serialize_content(content):
#             return {
#                 "role": content.role,
#                 "parts": [part.text if hasattr(part, 'text') else str(part) for part in content.parts]
#             }

#         # Store updated history
#         chat_ref.set({
#             "messages": [serialize_content(msg) for msg in chat_session.history]
#         })

#         return jsonify({"response": response.text})
#     except Exception as e:
#         print(f"❌ Gemini error: {e}")
#         return jsonify({"error": "Gemini failed to respond."}), 500

# @app.route('/get_history', methods=['GET'])
# def get_history():
#     try:
#         uid = get_user_session()
#         print(f"👤 UID: {uid}")
        
#         if not db:
#             return jsonify({"error": "Database not available."}), 500
            
#         chat_ref = db.collection('chats').document(uid)
#         chat_doc = chat_ref.get()

#         if chat_doc.exists:
#             messages = chat_doc.to_dict().get('messages', [])
#             print(f"📜 Retrieved {len(messages)} messages.")
#             return jsonify(messages)
#         else:
#             print("📭 No chat history found.")
#             return jsonify([])
#     except Exception as e:
#         print(f"❌ Error in get_history: {e}")
#         return jsonify({"error": str(e)}), 500

# @app.route('/clear_chat', methods=['POST'])
# def clear_chat():
#     """Clear the chat history for the current user session"""
#     try:
#         uid = get_user_session()
#         print(f"🗑️ Clearing chat for UID: {uid}")
        
#         if not db:
#             return jsonify({"error": "Database not available."}), 500
            
#         chat_ref = db.collection('chats').document(uid)
        
#         # Delete the document or set empty messages
#         chat_ref.set({"messages": []})
        
#         print(f"✅ Chat cleared for UID: {uid}")
#         return jsonify({"success": True, "message": "Chat cleared successfully"})
        
#     except Exception as e:
#         print(f"❌ Error clearing chat: {e}")
#         return jsonify({"error": str(e)}), 500

# # --- Frontend React Serve (for production only) ---
# if os.environ.get('FLASK_ENV') == 'production':
#     @app.route('/', defaults={'path': ''})
#     @app.route('/<path:path>')
#     def serve_react(path):
#         try:
#             # Check if it's a static file request
#             if path and ('.' in path or path.startswith('static/')):
#                 file_path = os.path.join(app.static_folder, path)
#                 if os.path.exists(file_path):
#                     return send_from_directory(app.static_folder, path)
            
#             # For all other routes (including /chatbot), serve index.html
#             index_path = os.path.join(app.static_folder, 'index.html')
#             if os.path.exists(index_path):
#                 return send_file(index_path)
#             else:
#                 return jsonify({"error": "React build not found. Run 'npm run build' first."}), 404
                
#         except Exception as e:
#             print(f"❌ Error serving React app: {e}")
#             return jsonify({"error": "Failed to serve application"}), 500

# # --- Health Check Route ---
# @app.route('/health')
# def health_check():
#     return jsonify({
#         "status": "healthy",
#         "environment": os.environ.get('FLASK_ENV', 'development'),
#         "firebase_connected": db is not None,
#         "gemini_connected": model is not None,
#         "cors_origins": os.environ.get('ALLOWED_ORIGINS', 'https://aura-voice-assistant.onrender.com') if os.environ.get('FLASK_ENV') == 'production' else 'localhost:5173'
#     })

# # --- Development Route Info ---
# @app.route('/api/info')
# def api_info():
#     return jsonify({
#         "message": "AURA+ Backend API",
#         "version": "1.0.0",
#         "endpoints": [
#             "/chat - POST - Send message to AI",
#             "/get_history - GET - Retrieve chat history", 
#             "/clear_chat - POST - Clear chat history",
#             "/health - GET - Health check"
#         ]
#     })

# # --- Error Handlers ---
# @app.errorhandler(404)
# def not_found(error):
#     if os.environ.get('FLASK_ENV') == 'production':
#         # In production, serve React app for 404s (client-side routing)
#         index_path = os.path.join(app.static_folder, 'index.html')
#         if os.path.exists(index_path):
#             return send_file(index_path)
#     return jsonify({"error": "Not found"}), 404

# @app.errorhandler(500)
# def internal_error(error):
#     return jsonify({"error": "Internal server error"}), 500

# # --- Run Server ---
# if __name__ == '__main__':
#     port = int(os.environ.get('PORT', 5000))
#     debug_mode = os.environ.get('FLASK_ENV') != 'production'
    
#     print(f"🚀 Starting server on port {port}")
#     print(f"🔧 Debug mode: {debug_mode}")
#     print(f"🌍 Environment: {os.environ.get('FLASK_ENV', 'development')}")
    
#     if debug_mode:
#         print("📝 In development mode - React dev server should run separately on port 5173")
#         print("📝 Make sure to run: npm run dev")
#     else:
#         print(f"🌐 Production CORS origins: {os.environ.get('ALLOWED_ORIGINS', 'https://aura-voice-assistant.onrender.com')}")
    
#     app.run(host='0.0.0.0', port=port, debug=debug_mode)

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

# For development - serve React dev server files
# For production - serve React build files
if os.environ.get('FLASK_ENV') == 'production':
    app = Flask(__name__, static_folder='client/build', static_url_path='')
else:
    app = Flask(__name__)

app.secret_key = os.getenv('FLASK_SECRET_KEY', os.urandom(24))

# ✅ FIXED CORS configuration
IS_PROD = os.environ.get('FLASK_ENV') == 'production'

if IS_PROD:
    # ✅ CRITICAL FIX: Include both URLs and get from environment variable
    frontend_url = os.environ.get('FRONTEND_URL', 'https://aura-voice-assistant-1.onrender.com')
    allowed_origins = [
        frontend_url,
        'https://aura-voice-assistant-1.onrender.com',  # Your actual frontend
        'https://aura-voice-assistant.onrender.com'    # Backup URL
    ]
    print(f"🌐 Production CORS origins: {allowed_origins}")
else:
    allowed_origins = ['http://localhost:5173', 'http://127.0.0.1:5173']
    print("🌐 Development CORS origins: localhost")

CORS(app, 
     resources={r"/*": {
         "origins": allowed_origins,
         "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"],
         "supports_credentials": True
     }})

# ✅ IMPROVED preflight handler
@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = make_response()
        
        # Get the origin from the request
        origin = request.headers.get('Origin')
        print(f"🔍 CORS preflight from origin: {origin}")
        
        if IS_PROD:
            # Use the same allowed origins as above
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
            print(f"   Allowed origins: {allowed_origins_preflight}")
        
        response.headers.add('Access-Control-Allow-Headers', "Content-Type,Authorization,X-Requested-With")
        response.headers.add('Access-Control-Allow-Methods', "GET,POST,PUT,DELETE,OPTIONS")
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        
        return response

# --- Firebase Admin Init ---
try:
    if not firebase_admin._apps:  # prevents double-initialization on reloads
        service_account_json = os.environ.get("FIREBASE_SERVICE_ACCOUNT_JSON")
        if not service_account_json:
            raise ValueError("Missing FIREBASE_SERVICE_ACCOUNT_JSON environment variable")

        cred_dict = json.loads(service_account_json)
        cred = credentials.Certificate(cred_dict)
        firebase_admin.initialize_app(cred)
        print("✅ Firebase Admin SDK initialized.")
    db = firestore.client()
except Exception as e:
    print(f"❌ Firebase initialization failed: {e}")
    db = None

# --- Gemini AI Init ---
try:
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    model = genai.GenerativeModel('gemini-2.0-flash')
    print("✅ Gemini AI configured.")
except Exception as e:
    print(f"❌ Gemini config failed: {e}")
    model = None

# --- Helper: Manage User Sessions ---
def get_user_session():
    if 'uid' not in session:
        session['uid'] = str(uuid.uuid4())  # anonymous unique ID
        print(f"🔐 New session: {session['uid']}")
    return session['uid']

# ✅ ADDED: CORS headers to all API responses
@app.after_request
def after_request(response):
    origin = request.headers.get('Origin')
    
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

# --- API Routes ---
@app.route('/chat', methods=['POST'])
def chat():
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

    try:
        # Fetch existing history from Firestore
        chat_doc = chat_ref.get()
        history = chat_doc.to_dict().get('messages', []) if chat_doc.exists else []

        # Start Gemini chat with history
        chat_session = model.start_chat(history=history)
        response = chat_session.send_message(gemini_content)

        # Serialize Gemini response for storage
        def serialize_content(content):
            return {
                "role": content.role,
                "parts": [part.text if hasattr(part, 'text') else str(part) for part in content.parts]
            }

        # Store updated history
        chat_ref.set({
            "messages": [serialize_content(msg) for msg in chat_session.history]
        })

        return jsonify({"response": response.text})
    except Exception as e:
        print(f"❌ Gemini error: {e}")
        return jsonify({"error": "Gemini failed to respond."}), 500

@app.route('/get_history', methods=['GET'])
def get_history():
    try:
        uid = get_user_session()
        print(f"👤 Getting history for UID: {uid}")
        
        if not db:
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
        return jsonify({"error": str(e)}), 500

@app.route('/clear_chat', methods=['POST'])
def clear_chat():
    """Clear the chat history for the current user session"""
    try:
        uid = get_user_session()
        print(f"🗑️ Clearing chat for UID: {uid}")
        
        if not db:
            return jsonify({"error": "Database not available."}), 500
            
        chat_ref = db.collection('chats').document(uid)
        
        # Delete the document or set empty messages
        chat_ref.set({"messages": []})
        
        print(f"✅ Chat cleared for UID: {uid}")
        return jsonify({"success": True, "message": "Chat cleared successfully"})
        
    except Exception as e:
        print(f"❌ Error clearing chat: {e}")
        return jsonify({"error": str(e)}), 500

# --- Frontend React Serve (for production only) ---
if os.environ.get('FLASK_ENV') == 'production':
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_react(path):
        try:
            # Check if it's a static file request
            if path and ('.' in path or path.startswith('static/')):
                file_path = os.path.join(app.static_folder, path)
                if os.path.exists(file_path):
                    return send_from_directory(app.static_folder, path)
            
            # For all other routes (including /chatbot), serve index.html
            index_path = os.path.join(app.static_folder, 'index.html')
            if os.path.exists(index_path):
                return send_file(index_path)
            else:
                return jsonify({"error": "React build not found. Run 'npm run build' first."}), 404
                
        except Exception as e:
            print(f"❌ Error serving React app: {e}")
            return jsonify({"error": "Failed to serve application"}), 500

# --- Health Check Route ---
@app.route('/health')
def health_check():
    return jsonify({
        "status": "healthy",
        "environment": os.environ.get('FLASK_ENV', 'development'),
        "firebase_connected": db is not None,
        "gemini_connected": model is not None,
        "frontend_url": os.environ.get('FRONTEND_URL', 'https://aura-voice-assistant-1.onrender.com') if IS_PROD else 'localhost:5173',
        "allowed_origins": allowed_origins
    })

# --- Development Route Info ---
@app.route('/api/info')
def api_info():
    return jsonify({
        "message": "AURA+ Backend API",
        "version": "1.0.0",
        "endpoints": [
            "/chat - POST - Send message to AI",
            "/get_history - GET - Retrieve chat history", 
            "/clear_chat - POST - Clear chat history",
            "/health - GET - Health check"
        ]
    })

# --- Error Handlers ---
@app.errorhandler(404)
def not_found(error):
    if os.environ.get('FLASK_ENV') == 'production':
        # In production, serve React app for 404s (client-side routing)
        index_path = os.path.join(app.static_folder, 'index.html')
        if os.path.exists(index_path):
            return send_file(index_path)
    return jsonify({"error": "Not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

# --- Run Server ---
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug_mode = os.environ.get('FLASK_ENV') != 'production'
    
    print(f"🚀 Starting server on port {port}")
    print(f"🔧 Debug mode: {debug_mode}")
    print(f"🌍 Environment: {os.environ.get('FLASK_ENV', 'development')}")
    
    if debug_mode:
        print("📝 In development mode")
    else:
        frontend_url = os.environ.get('FRONTEND_URL', 'https://aura-voice-assistant-1.onrender.com')
        print(f"🌐 Production frontend URL: {frontend_url}")
        print(f"🌐 Allowed CORS origins: {allowed_origins}")
    
    app.run(host='0.0.0.0', port=port, debug=debug_mode)