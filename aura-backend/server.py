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

# # Create Flask app
# app = Flask(__name__, static_folder='static', static_url_path='')
# app.secret_key = os.getenv('FLASK_SECRET_KEY', os.urandom(24))

# # --- Environment Detection ---
# IS_PROD = (
#     os.environ.get('FLASK_ENV') == 'production' or 
#     os.environ.get('NODE_ENV') == 'production' or
#     os.environ.get('RENDER') is not None or
#     os.environ.get('HEROKU') is not None
# )

# print(f"🔍 Environment: {'Production' if IS_PROD else 'Development'}")
# print(f"🔍 RENDER env var: {os.environ.get('RENDER')}")
# print(f"🔍 Static folder: {app.static_folder}")

# # --- CORS Configuration ---
# if IS_PROD:
#     # Production CORS - be more permissive for debugging
#     allowed_origins = [
#         'https://aura-voice-assistant-1.onrender.com',
#         'https://aura-voice-assistant.onrender.com',
#         os.environ.get('FRONTEND_URL', 'https://aura-voice-assistant-1.onrender.com')
#     ]
# else:
#     # Development CORS
#     allowed_origins = [
#         'http://localhost:5173',
#         'http://127.0.0.1:5173',
#         'http://localhost:3000',
#         'http://127.0.0.1:3000'
#     ]

# print(f"🌐 CORS origins: {allowed_origins}")

# # Enhanced CORS setup
# CORS(app, 
#      origins=allowed_origins,
#      supports_credentials=True,
#      allow_headers=['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
#      methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
#      expose_headers=['Content-Type'])

# # --- Request logging middleware ---
# @app.before_request
# def log_request_info():
#     print(f"🔍 {request.method} {request.path} from {request.headers.get('Origin', 'No Origin')}")
#     print(f"🔍 User-Agent: {request.headers.get('User-Agent', 'Unknown')}")
#     if request.method == 'POST' and request.is_json:
#         print(f"🔍 Request body keys: {list(request.json.keys()) if request.json else 'None'}")

# # --- Firebase and AI Setup ---
# try:
#     if not firebase_admin._apps:
#         service_account_json = os.environ.get("FIREBASE_SERVICE_ACCOUNT_JSON")
#         if service_account_json:
#             cred_dict = json.loads(service_account_json)
#             if "private_key" in cred_dict:
#                 cred_dict["private_key"] = cred_dict["private_key"].replace("\\n", "\n")
#             cred = credentials.Certificate(cred_dict)
#             print("✅ Firebase initialized from env variable.")
#         else:
#             cred = credentials.Certificate("firebase-service-account.json")
#             print("✅ Firebase initialized from local file.")
#         firebase_admin.initialize_app(cred)
#         db = firestore.client()
# except Exception as e:
#     print(f"❌ Firebase initialization failed: {e}")
#     db = None

# try:
#     genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
#     model = genai.GenerativeModel('gemini-2.0-flash')
#     print("✅ Gemini AI configured.")
# except Exception as e:
#     print(f"❌ Gemini config failed: {e}")
#     model = None

# # --- Helper Functions ---
# def get_user_session():
#     if 'uid' not in session:
#         session['uid'] = str(uuid.uuid4())
#         print(f"🔐 New session: {session['uid']}")
#     return session['uid']

# def create_json_response(data, status=200):
#     """Helper to ensure proper JSON responses"""
#     response = make_response(jsonify(data), status)
#     response.headers['Content-Type'] = 'application/json'
#     return response

# # --- API Routes ---
# @app.route('/api/chat', methods=['POST', 'OPTIONS'])
# def api_chat():
#     if request.method == 'OPTIONS':
#         return make_response('', 200)
    
#     print("🎯 API chat endpoint hit")
#     try:
#         if not db or not model:
#             return create_json_response({"error": "Backend services not running."}, 500)

#         uid = get_user_session()
#         chat_ref = db.collection('chats').document(uid)
#         data = request.json
        
#         if not data:
#             return create_json_response({"error": "No JSON data received"}, 400)
            
#         user_prompt = data.get('prompt', '')
#         image_base64 = data.get('image_base64')

