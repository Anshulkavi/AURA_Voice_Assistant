import os
import io
import base64
import time
from flask import Flask, request, jsonify, session, send_from_directory, send_file, make_response
from flask_cors import CORS
from dotenv import load_dotenv
from PIL import Image
import json
import google.generativeai as genai
import firebase_admin
from firebase_admin import credentials, firestore
import uuid
from datetime import datetime, timedelta
import hashlib
import secrets

# --- Initial Setup ---
load_dotenv()

# Create Flask app
app = Flask(__name__, static_folder='dist', static_url_path='')
app.secret_key = os.getenv('FLASK_SECRET_KEY', os.urandom(24))

# --- Environment Detection ---
IS_PROD = (
    os.environ.get('FLASK_ENV') == 'production' or 
    os.environ.get('NODE_ENV') == 'production' or
    os.environ.get('RENDER') is not None or
    os.environ.get('HEROKU') is not None
)

print(f"🔍 Environment: {'Production' if IS_PROD else 'Development'}")

# --- CORS Configuration ---
def get_allowed_origins():
    """Dynamically determine allowed origins based on environment"""
    if IS_PROD:
        origins = []
        current_domain = os.environ.get('RENDER_EXTERNAL_URL')
        if current_domain:
            origins.append(current_domain)
        
        frontend_url = os.environ.get('FRONTEND_URL')
        if frontend_url and frontend_url not in origins:
            origins.append(frontend_url)
        
        if not origins:
            return ['*']
        
        return origins
    else:
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
    model = genai.GenerativeModel('gemini-2.0-flash-exp')
    print("✅ Gemini AI configured.")
except Exception as e:
    print(f"❌ Gemini config failed: {e}")
    model = None

# --- Helper Functions ---
def create_json_response(data, status=200):
    """Helper to ensure proper JSON responses with CORS"""
    response = make_response(jsonify(data), status)
    response.headers['Content-Type'] = 'application/json'
    
    origin = request.headers.get('Origin')
    if origin and origin in allowed_origins:
        response.headers['Access-Control-Allow-Origin'] = origin
        response.headers['Access-Control-Allow-Credentials'] = 'true'
    
    return response

def hash_password(password):
    """Hash password with salt"""
    salt = secrets.token_hex(16)
    password_hash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000)
    return f"{salt}:{password_hash.hex()}"

def verify_password(password, hashed):
    """Verify password against hash"""
    try:
        salt, password_hash = hashed.split(':')
        return hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 100000).hex() == password_hash
    except:
        return False

def require_auth(f):
    """Decorator to require authentication"""
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return create_json_response({"error": "Authentication required"}, 401)
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

def require_admin(f):
    """Decorator to require admin privileges"""
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return create_json_response({"error": "Authentication required"}, 401)
        
        if not db:
            return create_json_response({"error": "Database not available"}, 500)
        
        try:
            user_doc = db.collection('users').document(session['user_id']).get()
            if not user_doc.exists or not user_doc.to_dict().get('is_admin', False):
                return create_json_response({"error": "Admin privileges required"}, 403)
        except Exception as e:
            return create_json_response({"error": "Failed to verify admin status"}, 500)
        
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

def get_current_user():
    """Get current user data"""
    if 'user_id' not in session or not db:
        return None
    
    try:
        user_doc = db.collection('users').document(session['user_id']).get()
        if user_doc.exists:
            user_data = user_doc.to_dict()
            user_data['id'] = session['user_id']
            return user_data
    except Exception as e:
        print(f"❌ Error getting current user: {e}")
    
    return None

