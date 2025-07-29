# from flask import Flask, jsonify, request
# from flask_cors import CORS
# import pyttsx3
# import wikipedia
# import datetime
# import pywhatkit
# import webbrowser
# import threading
# import google.generativeai as genai
# import os
# from dotenv import load_dotenv

# load_dotenv()
# genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# # Create a model instance for Gemini
# model = genai.GenerativeModel("gemini-2.0-flash")

# app = Flask(__name__)
# CORS(app)  # Enable CORS for cross-origin requests

# # Initialize text-to-speech engine
# speech_lock = threading.Lock()
# engine = pyttsx3.init()

# # Function to speak the response
# def respond(text):
#     def speak():
#         with speech_lock:
#            engine.say(text)
#            engine.runAndWait()

#     # Run speak in a separate thread
#     threading.Thread(target=speak, daemon=True).start()
#     return text  # Return the text response for the frontend

# # Function to handle Gemini query and get the response
# def handle_gemini_query(command):
#     # Pass the command directly to the Gemini model
#     prompt = f"You are an AI assistant. The user asked: {command}. Please provide a helpful and informative response."
#     response = model.generate_content(prompt)
    
#     # Restrict the response to 4 lines
#     full_response = response.text
#     lines = full_response.split("\n")  # Split response into lines
#     limited_response = "\n".join(lines[:4])  # Take only the first 4 lines

#     return limited_response

# @app.route("/", methods=["GET"])
# def root():
#     return jsonify({"message": "Server is up and running!"})


# @app.route("/command", methods=["POST"])
# def handle_command():
#     command = request.json.get("command", "").lower()
#     response_text = ""

#     try:
#         if 'hello' in command:
#             response_text = respond("Hello! How can I help you?")

#         elif 'time' in command:
#             current_time = datetime.datetime.now().strftime('%H:%M:%S')
#             response_text = f"The time is {current_time}"
#             respond(response_text)

#         elif 'tell me about yourself' in command:
#             response_text = "I am your voice assistant. I can help you with various tasks such as searching Wikipedia, telling the time, opening websites, and more. Just let me know how I can assist you!"
#             respond(response_text)

#         elif 'wikipedia' in command:
#             command = command.replace("wikipedia", "").strip()
#             if command:
#                 respond("Searching Wikipedia...")
#                 try:
#                     results = wikipedia.summary(command, sentences=1)
#                     response_text = f"According to Wikipedia: {results}"
#                     respond(response_text)
#                 except wikipedia.exceptions.DisambiguationError:
#                     respond("The query is too ambiguous. Please be more specific.")
#                 except Exception:
#                     respond("Sorry, I couldn't find information on that topic.")

#         elif 'who is' in command or 'tell me about' in command:
#             person_name = command.replace("who is", "").replace("tell me about", "").strip()
#             if person_name:
#                 respond(f"Searching Wikipedia for {person_name}...")
#                 try:
#                     results = wikipedia.summary(person_name, sentences=1)
#                     response_text = f"According to Wikipedia: {results}"
#                     respond(response_text)
#                 except wikipedia.exceptions.DisambiguationError:
#                     respond("The query is too ambiguous. Please be more specific.")
#                 except Exception:
#                     respond("Sorry, I couldn't find information on that person.")

#         elif 'open youtube' in command:
#             respond("Opening YouTube...")
#             webbrowser.open("https://www.youtube.com")
#             response_text = "YouTube is now open."

#         elif 'play' in command:
#             song = command.replace('play', '').strip()
#             if song:
#                 respond(f"Playing {song} on YouTube...")
#                 pywhatkit.playonyt(song)
#                 response_text = f"Playing {song} on YouTube."

#         elif 'weather' in command:
#             respond("Checking the weather...")
#             webbrowser.open("https://www.google.com/search?q=weather")
#             response_text = "Checking the weather. Please return to the tab and confirm."

#         elif 'google maps' in command:
#             respond("Opening Google Maps...")
#             webbrowser.open("https://www.google.com/maps")
#             response_text = "Opening Google Maps. Please return to the tab and confirm."

#         elif 'open google' in command:
#             respond("Opening Google...")
#             webbrowser.open("https://www.google.com")
#             response_text = "Google is now open."

#         elif 'stop' in command or 'bye' in command or 'exit' in command:
#             respond("Goodbye! Have a great day!")
#             response_text = "Goodbye! Have a great day!"

#         elif 'creator' in command:
#             respond("I was created by a group of students at the Medicaps University , Indore. By Anshul Kavishwar, Naman Bagrecha, Rhytham More")
#             response_text = "I was created by a group of students at the Medicaps University , Indore. By Anshul Kavishwar, Naman Bagrecha, Rhytham More"

#         else:
#             # If no command matches, ask Gemini for a response
#             response_text = handle_gemini_query(command)
#             respond(response_text)

#     except Exception as e:
#         print(f"Error: {e}")  # Log the error for debugging
#         response_text = "An error occurred while processing your request."

#     return jsonify({"response": response_text})

# if __name__ == "__main__":
#     print("Starting server on http://127.0.0.1:5000")
#     app.run(debug=True, port=5000)


# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import pyttsx3
# import wikipedia
# import datetime
# import pywhatkit
# import webbrowser
# import threading
# from dotenv import load_dotenv
# import google.generativeai as genai
# import os

# # ==============================
# # Configuration
# # ==============================

# load_dotenv()
# GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# if not GEMINI_API_KEY:
#     raise Exception("❌ GEMINI_API_KEY not found in .env file.")

# genai.configure(api_key=GEMINI_API_KEY)
# model = genai.GenerativeModel("gemini-2.0-flash")

# app = Flask(__name__)
# CORS(app)

# engine = pyttsx3.init()

# # ==============================
# # Utilities
# # ==============================

# def speak_text(text):
#     engine.say(text)
#     engine.runAndWait()