#         if not user_prompt and not image_base64:
#             return create_json_response({"error": "Prompt or image required."}, 400)

#         gemini_content = []
#         if user_prompt:
#             gemini_content.append(user_prompt)
#         if image_base64:
#             try:
#                 image_data = base64.b64decode(image_base64)
#                 img = Image.open(io.BytesIO(image_data))
#                 gemini_content.append(img)
#             except Exception as e:
#                 print(f"❌ Image decode failed: {e}")
#                 return create_json_response({"error": "Invalid image format."}, 400)

#         chat_doc = chat_ref.get()
#         history = chat_doc.to_dict().get('messages', []) if chat_doc.exists else []
#         chat_session = model.start_chat(history=history)
#         response = chat_session.send_message(gemini_content)

#         def serialize_content(content):
#             return {
#                 "role": content.role,
#                 "parts": [part.text if hasattr(part, 'text') else str(part) for part in content.parts]
#             }

#         chat_ref.set({
#             "messages": [serialize_content(msg) for msg in chat_session.history]
#         })

#         return create_json_response({"response": response.text})

#     except Exception as e:
#         print(f"❌ Gemini error: {e}")
#         return create_json_response({"error": f"Gemini failed to respond: {str(e)}"}, 500)

# @app.route('/api/get_history', methods=['GET', 'OPTIONS'])
# def api_get_history():
#     if request.method == 'OPTIONS':
#         return make_response('', 200)
    
#     print("🎯 API get_history endpoint hit")
#     try:
#         uid = get_user_session()
#         print(f"👤 Getting history for UID: {uid}")
        
#         if not db:
#             print("❌ Database not available")
#             return create_json_response({"error": "Database not available."}, 500)
        
#         chat_ref = db.collection('chats').document(uid)
#         chat_doc = chat_ref.get()
        
#         if chat_doc.exists:
#             messages = chat_doc.to_dict().get('messages', [])
#             print(f"📜 Retrieved {len(messages)} messages for UID: {uid}")
#             return create_json_response(messages)
#         else:
#             print(f"📭 No chat history found for UID: {uid}")
#             return create_json_response([])
            
#     except Exception as e:
#         print(f"❌ Error in get_history: {e}")
#         return create_json_response({"error": f"Failed to get history: {str(e)}"}, 500)

# @app.route('/api/clear_chat', methods=['POST', 'OPTIONS'])
# def api_clear_chat():
#     if request.method == 'OPTIONS':
#         return make_response('', 200)
    
#     print("🎯 API clear_chat endpoint hit")
#     try:
#         uid = get_user_session()
#         print(f"🗑️ Clearing chat for UID: {uid}")
        
#         if not db:
#             return create_json_response({"error": "Database not available."}, 500)
        
#         chat_ref = db.collection('chats').document(uid)
#         chat_ref.set({"messages": []})
        
#         print(f"✅ Chat cleared for UID: {uid}")
#         return create_json_response({"success": True, "message": "Chat cleared successfully"})
        
#     except Exception as e:
#         print(f"❌ Error clearing chat: {e}")
#         return create_json_response({"error": str(e)}, 500)

# @app.route('/api/info', methods=['GET'])
# def api_info():
#     print("🎯 API info endpoint hit")
#     return create_json_response({
#         "message": "AURA+ Backend API",
#         "version": "1.0.0",
#         "status": "running",
#         "firebase_connected": db is not None,
#         "gemini_connected": model is not None,
#         "environment": "production" if IS_PROD else "development",
#         "cors_origins": allowed_origins,
#         "endpoints": [
#             "/api/chat - POST - Send message to AI",
#             "/api/get_history - GET - Retrieve chat history", 
#             "/api/clear_chat - POST - Clear chat history",
#             "/health - GET - Health check"
#         ]
#     })

# @app.route('/health', methods=['GET'])
# def health_check():
#     print("🎯 Health endpoint hit")
#     return create_json_response({
#         "status": "healthy",
#         "environment": "production" if IS_PROD else "development",
#         "firebase_connected": db is not None,
#         "gemini_connected": model is not None,
#         "allowed_origins": allowed_origins,
#         "static_folder_exists": app.static_folder and os.path.exists(app.static_folder) if app.static_folder else False
#     })

