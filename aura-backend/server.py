# import os
# import io
# import base64
# from flask import Flask, request, jsonify, session, send_from_directory
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
# app = Flask(__name__, static_folder='client/build', static_url_path='')
# app.secret_key = os.urandom(24)
# CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# # --- Firebase Admin Init ---
# # --- Firebase Admin Init ---
# try:
#     if not firebase_admin._apps:  # prevents double-initialization on reloads
#         cred = credentials.Certificate("firebase-service-account.json")
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

# # --- Chat Endpoint ---
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

# # --- History Fetch Endpoint ---
# @app.route('/get_history', methods=['GET'])
# def get_history():
#     try:
#         uid = get_user_session()
#         print(f"👤 UID: {uid}")
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

# # Add this endpoint to your server.py file

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

# # --- Frontend React Serve ---
# @app.route('/', defaults={'path': ''})
# @app.route('/<path:path>')
# def serve_react(path):
#     if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
#         return send_from_directory(app.static_folder, path)
#     else:
#         return send_from_directory(app.static_folder, 'index.html')

# # --- Run Server ---
# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000, debug=False)



import os
import io
import base64
from flask import Flask, request, jsonify, session, send_from_directory, send_file
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

app.secret_key = os.urandom(24)

# Configure CORS based on environment
if os.environ.get('FLASK_ENV') == 'production':
    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
else:
    CORS(app, resources={r"/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}}, supports_credentials=True)

# --- Firebase Admin Init ---
try:
    if not firebase_admin._apps:  # prevents double-initialization on reloads
        cred = credentials.Certificate("firebase-service-account.json")
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

# --- API Routes (prefixed with /api for clarity) ---
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
        print(f"👤 UID: {uid}")
        chat_ref = db.collection('chats').document(uid)
        chat_doc = chat_ref.get()

        if chat_doc.exists:
            messages = chat_doc.to_dict().get('messages', [])
            print(f"📜 Retrieved {len(messages)} messages.")
            return jsonify(messages)
        else:
            print("📭 No chat history found.")
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
        "gemini_connected": model is not None
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

# --- Run Server ---
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug_mode = os.environ.get('FLASK_ENV') != 'production'
    
    print(f"🚀 Starting server on port {port}")
    print(f"🔧 Debug mode: {debug_mode}")
    print(f"🌍 Environment: {os.environ.get('FLASK_ENV', 'development')}")
    
    if debug_mode:
        print("📝 In development mode - React dev server should run separately on port 5173")
        print("📝 Make sure to run: npm run dev")
    
    app.run(host='0.0.0.0', port=port, debug=debug_mode)