# def speak_async(text):
#     threading.Thread(target=speak_text, args=(text,), daemon=True).start()

# def get_gemini_response(command):
#     try:
#         print("📩 Gemini Prompt:", command)
#         response = model.generate_content(command)
#         print("📥 Gemini Raw Response:", response.text)
#         lines = response.text.strip().split("\n")
#         return "\n".join(lines[:4])
#     except Exception as e:
#         print("❌ Gemini API error:", e)
#         return "Sorry, I couldn’t get a response from the AI model."

# def get_wikipedia_summary(query):
#     try:
#         results = wikipedia.search(query)
#         if results:
#             page = results[0]
#             summary = wikipedia.summary(page, sentences=2)
#             return summary
#         else:
#             return "Sorry, I couldn't find any information on that topic."
#     except wikipedia.exceptions.DisambiguationError as e:
#         return f"Your query is too vague. Did you mean: {', '.join(e.options[:5])}?"
#     except wikipedia.exceptions.PageError:
#         return "Sorry, I couldn't find a matching Wikipedia page."
#     except Exception as e:
#         return f"An error occurred: {str(e)}"

# # ==============================
# # Routes
# # ==============================

# @app.route("/", methods=["GET"])
# def home():
#     return jsonify({"status": "✅ Voice assistant backend is running."})

# @app.route("/command", methods=["POST"])
# def handle_command():
#     command = request.json.get("command", "").lower()
#     print(f"🎙️ Received command: {command}")
#     response = ""

#     try:
#         if "hello" in command:
#             response = "Hello! How can I assist you today?"
#         elif "time" in command:
#             response = f"The time is {datetime.datetime.now().strftime('%H:%M:%S')}"
#         elif "tell me about yourself" in command:
#             response = "I am AURA, your AI voice assistant created using Python and Gemini."
#         elif "wikipedia" in command:
#             topic = command.replace("wikipedia", "").strip()
#             response = f"According to Wikipedia: {get_wikipedia_summary(topic)}"
#         elif "who is" in command or "tell me about" in command:
#             topic = command.replace("who is", "").replace("tell me about", "").strip()
#             response = f"According to Wikipedia: {get_wikipedia_summary(topic)}"
#         elif "open youtube" in command:
#             webbrowser.open("https://youtube.com")
#             response = "Opening YouTube..."
#         elif "play" in command:
#             song = command.replace("play", "").strip()
#             pywhatkit.playonyt(song)
#             response = f"Playing {song} on YouTube..."
#         elif "weather" in command:
#             webbrowser.open("https://www.google.com/search?q=weather")
#             response = "Here's the weather update."
#         elif "google maps" in command:
#             webbrowser.open("https://www.google.com/maps")
#             response = "Opening Google Maps..."
#         elif "open google" in command:
#             webbrowser.open("https://www.google.com")
#             response = "Opening Google..."
#         elif any(exit_word in command for exit_word in ["stop", "bye", "exit"]):
#             response = "Goodbye! Have a great day."
#         elif "creator" in command:
#             response = "I was created by students of Medicaps University as a voice assistant project."
#         else:
#             prompt = f"User asked: {command}. Respond in 4 lines max."
#             response = get_gemini_response(prompt)

#     except Exception as e:
#         print("❌ Error:", e)
#         response = "Something went wrong while processing your request."

#     speak_async(response)
#     return jsonify({"response": response})

# # ==============================
# # Run Server
# # ==============================

# if __name__ == "__main__":
#     print("✅ Server running at http://127.0.0.1:5000")
#     app.run(debug=False, port=5000)

# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import pyttsx3
# import wikipedia
# import datetime
# import pywhatkit
# import webbrowser
# import threading
# import requests
# import os
# from dotenv import load_dotenv

# # ========== Configuration ==========
# load_dotenv()
# GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
# GEMINI_MODEL = "gemini-2.0-flash"

# app = Flask(__name__)
# CORS(app)

# engine = pyttsx3.init()
# speech_lock = threading.Lock()

# # ========== Helpers ==========

# def speak_text(text):
#     def speak():
#         with speech_lock:
#             try:
#                 engine.say(text)
#                 engine.runAndWait()
#             except RuntimeError:
#                 print("TTS engine already running.")
#     threading.Thread(target=speak, daemon=True).start()


# def get_gemini_response(command):
#     url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"

#     headers = {
#         "Content-Type": "application/json"
#     }

#     payload = {
#         "contents": [
#             {
#                 "role": "user",
#                 "parts": [
#                     {
#                         "text": (
#                             "You are a helpful AI assistant named AURA+. "
#                             "If the user asks about code, explain briefly and return the full correct Python code. "
#                             "Avoid introductory phrases. Respond clearly and concisely.\n\n"
#                             f"User: {command}"
#                         )
#                     }
#                 ]
#             }
#         ]
#     }

#     try:
#         response = requests.post(url, headers=headers, json=payload)
#         response.raise_for_status()
#         data = response.json()
#         full_text = data["candidates"][0]["content"]["parts"][0]["text"]

#         # Speak only the first line as summary
#         summary_line = full_text.strip().split("\n")[0]
#         speak_text(summary_line)

#         return full_text

#     except Exception as e:
#         print("Gemini API error:", e)
#         fallback = "Sorry, I couldn’t get a response from the AI model."
#         speak_text(fallback)
#         return fallback


# def get_wikipedia_summary(query):
#     try:
#         results = wikipedia.search(query)
#         if results:
#             return wikipedia.summary(results[0], sentences=2)
#         else:
#             return "No results found on Wikipedia."
#     except wikipedia.exceptions.DisambiguationError as e:
#         return f"Be more specific. Did you mean: {', '.join(e.options[:3])}?"
#     except Exception:
#         return "Couldn't fetch data from Wikipedia."


# # ========== Routes ==========