# # --- React App Routes (Production Only) ---
# @app.route('/')
# def serve_root():
#     if IS_PROD:
#         print("📄 Serving React root (Production)")
#         try:
#             if app.static_folder and os.path.exists(os.path.join(app.static_folder, 'index.html')):
#                 return send_file(os.path.join(app.static_folder, 'index.html'))
#             else:
#                 return create_json_response({
#                     "error": "React build not found",
#                     "message": "Please build your React app first",
#                     "static_folder": app.static_folder,
#                     "static_exists": os.path.exists(app.static_folder) if app.static_folder else False
#                 }, 404)
#         except Exception as e:
#             print(f"❌ Error serving React root: {e}")
#             return create_json_response({"error": "Failed to serve application"}, 500)
#     else:
#         return create_json_response({
#             "message": "AURA+ Backend API - Development Mode",
#             "status": "running",
#             "frontend": "Run React dev server separately on http://localhost:5173",
#             "api_endpoints": {
#                 "chat": "/api/chat",
#                 "history": "/api/get_history",
#                 "clear": "/api/clear_chat",
#                 "info": "/api/info",
#                 "health": "/health"
#             },
#             "note": "This is the Flask backend. Start React with 'npm run dev'"
#         })

# # --- Static Files and React Routing (Production Only) ---
# @app.route('/<path:filename>')
# def serve_static_or_react(filename):
#     # Ensure API routes never reach here
#     if filename.startswith('api/'):
#         print(f"❌ API route {filename} reached catch-all - this should not happen")
#         return create_json_response({"error": f"API endpoint /{filename} not found"}, 404)
    
#     if IS_PROD:
#         # Serve static files first
#         if '.' in filename and app.static_folder:
#             static_path = os.path.join(app.static_folder, filename)
#             if os.path.exists(static_path):
#                 print(f"📁 Serving static file: {filename}")
#                 return send_from_directory(app.static_folder, filename)
        
#         # For all other paths (like /chatbot), serve React app
#         print(f"📄 Serving React app for path: /{filename}")
#         try:
#             if app.static_folder and os.path.exists(os.path.join(app.static_folder, 'index.html')):
#                 return send_file(os.path.join(app.static_folder, 'index.html'))
#             else:
#                 return create_json_response({
#                     "error": "React build not found",
#                     "path": filename,
#                     "static_folder": app.static_folder
#                 }, 404)
#         except Exception as e:
#             print(f"❌ Error serving React for {filename}: {e}")
#             return create_json_response({"error": "Failed to serve application"}, 500)
#     else:
#         return create_json_response({
#             "error": f"Path /{filename} not found in development mode",
#             "message": "This is the Flask backend. Run React dev server at http://localhost:5173"
#         }, 404)

# # --- Error Handlers ---
# @app.errorhandler(404)
# def not_found(error):
#     print(f"❌ 404 Error for path: {request.path}")
    
#     # API endpoints should return JSON errors
#     if request.path.startswith('/api/'):
#         return create_json_response({"error": f"API endpoint {request.path} not found"}, 404)
    
#     # In production, serve React app for non-API 404s
#     if IS_PROD and app.static_folder:
#         try:
#             index_path = os.path.join(app.static_folder, 'index.html')
#             if os.path.exists(index_path):
#                 return send_file(index_path)
#         except Exception as e:
#             print(f"❌ Error in 404 handler: {e}")
    
#     return create_json_response({"error": "Not found", "path": request.path}, 404)

# @app.errorhandler(500)
# def internal_error(error):
#     print(f"❌ Internal server error: {error}")
#     return create_json_response({"error": "Internal server error"}, 500)

# # --- Run Server ---
# if __name__ == '__main__':
#     port = int(os.environ.get('PORT', 5000))
#     debug_mode = not IS_PROD
    
#     print(f"🚀 Starting server on port {port}")
#     print(f"🔧 Debug mode: {debug_mode}")
    