# --- Authentication Routes ---
@app.route('/api/auth/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        return make_response('', 200)
    
    print("🎯 Register endpoint hit")
    
    if not db:
        return create_json_response({"error": "Database not available"}, 500)
    
    try:
        data = request.json
        if not data:
            return create_json_response({"error": "No data provided"}, 400)
        
        username = data.get('username', '').strip()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        full_name = data.get('full_name', '').strip()
        
        # Validation
        if not username or len(username) < 3:
            return create_json_response({"error": "Username must be at least 3 characters"}, 400)
        
        if not email or '@' not in email:
            return create_json_response({"error": "Valid email is required"}, 400)
        
        if not password or len(password) < 6:
            return create_json_response({"error": "Password must be at least 6 characters"}, 400)
        
        if not full_name:
            return create_json_response({"error": "Full name is required"}, 400)
        
        # Check if username or email already exists
        users_ref = db.collection('users')
        
        # Check username
        username_query = users_ref.where('username', '==', username).limit(1).get()
        if len(username_query) > 0:
            return create_json_response({"error": "Username already exists"}, 400)
        
        # Check email
        email_query = users_ref.where('email', '==', email).limit(1).get()
        if len(email_query) > 0:
            return create_json_response({"error": "Email already exists"}, 400)
        
        # Create user
        user_id = str(uuid.uuid4())
        user_data = {
            'username': username,
            'email': email,
            'password_hash': hash_password(password),
            'full_name': full_name,
            'is_admin': False,  # First user will be made admin manually
            'created_at': datetime.utcnow(),
            'last_login': None,
            'profile_picture': None,
            'bio': '',
            'is_active': True
        }
        
        # Check if this is the first user (make them admin)
        all_users = users_ref.limit(1).get()
        if len(all_users) == 0:
            user_data['is_admin'] = True
            print(f"👑 First user {username} created as admin")
        
        db.collection('users').document(user_id).set(user_data)
        
        # Log them in
        session['user_id'] = user_id
        session['username'] = username
        
        # Update last login
        db.collection('users').document(user_id).update({
            'last_login': datetime.utcnow()
        })
        
        print(f"✅ User registered: {username} ({email})")
        
        return create_json_response({
            "success": True,
            "message": "Registration successful",
            "user": {
                "id": user_id,
                "username": username,
                "email": email,
                "full_name": full_name,
                "is_admin": user_data['is_admin']
            }
        })
        
    except Exception as e:
        print(f"❌ Registration error: {e}")
        return create_json_response({"error": f"Registration failed: {str(e)}"}, 500)

@app.route('/api/auth/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return make_response('', 200)
    
    print("🎯 Login endpoint hit")
    
    if not db:
        return create_json_response({"error": "Database not available"}, 500)
    
    try:
        data = request.json
        if not data:
            return create_json_response({"error": "No data provided"}, 400)
        
        username_or_email = data.get('username', '').strip().lower()
        password = data.get('password', '')
        
        if not username_or_email or not password:
            return create_json_response({"error": "Username/email and password are required"}, 400)
        
        # Find user by username or email
        users_ref = db.collection('users')
        
        # Try username first
        user_query = users_ref.where('username', '==', username_or_email).limit(1).get()
        
        # If not found, try email
        if len(user_query) == 0:
            user_query = users_ref.where('email', '==', username_or_email).limit(1).get()
        
        if len(user_query) == 0:
            return create_json_response({"error": "Invalid credentials"}, 401)
        
        user_doc = user_query[0]
        user_data = user_doc.to_dict()
        user_id = user_doc.id
        
        # Check if user is active
        if not user_data.get('is_active', True):
            return create_json_response({"error": "Account is deactivated"}, 401)
        
        # Verify password
        if not verify_password(password, user_data['password_hash']):
            return create_json_response({"error": "Invalid credentials"}, 401)
        
        # Log them in
        session['user_id'] = user_id
        session['username'] = user_data['username']
        
        # Update last login
        db.collection('users').document(user_id).update({
            'last_login': datetime.utcnow()
        })
        
        print(f"✅ User logged in: {user_data['username']}")
        
        return create_json_response({
            "success": True,
            "message": "Login successful",
            "user": {
                "id": user_id,
                "username": user_data['username'],
                "email": user_data['email'],
                "full_name": user_data['full_name'],
                "is_admin": user_data.get('is_admin', False),
                "profile_picture": user_data.get('profile_picture'),
                "bio": user_data.get('bio', '')
            }
        })
        
    except Exception as e:
        print(f"❌ Login error: {e}")
        return create_json_response({"error": f"Login failed: {str(e)}"}, 500)

@app.route('/api/auth/logout', methods=['POST', 'OPTIONS'])
def logout():
    if request.method == 'OPTIONS':
        return make_response('', 200)
    
    print("🎯 Logout endpoint hit")
    
    username = session.get('username', 'Unknown')
    session.clear()
    
    print(f"✅ User logged out: {username}")
    
    return create_json_response({
        "success": True,
        "message": "Logout successful"
    })

@app.route('/api/auth/me', methods=['GET'])
@require_auth
def get_current_user_info():
    print("🎯 Get current user endpoint hit")
    
    user = get_current_user()
    if not user:
        return create_json_response({"error": "User not found"}, 404)
    
    # Remove sensitive data
    user.pop('password_hash', None)
    
    return create_json_response({
        "user": user
    })

@app.route('/api/auth/profile', methods=['PUT', 'OPTIONS'])
@require_auth
def update_profile():
    if request.method == 'OPTIONS':
        return make_response('', 200)
    
    print("🎯 Update profile endpoint hit")
    
    if not db:
        return create_json_response({"error": "Database not available"}, 500)
    
    try:
        data = request.json
        if not data:
            return create_json_response({"error": "No data provided"}, 400)
        
        user_id = session['user_id']
        updates = {}
        
        # Allowed fields to update
        if 'full_name' in data and data['full_name'].strip():
            updates['full_name'] = data['full_name'].strip()
        
        if 'bio' in data:
            updates['bio'] = data['bio'].strip()
        
        if 'profile_picture' in data:
            updates['profile_picture'] = data['profile_picture']
        
        if updates:
            db.collection('users').document(user_id).update(updates)
            print(f"✅ Profile updated for user: {session['username']}")
        
        return create_json_response({
            "success": True,
            "message": "Profile updated successfully"
        })
        
    except Exception as e:
        print(f"❌ Profile update error: {e}")
        return create_json_response({"error": f"Profile update failed: {str(e)}"}, 500)

# --- User-specific Chat Routes ---
@app.route('/api/chat', methods=['POST', 'OPTIONS'])
@require_auth
def api_chat():
    if request.method == 'OPTIONS':
        return make_response('', 200)
    
    print("🎯 API chat endpoint hit")
    try:
        if not db or not model:
            return create_json_response({"error": "Backend services not running."}, 500)

        user_id = session['user_id']
        chat_ref = db.collection('users').document(user_id).collection('chats').document('current')
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

        # Save to user's chat collection
        chat_ref.set({
            "messages": [serialize_content(msg) for msg in chat_session.history],
            "updated_at": datetime.utcnow()
        })

        return create_json_response({"response": response.text})

    except Exception as e:
        print(f"❌ Gemini error: {e}")
        return create_json_response({"error": f"Gemini failed to respond: {str(e)}"}, 500)

@app.route('/api/get_history', methods=['GET', 'OPTIONS'])
@require_auth
def api_get_history():
    if request.method == 'OPTIONS':
        return make_response('', 200)
    
    print("🎯 API get_history endpoint hit")
    try:
        user_id = session['user_id']
        print(f"👤 Getting history for user: {session['username']} ({user_id})")
        
        if not db:
            print("❌ Database not available")
            return create_json_response({"error": "Database not available."}, 500)
        
        chat_ref = db.collection('users').document(user_id).collection('chats').document('current')
        chat_doc = chat_ref.get()
        
        if chat_doc.exists:
            messages = chat_doc.to_dict().get('messages', [])
            print(f"📜 Retrieved {len(messages)} messages for user: {session['username']}")
            return create_json_response(messages)
        else:
            print(f"📭 No chat history found for user: {session['username']}")
            return create_json_response([])
            
    except Exception as e:
        print(f"❌ Error in get_history: {e}")
        return create_json_response({"error": f"Failed to get history: {str(e)}"}, 500)

@app.route('/api/clear_chat', methods=['POST', 'OPTIONS'])
@require_auth
def api_clear_chat():
    if request.method == 'OPTIONS':
        return make_response('', 200)
    
    print("🎯 API clear_chat endpoint hit")
    try:
        user_id = session['user_id']
        print(f"🗑️ Clearing chat for user: {session['username']} ({user_id})")
        
        if not db:
            return create_json_response({"error": "Database not available."}, 500)
        
        chat_ref = db.collection('users').document(user_id).collection('chats').document('current')
        chat_ref.set({"messages": [], "updated_at": datetime.utcnow()})
        
        print(f"✅ Chat cleared for user: {session['username']}")
        return create_json_response({"success": True, "message": "Chat cleared successfully"})
        
    except Exception as e:
        print(f"❌ Error clearing chat: {e}")
        return create_json_response({"error": str(e)}, 500)

# --- Missing API Routes ---
@app.route('/api/health', methods=['GET'])
def api_health():
    print("🎯 API health endpoint hit")
    return create_json_response({
        "status": "healthy",
        "environment": "production" if IS_PROD else "development",
        "firebase_connected": db is not None,
        "gemini_connected": model is not None,
        "cors_origins": allowed_origins,
        "features": {
            "multi_user": True,
            "authentication": True,
            "admin_panel": True,
            "user_profiles": True
        }
    })

@app.route('/api/chat/messages', methods=['GET'])
@require_auth
def get_chat_messages():
    print("🎯 API get chat messages endpoint hit")
    try:
        user_id = session['user_id']
        print(f"👤 Getting messages for user: {session['username']} ({user_id})")
        
        if not db:
            print("❌ Database not available")
            return create_json_response({"error": "Database not available."}, 500)
        
        chat_ref = db.collection('users').document(user_id).collection('chats').document('current')
        chat_doc = chat_ref.get()
        
        if chat_doc.exists:
            messages = chat_doc.to_dict().get('messages', [])
            print(f"📜 Retrieved {len(messages)} messages for user: {session['username']}")
            return create_json_response({"messages": messages})
        else:
            print(f"📭 No chat messages found for user: {session['username']}")
            return create_json_response({"messages": []})
            
    except Exception as e:
        print(f"❌ Error in get_chat_messages: {e}")
        return create_json_response({"error": f"Failed to get messages: {str(e)}"}, 500)

@app.route('/api/chat/clear', methods=['POST'])
@require_auth
def clear_chat_messages():
    print("🎯 API clear chat messages endpoint hit")
    try:
        user_id = session['user_id']
        print(f"🗑️ Clearing chat messages for user: {session['username']} ({user_id})")
        
        if not db:
            return create_json_response({"error": "Database not available."}, 500)
        
        chat_ref = db.collection('users').document(user_id).collection('chats').document('current')
        chat_ref.set({"messages": [], "updated_at": datetime.utcnow()})
        
        print(f"✅ Chat messages cleared for user: {session['username']}")
        return create_json_response({"success": True, "message": "Chat cleared successfully"})
        
    except Exception as e:
        print(f"❌ Error clearing chat messages: {e}")
        return create_json_response({"error": str(e)}, 500)

# --- Admin Routes ---
@app.route('/api/admin/users', methods=['GET'])
@require_admin
def get_all_users():
    print("🎯 Admin get users endpoint hit")
    
    if not db:
        return create_json_response({"error": "Database not available"}, 500)
    
    try:
        users_ref = db.collection('users')
        users = []
        
        for doc in users_ref.stream():
            user_data = doc.to_dict()
            user_data['id'] = doc.id
            # Remove sensitive data
            user_data.pop('password_hash', None)
            users.append(user_data)
        
        print(f"✅ Retrieved {len(users)} users for admin")
        return create_json_response({"users": users})
        
    except Exception as e:
        print(f"❌ Error getting users: {e}")
        return create_json_response({"error": str(e)}, 500)

@app.route('/api/admin/users/<user_id>/toggle-admin', methods=['POST'])
@require_admin
def toggle_user_admin(user_id):
    print(f"🎯 Admin toggle admin status for user: {user_id}")
    
    if not db:
        return create_json_response({"error": "Database not available"}, 500)
    
    try:
        user_ref = db.collection('users').document(user_id)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            return create_json_response({"error": "User not found"}, 404)
        
        user_data = user_doc.to_dict()
        new_admin_status = not user_data.get('is_admin', False)
        
        user_ref.update({'is_admin': new_admin_status})
        
        print(f"✅ User {user_data['username']} admin status changed to: {new_admin_status}")
        return create_json_response({
            "success": True,
            "message": f"User {'promoted to' if new_admin_status else 'demoted from'} admin"
        })
        
    except Exception as e:
        print(f"❌ Error toggling admin status: {e}")
        return create_json_response({"error": str(e)}, 500)

@app.route('/api/admin/users/<user_id>/toggle-active', methods=['POST'])
@require_admin
def toggle_user_active(user_id):
    print(f"🎯 Admin toggle active status for user: {user_id}")
    
    if not db:
        return create_json_response({"error": "Database not available"}, 500)
    
    try:
        user_ref = db.collection('users').document(user_id)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            return create_json_response({"error": "User not found"}, 404)
        
        user_data = user_doc.to_dict()
        new_active_status = not user_data.get('is_active', True)
        
        user_ref.update({'is_active': new_active_status})
        
        print(f"✅ User {user_data['username']} active status changed to: {new_active_status}")
        return create_json_response({
            "success": True,
            "message": f"User {'activated' if new_active_status else 'deactivated'}"
        })
        
    except Exception as e:
        print(f"❌ Error toggling active status: {e}")
        return create_json_response({"error": str(e)}, 500)

# --- General API Routes ---
@app.route('/api/info', methods=['GET'])
def api_info():
    print("🎯 API info endpoint hit")
    return create_json_response({
        "message": "AURA+ Multi-User Backend API",
        "version": "2.0.0",
        "status": "running",
        "firebase_connected": db is not None,
        "gemini_connected": model is not None,
        "environment": "production" if IS_PROD else "development",
        "cors_origins": allowed_origins,
        "features": [
            "Multi-user authentication",
            "User profiles and management",
            "Individual chat sessions",
            "Admin panel",
            "Secure password hashing"
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
        "features": {
            "multi_user": True,
            "authentication": True,
            "admin_panel": True,
            "user_profiles": True
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
                    "message": "Please build your React app first"
                }, 404)
        except Exception as e:
            print(f"❌ Error serving React root: {e}")
            return create_json_response({"error": "Failed to serve application"}, 500)
    else:
        return create_json_response({
            "message": "AURA+ Multi-User Backend API - Development Mode",
            "status": "running",
            "frontend": "Run React dev server separately on http://localhost:5173",
            "version": "2.0.0",
            "features": ["Multi-user auth", "User profiles", "Admin panel"],
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
        
        # For all other paths, serve React app
        print(f"📄 Serving React app for path: /{filename}")
        try:
            if app.static_folder and os.path.exists(os.path.join(app.static_folder, 'index.html')):
                return send_file(os.path.join(app.static_folder, 'index.html'))
            else:
                return create_json_response({
                    "error": "React build not found",
                    "path": filename
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
    
    print(f"🚀 Starting AURA+ Multi-User Server on port {port}")
    print(f"🔧 Debug mode: {debug_mode}")
    
    if debug_mode:
        print("📝 Development API endpoints:")
        print("   Authentication:")
        print("   - http://127.0.0.1:5000/api/auth/register")
        print("   - http://127.0.0.1:5000/api/auth/login")
        print("   - http://127.0.0.1:5000/api/auth/logout")
        print("   Chat:")
        print("   - http://127.0.0.1:5000/api/chat")
        print("   - http://127.0.0.1:5000/api/get_history")
        print("   Admin:")
        print("   - http://127.0.0.1:5000/api/admin/users")
        print("   General:")
        print("   - http://127.0.0.1:5000/health")
        print("🚀 Start React dev server with: npm run dev")
    
    app.run(host='0.0.0.0', port=port, debug=debug_mode)