# @app.route("/", methods=["GET"])
# def home():
#     return jsonify({"status": "AURA backend is running!"})


# @app.route("/command", methods=["POST"])
# def handle_command():
#     command = request.json.get("command", "").lower()
#     print(f"[User Command] {command}")
#     response = ""

#     try:
#         if "hello" in command:
#             response = "Hello! How can I assist you today?"

#         elif "time" in command:
#             response = f"The time is {datetime.datetime.now().strftime('%H:%M:%S')}"

#         elif "tell me about yourself" in command:
#             response = "I am AURA, your AI voice assistant, built by students from Medicaps University."

#         elif "wikipedia" in command:
#             topic = command.replace("wikipedia", "").strip()
#             response = f"According to Wikipedia: {get_wikipedia_summary(topic)}"

#         elif "who is" in command or "tell me about" in command:
#             topic = command.replace("who is", "").replace("tell me about", "").strip()
#             response = f"According to Wikipedia: {get_wikipedia_summary(topic)}"

#         elif "open youtube" in command:
#             webbrowser.open("https://youtube.com")
#             response = "Opening YouTube..."

#         elif "play" in command:
#             song = command.replace("play", "").strip()
#             pywhatkit.playonyt(song)
#             response = f"Playing {song} on YouTube..."

#         elif "weather" in command:
#             webbrowser.open("https://www.google.com/search?q=weather")
#             response = "Here's the weather update."

#         elif "google maps" in command:
#             webbrowser.open("https://www.google.com/maps")
#             response = "Opening Google Maps..."

#         elif "open google" in command:
#             webbrowser.open("https://www.google.com")
#             response = "Opening Google..."

#         elif any(exit_word in command for exit_word in ["stop", "bye", "exit"]):
#             response = "Goodbye! Have a great day."

#         elif "creator" in command:
#             response = "Created by Anshul, Naman, and Rhytham at Medicaps University."

#         else:
#             response = get_gemini_response(command)

#     except Exception as e:
#         print("Command handling error:", e)
#         response = "An unexpected error occurred."

#     speak_text(response)
#     return jsonify({"response": response})


# # ========== Run ==========
# if __name__ == "__main__":
#     print("✅ AURA+ Server running at http://127.0.0.1:5000")
#     app.run(debug=False, port=5000)


# -*- coding: utf-8 -*-
import os
import io
import base64
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from dotenv import load_dotenv
from PIL import Image

import google.generativeai as genai
import firebase_admin
from firebase_admin import credentials, firestore, auth

# --- Initial Setup ---
load_dotenv()

app = Flask(__name__)
app.secret_key = os.urandom(24) # Session ke liye zaroori hai
CORS(app, supports_credentials=True) # React/JS frontend se connect karne ke liye

# --- Services Initialize Karna ---