#     if debug_mode:
#         print("📝 Development API endpoints:")
#         print("   - http://127.0.0.1:5000/api/chat")
#         print("   - http://127.0.0.1:5000/api/get_history")
#         print("   - http://127.0.0.1:5000/api/clear_chat")
#         print("   - http://127.0.0.1:5000/health")
#         print("🚀 Start React dev server with: npm run dev")
#     else:
#         print("📝 Production mode - serving React app and API")
#         if app.static_folder:
#             print(f"📁 Static folder: {app.static_folder}")
#             print(f"📁 Static exists: {os.path.exists(app.static_folder)}")
    
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

# Create Flask app
app = Flask(__name__, static_folder='static', static_url_path='')
app.secret_key = os.getenv('FLASK_SECRET_KEY', os.urandom(24))

# --- Environment Detection ---
IS_PROD = (
    os.environ.get('FLASK_ENV') == 'production' or 
    os.environ.get('NODE_ENV') == 'production' or
    os.environ.get('RENDER') is not None or
    os.environ.get('HEROKU') is not None
)

print(f"🔍 Environment: {'Production' if IS_PROD else 'Development'}")
print(f"🔍 RENDER env var: {os.environ.get('RENDER')}")
print(f"🔍 Static folder: {app.static_folder}")

# --- Dynamic CORS Configuration ---
def get_allowed_origins():
    """Dynamically determine allowed origins based on environment"""
    if IS_PROD:
        # In production, allow same-origin requests and common variations
        origins = []
        
        # Get the current domain from environment or request
        current_domain = os.environ.get('RENDER_EXTERNAL_URL')
        if current_domain:
            origins.append(current_domain)
            # Add common variations
            if current_domain.startswith('https://'):
                origins.append(current_domain.replace('https://', 'http://'))
        
        # Add any custom frontend URL if specified
        frontend_url = os.environ.get('FRONTEND_URL')
        if frontend_url and frontend_url not in origins:
            origins.append(frontend_url)
        
        # Fallback: allow any origin in production (less secure but more flexible)
        if not origins:
            return ['*']
        
        return origins
    else:
        # Development origins
        return [
            'http://localhost:5173',
            'http://127.0.0.1:5173',
            'http://localhost:3000',
            'http://127.0.0.1:3000'
        ]

allowed_origins = get_allowed_origins()
print(f"🌐 CORS origins: {allowed_origins}")

# Enhanced CORS setup
CORS(app, 
     origins=allowed_origins,
     supports_credentials=True,
     allow_headers=['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
     expose_headers=['Content-Type'])

# --- Request logging middleware ---
@app.before_request
def log_request_info():
    print(f"🔍 {request.method} {request.path} from {request.headers.get('Origin', 'No Origin')}")
    print(f"🔍 User-Agent: {request.headers.get('User-Agent', 'Unknown')}")
    if request.method == 'POST' and request.is_json:
        print(f"🔍 Request body keys: {list(request.json.keys()) if request.json else 'None'}")

# --- Firebase and AI Setup ---
try:
    if not firebase_admin._apps:
        service_account_json = os.environ.get("FIREBASE_SERVICE_ACCOUNT_JSON")
        if service_account_json:
            cred_dict = json.loads(service_account_json)
            if "private_key" in cred_dict:
                cred_dict["private_key"] = cred_dict["private_key"].replace("\\n", "\n")
            cred = credentials.Certificate(cred_dict)
            print("✅ Firebase initialized from env variable.")
        else:
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

def create_json_response(data, status=200):
    """Helper to ensure proper JSON responses with dynamic CORS"""
    response = make_response(jsonify(data), status)
    response.headers['Content-Type'] = 'application/json'
    
    # Add CORS headers dynamically
    origin = request.headers.get('Origin')
    if origin:
        # In production, be more permissive for same-origin requests
        if IS_PROD:
            # Allow if it's the same domain or in our allowed list
            if origin in allowed_origins or '*' in allowed_origins:
                response.headers['Access-Control-Allow-Origin'] = origin
                response.headers['Access-Control-Allow-Credentials'] = 'true'
        else:
            # Development: check against allowed origins
            if origin in allowed_origins:
                response.headers['Access-Control-Allow-Origin'] = origin
                response.headers['Access-Control-Allow-Credentials'] = 'true'
    
    return response

# --- API Routes ---
@app.route('/api/chat', methods=['POST', 'OPTIONS'])
def api_chat():
    if request.method == 'OPTIONS':
        return make_response('', 200)
    
    print("🎯 API chat endpoint hit")
    try:
        if not db or not model:
            return create_json_response({"error": "Backend services not running."}, 500)

        uid = get_user_session()
        chat_ref = db.collection('chats').document(uid)
        data = request.json
        
        if not data:
            return create_json_response({"error": "No JSON data received"}, 400)
            
        user_prompt = data.get('prompt', '')
        image_base64 = data.get('image_base64')

        if not user_prompt and not image_base64:
            return create_json_response({"error": "Prompt or image required."}, 400)

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
                return create_json_response({"error": "Invalid image format."}, 400)

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

        return create_json_response({"response": response.text})

    except Exception as e:
        print(f"❌ Gemini error: {e}")
        return create_json_response({"error": f"Gemini failed to respond: {str(e)}"}, 500)

@app.route('/api/get_history', methods=['GET', 'OPTIONS'])
def api_get_history():
    if request.method == 'OPTIONS':
        return make_response('', 200)
    
    print("🎯 API get_history endpoint hit")
    try:
        uid = get_user_session()
        print(f"👤 Getting history for UID: {uid}")
        
        if not db:
            print("❌ Database not available")
            return create_json_response({"error": "Database not available."}, 500)
        
        chat_ref = db.collection('chats').document(uid)
        chat_doc = chat_ref.get()
        
        if chat_doc.exists:
            messages = chat_doc.to_dict().get('messages', [])
            print(f"📜 Retrieved {len(messages)} messages for UID: {uid}")
            return create_json_response(messages)
        else:
            print(f"📭 No chat history found for UID: {uid}")
            return create_json_response([])
            
    except Exception as e:
        print(f"❌ Error in get_history: {e}")
        return create_json_response({"error": f"Failed to get history: {str(e)}"}, 500)

@app.route('/api/clear_chat', methods=['POST', 'OPTIONS'])
def api_clear_chat():
    if request.method == 'OPTIONS':
        return make_response('', 200)
    
    print("🎯 API clear_chat endpoint hit")
    try:
        uid = get_user_session()
        print(f"🗑️ Clearing chat for UID: {uid}")
        
        if not db:
            return create_json_response({"error": "Database not available."}, 500)
        
        chat_ref = db.collection('chats').document(uid)
        chat_ref.set({"messages": []})
        
        print(f"✅ Chat cleared for UID: {uid}")
        return create_json_response({"success": True, "message": "Chat cleared successfully"})
        
    except Exception as e:
        print(f"❌ Error clearing chat: {e}")
        return create_json_response({"error": str(e)}, 500)

@app.route('/api/info', methods=['GET'])
def api_info():
    print("🎯 API info endpoint hit")
    return create_json_response({
        "message": "AURA+ Backend API",
        "version": "1.0.0",
        "status": "running",
        "firebase_connected": db is not None,
        "gemini_connected": model is not None,
        "environment": "production" if IS_PROD else "development",
        "cors_origins": allowed_origins,
        "deployment_url": os.environ.get('RENDER_EXTERNAL_URL', 'localhost'),
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
    return create_json_response({
        "status": "healthy",
        "environment": "production" if IS_PROD else "development",
        "firebase_connected": db is not None,
        "gemini_connected": model is not None,
        "cors_origins": allowed_origins,
        "static_folder_exists": app.static_folder and os.path.exists(app.static_folder) if app.static_folder else False,
        "deployment_info": {
            "render_url": os.environ.get('RENDER_EXTERNAL_URL'),
            "render_service": os.environ.get('RENDER_SERVICE_NAME'),
            "is_render": os.environ.get('RENDER') is not None
        }
    })

# --- React App Routes (Production Only) ---
@app.route('/')
def serve_root():
    if IS_PROD:
        print("📄 Serving React root (Production)")
        try:
            if app.static_folder and os.path.exists(os.path.join(app.static_folder, 'index.html')):
                return send_file(os.path.join(app.static_folder, 'index.html'))
            else:
                return create_json_response({
                    "error": "React build not found",
                    "message": "Please build your React app first",
                    "static_folder": app.static_folder,
                    "static_exists": os.path.exists(app.static_folder) if app.static_folder else False
                }, 404)
        except Exception as e:
            print(f"❌ Error serving React root: {e}")
            return create_json_response({"error": "Failed to serve application"}, 500)
    else:
        return create_json_response({
            "message": "AURA+ Backend API - Development Mode",
            "status": "running",
            "frontend": "Run React dev server separately on http://localhost:5173",
            "api_endpoints": {
                "chat": "/api/chat",
                "history": "/api/get_history",
                "clear": "/api/clear_chat",
                "info": "/api/info",
                "health": "/health"
            },
            "note": "This is the Flask backend. Start React with 'npm run dev'"
        })

# --- Static Files and React Routing (Production Only) ---
@app.route('/<path:filename>')
def serve_static_or_react(filename):
    # Ensure API routes never reach here
    if filename.startswith('api/'):
        print(f"❌ API route {filename} reached catch-all - this should not happen")
        return create_json_response({"error": f"API endpoint /{filename} not found"}, 404)
    
    if IS_PROD:
        # Serve static files first
        if '.' in filename and app.static_folder:
            static_path = os.path.join(app.static_folder, filename)
            if os.path.exists(static_path):
                print(f"📁 Serving static file: {filename}")
                return send_from_directory(app.static_folder, filename)
        
        # For all other paths (like /chatbot), serve React app
        print(f"📄 Serving React app for path: /{filename}")
        try:
            if app.static_folder and os.path.exists(os.path.join(app.static_folder, 'index.html')):
                return send_file(os.path.join(app.static_folder, 'index.html'))
            else:
                return create_json_response({
                    "error": "React build not found",
                    "path": filename,
                    "static_folder": app.static_folder
                }, 404)
        except Exception as e:
            print(f"❌ Error serving React for {filename}: {e}")
            return create_json_response({"error": "Failed to serve application"}, 500)
    else:
        return create_json_response({
            "error": f"Path /{filename} not found in development mode",
            "message": "This is the Flask backend. Run React dev server at http://localhost:5173"
        }, 404)

# --- Error Handlers ---
@app.errorhandler(404)
def not_found(error):
    print(f"❌ 404 Error for path: {request.path}")
    
    # API endpoints should return JSON errors
    if request.path.startswith('/api/'):
        return create_json_response({"error": f"API endpoint {request.path} not found"}, 404)
    
    # In production, serve React app for non-API 404s
    if IS_PROD and app.static_folder:
        try:
            index_path = os.path.join(app.static_folder, 'index.html')
            if os.path.exists(index_path):
                return send_file(index_path)
        except Exception as e:
            print(f"❌ Error in 404 handler: {e}")
    
    return create_json_response({"error": "Not found", "path": request.path}, 404)

@app.errorhandler(500)
def internal_error(error):
    print(f"❌ Internal server error: {error}")
    return create_json_response({"error": "Internal server error"}, 500)

# --- Run Server ---
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug_mode = not IS_PROD
    
    print(f"🚀 Starting server on port {port}")
    print(f"🔧 Debug mode: {debug_mode}")
    
    if debug_mode:
        print("📝 Development API endpoints:")
        print("   - http://127.0.0.1:5000/api/chat")
        print("   - http://127.0.0.1:5000/api/get_history")
        print("   - http://127.0.0.1:5000/api/clear_chat")
        print("   - http://127.0.0.1:5000/health")
        print("🚀 Start React dev server with: npm run dev")
    else:
        print("📝 Production mode - serving React app and API")
        if app.static_folder:
            print(f"📁 Static folder: {app.static_folder}")
            print(f"📁 Static exists: {os.path.exists(app.static_folder)}")
        
        # Show deployment info
        render_url = os.environ.get('RENDER_EXTERNAL_URL')
        if render_url:
            print(f"🌐 Deployment URL: {render_url}")
            print(f"🌐 Frontend: {render_url}/")
            print(f"🌐 Chatbot: {render_url}/chatbot")
            print(f"🌐 API: {render_url}/api/")
    
    app.run(host='0.0.0.0', port=port, debug=debug_mode)