# Firebase Admin SDK
try:
    cred = credentials.Certificate(os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH"))
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    print("✅ Firebase Admin SDK successfully initialized.")
except Exception as e:
    print(f"❌ Firebase initialization failed: {e}")
    db = None

# Google Gemini AI
try:
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    model = genai.GenerativeModel('gemini-2.0-flash') # Latest model use karein
    print("✅ Gemini AI model successfully configured.")
except Exception as e:
    print(f"❌ Gemini AI configuration failed: {e}")
    model = None

# --- Helper Function: User Management ---
def get_user_session():
    """Har user ko ek unique ID deta hai (session ka use karke)"""
    if 'uid' not in session:
        user = auth.create_user() # Firebase me naya anonymous user banata hai
        session['uid'] = user.uid
        print(f"New user session created: {session['uid']}")
    return session['uid']

# --- API Endpoints ---

@app.route('/chat', methods=['POST'])
def chat():
    """Chat requests (text aur image ke saath) handle karta hai"""
    if not db or not model:
        return jsonify({"error": "Backend services not running."}), 500

    uid = get_user_session()
    chat_ref = db.collection('chats').document(uid)
    
    data = request.json
    user_prompt = data.get('prompt', '')
    image_base64 = data.get('image_base64') # Frontend se base64 image string

    # --- Content for Gemini ---
    gemini_content = []
    if user_prompt:
        gemini_content.append(user_prompt)
    
    if image_base64:
        try:
            # Base64 string se image banata hai
            image_data = base64.b64decode(image_base64)
            img = Image.open(io.BytesIO(image_data))
            gemini_content.append(img)
            print("Image successfully processed for Gemini.")
        except Exception as e:
            print(f"Image processing error: {e}")
            return jsonify({"error": "Invalid image format."}), 400

    if not gemini_content:
        return jsonify({"error": "Prompt or image is required."}), 400

    try:
        # --- History Management ---
        chat_doc = chat_ref.get()
        history = chat_doc.to_dict().get('messages', []) if chat_doc.exists else []

        # Inside the try block of your /chat endpoint
        chat_session = model.start_chat(history=history)
        response = chat_session.send_message(gemini_content)

# Serialize and store safely
        def serialize_gemini_content(content):
            return {
                "role": content.role,
                "parts": [part.text for part in content.parts]
            }
        
        chat_ref.set({
            "messages": [serialize_gemini_content(msg) for msg in chat_session.history]
        })


        return jsonify({"response": response.text})      

    except Exception as e:
        print(f"API call error: {e}")
        return jsonify({"error": "Failed to get response from AI."}), 500

@app.route('/get_history', methods=['GET'])
def get_history():
    """Page load par purani chat history bhejta hai"""
    uid = get_user_session()
    chat_ref = db.collection('chats').document(uid)
    chat_doc = chat_ref.get()

    if chat_doc.exists:
        return jsonify(chat_doc.to_dict().get('messages', []))
    else:
        return jsonify([])

# --- Run the App ---
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import pyttsx3
# import wikipedia
# import datetime
# import pywhatkit
# import webbrowser
# import threading
# import requests
# import os
# import re
# import json
# import asyncio
# import aiohttp
# from concurrent.futures import ThreadPoolExecutor
# from functools import wraps
# from typing import Dict, List, Optional, Tuple
# from dotenv import load_dotenv
# import logging
# import base64

# # ========== Configuration ==========
# load_dotenv()

# # Logging setup
# logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
# logger = logging.getLogger(__name__)

# # Environment variables
# GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyDRD2S45Lifvlz4TfWpID5vk4VTsMLBacw")
# GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
# TTS_RATE = int(os.getenv("TTS_RATE", "200"))
# TTS_VOLUME = float(os.getenv("TTS_VOLUME", "0.8"))

# # Flask app setup
# app = Flask(__name__)
# CORS(app, origins=["*"])

# # Thread pool for async operations
# executor = ThreadPoolExecutor(max_workers=4)

# # ========== Enhanced TTS Engine ==========
# class TTSEngine:
#     def __init__(self):
#         try:
#             self.engine = pyttsx3.init()
#             self.speech_lock = threading.Lock()
#             self.configure_tts()
#             self.enabled = True
#         except Exception as e:
#             logger.warning(f"TTS initialization failed: {e}")
#             self.enabled = False
    
#     def configure_tts(self):
#         """Configure TTS engine properties"""
#         if not self.enabled:
#             return
#         try:
#             voices = self.engine.getProperty('voices')
#             if voices:
#                 # Prefer female voice if available
#                 for voice in voices:
#                     if 'female' in voice.name.lower() or 'zira' in voice.name.lower():
#                         self.engine.setProperty('voice', voice.id)
#                         break
            
#             self.engine.setProperty('rate', TTS_RATE)
#             self.engine.setProperty('volume', TTS_VOLUME)
#         except Exception as e:
#             logger.warning(f"TTS configuration warning: {e}")
    
#     def speak_text(self, text: str, priority: bool = False):
#         """Speak text with optional priority"""
#         if not self.enabled:
#             return
            
#         def speak():
#             with self.speech_lock:
#                 try:
#                     # Clean text for better speech
#                     clean_text = self.clean_text_for_speech(text)
#                     self.engine.say(clean_text)
#                     self.engine.runAndWait()
#                 except Exception as e:
#                     logger.error(f"TTS error: {e}")
        
#         thread = threading.Thread(target=speak, daemon=True)
#         thread.start()
        
#         if priority:
#             thread.join(timeout=5)  # Wait max 5 seconds for priority speech
    
#     def clean_text_for_speech(self, text: str) -> str:
#         """Clean text for better TTS pronunciation"""
#         # Remove markdown formatting
#         text = re.sub(r'[*_`#]', '', text)
#         # Remove URLs
#         text = re.sub(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', 'link', text)
#         # Replace common abbreviations
#         replacements = {
#             'AI': 'Artificial Intelligence',
#             'API': 'A P I',
#             'HTTP': 'H T T P',
#             'URL': 'U R L',
#             'HTML': 'H T M L',
#             'CSS': 'C S S',
#             'JS': 'JavaScript'
#         }
#         for abbr, full in replacements.items():
#             text = text.replace(abbr, full)
        
#         return text[:500]  # Limit length for speech

# # Initialize TTS engine
# tts = TTSEngine()

# # ========== Enhanced Command Processing ==========
# class CommandProcessor:
#     def __init__(self):
#         self.command_patterns = {
#             'greeting': [r'\b(hello|hi|hey|good morning|good evening)\b'],
#             'time': [r'\b(time|what time|current time)\b'],
#             'date': [r'\b(date|today|what day)\b'],
#             'about': [r'\b(tell me about yourself|who are you|what are you)\b'],
#             'wikipedia': [r'\b(wikipedia|wiki)\b'],
#             'search': [r'\b(who is|tell me about|what is|explain)\b'],
#             'youtube': [r'\b(open youtube|youtube)\b'],
#             'play': [r'\b(play|music)\b'],
#             'weather': [r'\b(weather|temperature|forecast)\b'],
#             'maps': [r'\b(maps|directions|location)\b'],
#             'google': [r'\b(open google|google search)\b'],
#             'exit': [r'\b(stop|bye|exit|quit|goodbye)\b'],
#             'creator': [r'\b(creator|who made you|developer)\b'],
#             'code': [r'\b(code|programming|script|function|algorithm|write code|create function|debug|fix code)\b'],
#             'calculate': [r'\b(calculate|math|compute|solve|what is \d+|addition|subtraction|multiplication|division)\b'],
#             'news': [r'\b(news|latest news|headlines)\b'],
#             'joke': [r'\b(joke|funny|humor|make me laugh)\b'],
#             'help': [r'\b(help|commands|what can you do)\b'],
#             'translate': [r'\b(translate|translation)\b'],
#             'email': [r'\b(email|mail|send email)\b'],
#             'reminder': [r'\b(remind|reminder|schedule)\b'],
#             'file': [r'\b(create file|save file|write file)\b']
#         }
    
#     def classify_command(self, command: str) -> Tuple[str, str]:
#         """Classify command and extract relevant text"""
#         command_lower = command.lower()
        
#         for category, patterns in self.command_patterns.items():
#             for pattern in patterns:
#                 if re.search(pattern, command_lower):
#                     # Extract relevant text after removing command keywords
#                     extracted_text = self.extract_relevant_text(command_lower, pattern)
#                     return category, extracted_text
        
#         return 'general', command
    
#     def extract_relevant_text(self, command: str, pattern: str) -> str:
#         """Extract relevant text from command"""
#         # Remove the matched pattern and common words
#         cleaned = re.sub(pattern, '', command).strip()
#         cleaned = re.sub(r'\b(please|can you|could you|would you)\b', '', cleaned).strip()
#         return cleaned or command

# # Initialize command processor
# processor = CommandProcessor()

# # ========== Enhanced Gemini Integration ==========
# class GeminiClient:
#     def __init__(self):
#         self.api_key = GEMINI_API_KEY
#         self.model = GEMINI_MODEL
#         self.base_url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent"
#         self.session = requests.Session()
#         self.session.headers.update({"Content-Type": "application/json"})
#         self.conversation_history = []
    
#     def get_response(self, command: str, context: str = "general", image_data: str = None) -> str:
#         """Get response from Gemini with context-aware prompts and image support"""
#         prompt = self.build_context_prompt(command, context)
        
#         # Build user content
#         user_parts = [{"text": prompt}]
#         if image_data:
#             # Extract MIME type and base64 data
#             if image_data.startswith('data:'):
#                 mime_type = image_data.split(';')[0].split(':')[1]
#                 base64_data = image_data.split(',')[1]
#             else:
#                 mime_type = "image/jpeg"  # Default
#                 base64_data = image_data
            
#             user_parts.append({
#                 "inlineData": {
#                     "mimeType": mime_type,
#                     "data": base64_data
#                 }
#             })
        
#         # Include conversation history (last 10 messages)
#         contents = self.conversation_history[-10:] + [{
#             "role": "user",
#             "parts": user_parts
#         }]
        
#         payload = {
#             "contents": contents,
#             "generationConfig": {
#                 "temperature": 0.7,
#                 "topK": 40,
#                 "topP": 0.95,
#                 "maxOutputTokens": 2048,
#             }
#         }
        
#         try:
#             response = self.session.post(
#                 f"{self.base_url}?key={self.api_key}",
#                 json=payload,
#                 timeout=15
#             )
#             response.raise_for_status()
            
#             data = response.json()
#             ai_response = data["candidates"][0]["content"]["parts"][0]["text"]
            
#             # Update conversation history
#             self.conversation_history.append({
#                 "role": "user",
#                 "parts": user_parts
#             })
#             self.conversation_history.append({
#                 "role": "model",
#                 "parts": [{"text": ai_response}]
#             })
            
#             # Process response based on context
#             return self.process_response(ai_response, context)
            
#         except requests.exceptions.Timeout:
#             error_msg = "Sorry, the request timed out. Please try again."
#             tts.speak_text(error_msg)
#             return error_msg
#         except requests.exceptions.RequestException as e:
#             logger.error(f"Gemini API error: {e}")
#             error_msg = "Sorry, I'm having trouble connecting to my AI brain right now."
#             tts.speak_text(error_msg)
#             return error_msg
#         except Exception as e:
#             logger.error(f"Unexpected error: {e}")
#             error_msg = "An unexpected error occurred while processing your request."
#             tts.speak_text(error_msg)
#             return error_msg
    
#     def build_context_prompt(self, command: str, context: str) -> str:
#         """Build context-aware prompts"""
#         base_persona = (
#             "You are AURA+, a helpful AI assistant with voice capabilities. "
#             "You are knowledgeable, friendly, and provide clear, concise responses. "
#             "When speaking responses will be read aloud, so format them naturally. "
#         )
        
#         context_prompts = {
#             'code': (
#                 "You are an expert programming assistant. Provide clear, working code with explanations. "
#                 "Format code in proper markdown blocks with language specification. "
#                 "Include brief comments and explain complex logic. "
#                 "For debugging, identify issues and provide corrected code."
#             ),
#             'calculate': (
#                 "You are a mathematical assistant. Solve problems step by step and show your work clearly. "
#                 "For complex calculations, break them down into understandable steps. "
#                 "Always verify your answers."
#             ),
#             'image': (
#                 "You are analyzing an image. Describe what you see in detail and answer any questions about it. "
#                 "Be thorough but concise in your analysis."
#             ),
#             'general': (
#                 "Respond naturally and conversationally. Keep responses informative but concise. "
#                 "If you don't know something, be honest about it. "
#                 "Provide helpful suggestions when appropriate."
#             )
#         }
        
#         if context == 'image':
#             context_prompt = context_prompts['image']
#         else:
#             context_prompt = context_prompts.get(context, context_prompts['general'])
        
#         return f"{base_persona}{context_prompt}\n\nUser: {command}\n\nRespond clearly and helpfully:"
    
#     def process_response(self, response: str, context: str) -> str:
#         """Process response based on context and handle TTS"""
#         if context == 'code':
#             # For code responses, speak a summary
#             lines = response.split('\n')
#             summary = next((line for line in lines if line.strip() and not line.startswith('```')), "Here's the code you requested.")
#             tts.speak_text(f"{summary.strip()} Check the screen for the complete code.")
#             return response
#         elif context == 'image':
#             # For image analysis, speak the first few sentences
#             sentences = response.split('.')[:2]
#             summary = '. '.join(sentences) + '.'
#             tts.speak_text(summary)
#             return response
#         else:
#             # For general responses, speak the first sentence or two
#             sentences = response.split('.')[:2]
#             if len(sentences) > 0:
#                 summary = '. '.join(sentences) + '.'
#                 tts.speak_text(summary)
#             return response
    
#     def clear_history(self):
#         """Clear conversation history"""
#         self.conversation_history = []

# # Initialize Gemini client
# gemini = GeminiClient()

# # ========== Enhanced Wikipedia Integration ==========
# class WikipediaClient:
#     def __init__(self):
#         wikipedia.set_lang("en")
    
#     def get_summary(self, query: str, sentences: int = 3) -> str:
#         """Get Wikipedia summary with better error handling"""
#         try:
#             # First, search for the topic
#             search_results = wikipedia.search(query, results=5)
            
#             if not search_results:
#                 return f"No Wikipedia articles found for '{query}'. Try being more specific."
            
#             # Try the first result
#             try:
#                 summary = wikipedia.summary(search_results[0], sentences=sentences)
#                 response = f"According to Wikipedia: {summary}"
#                 # Speak the first sentence
#                 first_sentence = summary.split('.')[0] + '.'
#                 tts.speak_text(first_sentence)
#                 return response
            
#             except wikipedia.exceptions.DisambiguationError as e:
#                 # Handle disambiguation
#                 options = e.options[:3]
#                 response = f"'{query}' could refer to multiple things. Did you mean: {', '.join(options)}? Please be more specific."
#                 tts.speak_text(response)
#                 return response
            
#             except wikipedia.exceptions.PageError:
#                 # Try the second result if first fails
#                 if len(search_results) > 1:
#                     try:
#                         summary = wikipedia.summary(search_results[1], sentences=sentences)
#                         response = f"According to Wikipedia: {summary}"
#                         first_sentence = summary.split('.')[0] + '.'
#                         tts.speak_text(first_sentence)
#                         return response
#                     except:
#                         pass
#                 error_msg = f"Couldn't find a Wikipedia page for '{query}'. Try a different search term."
#                 tts.speak_text(error_msg)
#                 return error_msg
        
#         except Exception as e:
#             logger.error(f"Wikipedia error: {e}")
#             error_msg = "Sorry, I couldn't fetch information from Wikipedia right now."
#             tts.speak_text(error_msg)
#             return error_msg

# # Initialize Wikipedia client
# wiki = WikipediaClient()

# # ========== Command Handlers ==========
# class CommandHandlers:
#     @staticmethod
#     def handle_greeting(command: str) -> str:
#         greetings = [
#             "Hello! I'm AURA+, your AI assistant. How can I help you today?",
#             "Hi there! Ready to assist you with anything you need.",
#             "Hey! I'm here to help. What would you like to know or do?",
#             "Greetings! I'm AURA+, your intelligent assistant. What can I do for you?"
#         ]
#         import random
#         response = random.choice(greetings)
#         tts.speak_text(response, priority=True)
#         return response
    
#     @staticmethod
#     def handle_time(command: str) -> str:
#         now = datetime.datetime.now()
#         response = f"The current time is {now.strftime('%I:%M %p')}"
#         tts.speak_text(response, priority=True)
#         return response
    
#     @staticmethod
#     def handle_date(command: str) -> str:
#         now = datetime.datetime.now()
#         response = f"Today is {now.strftime('%A, %B %d, %Y')}"
#         tts.speak_text(response, priority=True)
#         return response
    
#     @staticmethod
#     def handle_about(command: str) -> str:
#         response = (
#             "I am AURA+, an advanced AI assistant with voice capabilities. "
#             "I can help you with coding, research, calculations, web browsing, "
#             "image analysis, and much more! I'm designed to be your intelligent companion."
#         )
#         tts.speak_text(response, priority=True)
#         return response
    
#     @staticmethod
#     def handle_youtube(command: str) -> str:
#         try:
#             webbrowser.open("https://youtube.com")
#             response = "Opening YouTube for you!"
#             tts.speak_text(response)
#             return response
#         except Exception as e:
#             logger.error(f"YouTube error: {e}")
#             error_msg = "Sorry, couldn't open YouTube."
#             tts.speak_text(error_msg)
#             return error_msg
    
#     @staticmethod
#     def handle_play(command: str) -> str:
#         try:
#             song = command.replace("play", "").replace("music", "").strip()
#             if song:
#                 pywhatkit.playonyt(song)
#                 response = f"Playing '{song}' on YouTube!"
#             else:
#                 pywhatkit.playonyt("popular music")
#                 response = "Playing popular music on YouTube!"
#             tts.speak_text(response)
#             return response
#         except Exception as e:
#             logger.error(f"Play error: {e}")
#             error_msg = "Sorry, couldn't play the music right now."
#             tts.speak_text(error_msg)
#             return error_msg
    
#     @staticmethod
#     def handle_weather(command: str) -> str:
#         try:
#             location = command.replace("weather", "").replace("forecast", "").strip()
#             if location:
#                 webbrowser.open(f"https://www.google.com/search?q=weather+{location}")
#                 response = f"Here's the weather forecast for {location}!"
#             else:
#                 webbrowser.open("https://www.google.com/search?q=weather+forecast")
#                 response = "Here's the current weather forecast!"
#             tts.speak_text(response)
#             return response
#         except Exception as e:
#             logger.error(f"Weather error: {e}")
#             error_msg = "Sorry, couldn't open weather information."
#             tts.speak_text(error_msg)
#             return error_msg
    
#     @staticmethod
#     def handle_maps(command: str) -> str:
#         try:
#             location = command.replace("maps", "").replace("directions", "").replace("location", "").strip()
#             if location:
#                 webbrowser.open(f"https://www.google.com/maps/search/{location}")
#                 response = f"Opening maps for '{location}'"
#             else:
#                 webbrowser.open("https://www.google.com/maps")
#                 response = "Opening Google Maps!"
#             tts.speak_text(response)
#             return response
#         except Exception as e:
#             logger.error(f"Maps error: {e}")
#             error_msg = "Sorry, couldn't open maps."
#             tts.speak_text(error_msg)
#             return error_msg
    
#     @staticmethod
#     def handle_google(command: str) -> str:
#         try:
#             search_term = command.replace("open google", "").replace("google search", "").strip()
#             if search_term:
#                 webbrowser.open(f"https://www.google.com/search?q={search_term}")
#                 response = f"Searching Google for '{search_term}'"
#             else:
#                 webbrowser.open("https://www.google.com")
#                 response = "Opening Google!"
#             tts.speak_text(response)
#             return response
#         except Exception as e:
#             logger.error(f"Google error: {e}")
#             error_msg = "Sorry, couldn't open Google."
#             tts.speak_text(error_msg)
#             return error_msg
    
#     @staticmethod
#     def handle_news(command: str) -> str:
#         try:
#             webbrowser.open("https://news.google.com")
#             response = "Opening the latest news for you!"
#             tts.speak_text(response)
#             return response
#         except Exception as e:
#             logger.error(f"News error: {e}")
#             error_msg = "Sorry, couldn't open news."
#             tts.speak_text(error_msg)
#             return error_msg
    
#     @staticmethod
#     def handle_joke(command: str) -> str:
#         jokes = [
#             "Why don't scientists trust atoms? Because they make up everything!",
#             "I told my wife she was drawing her eyebrows too high. She looked surprised.",
#             "Why don't programmers like nature? It has too many bugs!",
#             "What do you call a fake noodle? An impasta!",
#             "Why did the scarecrow win an award? He was outstanding in his field!"
#         ]
#         import random
#         response = random.choice(jokes)
#         tts.speak_text(response, priority=True)
#         return response
    
#     @staticmethod
#     def handle_exit(command: str) -> str:
#         responses = [
#             "Goodbye! Have a wonderful day!",
#             "See you later! Take care!",
#             "Bye! Feel free to come back anytime!",
#             "Until next time! Stay awesome!"
#         ]
#         import random
#         response = random.choice(responses)
#         tts.speak_text(response, priority=True)
#         return response
    
#     @staticmethod
#     def handle_help(command: str) -> str:
#         response = (
#             "I can help you with many things! Here are some examples:\n\n"
#             "🤖 **AI Conversations**: Ask me anything, I'll provide intelligent responses\n"
#             "💻 **Coding**: Write, debug, and explain code in various languages\n"
#             "🧮 **Math**: Solve calculations and mathematical problems\n"
#             "🌐 **Web**: Open YouTube, Google, Maps, Weather, News\n"
#             "🎵 **Entertainment**: Play music, tell jokes\n"
#             "📚 **Research**: Search Wikipedia and get information\n"
#             "🖼️ **Images**: Analyze and describe uploaded images\n"
#             "🗣️ **Voice**: Text-to-speech responses\n\n"
#             "Just speak or type naturally, and I'll understand what you need!"
#         )
#         tts.speak_text("I can assist with many tasks including coding, research, calculations, entertainment, and more. Check the screen for a complete list.", priority=True)
#         return response

# # Initialize handlers
# handlers = CommandHandlers()

# # ========== Routes ==========
# @app.route("/", methods=["GET"])
# def home():
#     return jsonify({
#         "status": "AURA+ Enhanced Server is running!",
#         "version": "2.0",
#         "features": ["Voice Synthesis", "AI Conversations", "Image Analysis", "Web Automation", "Code Assistance", "Multi-modal Support"],
#         "endpoints": {
#             "/": "Home page",
#             "/health": "Health check",
#             "/chat": "Enhanced chat with AI",
#             "/command": "Voice command processing",
#             "/clear": "Clear conversation history"
#         }
#     })

# @app.route("/health", methods=["GET"])
# def health_check():
#     return jsonify({
#         "status": "healthy",
#         "timestamp": datetime.datetime.now().isoformat(),
#         "services": {
#             "tts": "active" if tts.enabled else "disabled",
#             "gemini": "connected" if GEMINI_API_KEY else "no_api_key",
#             "wikipedia": "active",
#             "web_browser": "ready"
#         }
#     })

# @app.route("/chat", methods=["POST"])
# def enhanced_chat():
#     """Enhanced chat endpoint with multi-modal support"""
#     try:
#         data = request.get_json()
#         if not data:
#             return jsonify({"error": "No data provided"}), 400
        
#         message = data.get("message", "").strip()
#         image_data = data.get("image")  # Base64 image data
        
#         if not message and not image_data:
#             return jsonify({"error": "No message or image provided"}), 400
        
#         logger.info(f"Processing chat message: {message[:50]}...")
        
#         # Determine context based on message content
#         if image_data:
#             context = "image"
#             if not message:
#                 message = "Analyze this image and tell me what you see."
#         else:
#             # Classify the command to determine context
#             category, extracted_text = processor.classify_command(message)
#             if category == 'code':
#                 context = 'code'
#             elif category == 'calculate':
#                 context = 'calculate'
#             else:
#                 context = 'general'
        
#         # Get AI response
#         response = gemini.get_response(message, context, image_data)
        
#         return jsonify({
#             "response": response,
#             "context": context,
#             "timestamp": datetime.datetime.now().isoformat(),
#             "has_audio": tts.enabled
#         })
    
#     except Exception as e:
#         logger.error(f"Chat error: {e}")
#         error_response = "Sorry, I encountered an error processing your request."
#         tts.speak_text(error_response)
#         return jsonify({"error": error_response}), 500

# @app.route("/command", methods=["POST"])
# def handle_command():
#     """Handle voice commands with enhanced processing"""
#     try:
#         data = request.get_json()
#         if not data or 'command' not in data:
#             return jsonify({"error": "No command provided"}), 400
        
#         command = data.get("command", "").strip()
#         if not command:
#             return jsonify({"error": "Empty command"}), 400
        
#         logger.info(f"Processing command: {command}")
        
#         # Classify the command
#         category, extracted_text = processor.classify_command(command)
        
#         # Route to appropriate handler
#         response = route_command(category, command, extracted_text)
        
#         return jsonify({
#             "response": response,
#             "category": category,
#             "timestamp": datetime.datetime.now().isoformat(),
#             "has_audio": tts.enabled
#         })
    
#     except Exception as e:
#         logger.error(f"Command handling error: {e}")
#         error_response = "Sorry, I encountered an error processing your command."
#         tts.speak_text(error_response)
#         return jsonify({"error": error_response}), 500

# @app.route("/clear", methods=["POST"])
# def clear_history():
#     """Clear conversation history"""
#     try:
#         gemini.clear_history()
#         response = "Conversation history cleared successfully!"
#         tts.speak_text("History cleared!")
#         return jsonify({
#             "message": response,
#             "timestamp": datetime.datetime.now().isoformat()
#         })
#     except Exception as e:
#         logger.error(f"Clear history error: {e}")
#         return jsonify({"error": "Failed to clear history"}), 500

# @app.route("/tts", methods=["POST"])
# def text_to_speech():
#     """Endpoint for text-to-speech"""
#     try:
#         data = request.get_json()
#         if not data or 'text' not in data:
#             return jsonify({"error": "No text provided"}), 400
        
#         text = data.get("text", "").strip()
#         priority = data.get("priority", False)
        
#         if not text:
#             return jsonify({"error": "Empty text"}), 400
        
#         tts.speak_text(text, priority)
        
#         return jsonify({
#             "message": "Text queued for speech",
#             "text": text,
#             "enabled": tts.enabled
#         })
    
#     except Exception as e:
#         logger.error(f"TTS error: {e}")
#         return jsonify({"error": "TTS processing failed"}), 500

# def route_command(category: str, command: str, extracted_text: str) -> str:
#     """Route command to appropriate handler"""
#     handler_map = {
#         'greeting': handlers.handle_greeting,
#         'time': handlers.handle_time,
#         'date': handlers.handle_date,
#         'about': handlers.handle_about,
#         'youtube': handlers.handle_youtube,
#         'play': handlers.handle_play,
#         'weather': handlers.handle_weather,
#         'maps': handlers.handle_maps,
#         'google': handlers.handle_google,
#         'news': handlers.handle_news,
#         'joke': handlers.handle_joke,
#         'exit': handlers.handle_exit,
#         'help': handlers.handle_help
#     }
    
#     if category in handler_map:
#         return handler_map[category](command)
#     elif category == 'wikipedia' or category == 'search':
#         return wiki.get_summary(extracted_text or command)
#     else:
#         # Use Gemini for general queries, coding, calculations, etc.
#         context = 'code' if category == 'code' else 'calculate' if category == 'calculate' else 'general'
#         return gemini.get_response(command, context)

# # ========== Error Handlers ==========
# @app.errorhandler(404)
# def not_found(error):
#     return jsonify({"error": "Endpoint not found"}), 404

# @app.errorhandler(500)
# def internal_error(error):
#     return jsonify({"error": "Internal server error"}), 500

# # ========== Startup ==========
# if __name__ == "__main__":
#     print("🚀 AURA+ Enhanced Server Starting...")
#     print("✅ TTS Engine:", "Initialized" if tts.enabled else "Disabled")
#     print("✅ Gemini AI:", "Connected" if GEMINI_API_KEY else "No API Key")
#     print("✅ Wikipedia: Active")
#     print("✅ Web Browser: Ready")
#     print("✅ Multi-modal Support: Enabled")
#     print("🌟 Server running at http://127.0.0.1:5000")
#     print("\n🎯 Available endpoints:")
#     print("   GET  /         - Home page")
#     print("   GET  /health   - Health check")
#     print("   POST /chat     - Enhanced AI chat")
#     print("   POST /command  - Voice command processing")
#     print("   POST /clear    - Clear conversation history")
#     print("   POST /tts      - Text-to-speech")
    
#     app.run(debug=False, host='127.0.0.1', port=5000, threaded=True)

# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from pymongo import MongoClient
# from uuid import uuid4
# import base64
# import requests
# import os
# from dotenv import load_dotenv

# app = Flask(__name__)
# CORS(app)  # Enable CORS for cross-origin requests

# load_dotenv()

# app = Flask(__name__)
# client = MongoClient(os.getenv("MONGO_URI"))
# db = client["chat_db"]
# chats = db["chats"]

# # Gemini config
# GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
# GEMINI_ENDPOINT = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"

# # --- Helpers ---

# def format_message(role, text, image_data=None):
#     parts = [{"text": text}]
#     if image_data:
#         parts.append({
#             "inlineData": {
#                 "mimeType": image_data["mimeType"],
#                 "data": image_data["base64"]
#             }
#         })
#     return {"role": role, "parts": parts}

# # --- Routes ---

# @app.route("/init_session", methods=["GET"])
# def init_session():
#     user_id = str(uuid4())
#     return jsonify({"user_id": user_id})

# @app.route("/history/<user_id>", methods=["GET"])
# def get_history(user_id):
#     doc = chats.find_one({"user_id": user_id})
#     if doc:
#         return jsonify(doc.get("messages", []))
#     return jsonify([])

# @app.route("/chat", methods=["POST"])
# def chat():
#     data = request.json
#     user_id = data.get("user_id")
#     text = data.get("text", "").strip()
#     image = data.get("image")

#     if not user_id or not text:
#         return jsonify({"error": "Missing user_id or text"}), 400

#     doc = chats.find_one({"user_id": user_id})
#     chat_history = doc.get("messages", []) if doc else []

#     user_msg = format_message("user", text, image)
#     chat_history.append(user_msg)

#     payload = {"contents": chat_history[-10:]}

#     try:
#         response = requests.post(GEMINI_ENDPOINT, json=payload)
#         response.raise_for_status()
#         ai_text = response.json()["candidates"][0]["content"]["parts"][0]["text"]
#     except Exception as e:
#         return jsonify({"error": f"Gemini API error: {str(e)}"}), 500

#     ai_msg = format_message("model", ai_text)
#     chat_history.append(ai_msg)

#     chats.update_one(
#         {"user_id": user_id},
#         {"$set": {"messages": chat_history}},
#         upsert=True
#     )

#     return jsonify({"response": ai_text, "history": chat_history})

# @app.route("/upload_image", methods=["POST"])
# def upload_image():
#     file = request.files.get("file")
#     if not file:
#         return jsonify({"error": "No file uploaded"}), 400
#     encoded = base64.b64encode(file.read()).decode("utf-8")
#     return jsonify({"base64": encoded, "mimeType": file.mimetype})

# if __name__ == "__main__":
#     app.run(debug=True)

