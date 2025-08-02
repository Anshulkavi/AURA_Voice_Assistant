# 🎙️ AURA+ Voice Assistant

AURA+ is a smart voice-enabled assistant built with **Flask**, **React**, **Firebase**, and **Gemini AI**. It supports **voice/text input**, **chat history**, **text-to-speech**, and various actions like Wikipedia search, YouTube playback, and web automation.

---

## 🌐 Tech Stack

| Layer      | Tech Used                               |
|------------|------------------------------------------|
| Frontend   | React + Vite + Tailwind CSS              |
| Backend    | Flask (Python)                           |
| AI Model   | Google Gemini API                        |
| Database   | Firebase Firestore                       |
| Auth       | Firebase Auth                            |
| Voice      | pyttsx3 (TTS) + SpeechRecognition (STT)  |
| Hosting    | Render (frontend + backend)              |

---

## 📁 Folder Structure

AURA/
├── aura-frontend/ # React client
├── aura-backend/ # Flask server
│ ├── app.py # Main backend logic
│ ├── firebase-service-account.json
│ └── .env # Environment variables

---

## ⚙️ Features

- 🎤 Voice & Text input support
- 🤖 Gemini-powered AI chat
- 💾 Chat history stored in Firebase
- 🔊 Text-to-speech playback
- 🌐 Wikipedia search, YouTube control, automation (basic)
- 🧠 Context-aware responses

---

## 🚀 Getting Started

### ✅ Prerequisites

- Python 3.10+
- Node.js 18+
- Google API Key + Gemini Access
- Firebase Project (Auth + Firestore)

---

### 🔧 Backend Setup (Flask)

1. **Navigate to backend folder:**

```bash
cd aura-backend
Install dependencies:

pip install -r requirements.txt
Add your Firebase credentials:

Paste your Firebase Admin SDK JSON into a file:

firebase-service-account.json
Or paste it directly into .env:

FIREBASE_SERVICE_ACCOUNT_JSON={...}
Set your .env:

GOOGLE_API_KEY=your_gemini_api_key
FIREBASE_SERVICE_ACCOUNT_JSON=your_json_or_empty_if_using_file
Run the server locally:

python app.py
Runs at: http://localhost:5000

🌐 Frontend Setup (React)
Navigate to frontend:

cd aura-frontend
Install dependencies:

npm install
Run the app:

npm run dev
Runs at: http://localhost:5173

🔁 React auto-switches API calls between local and production using import.meta.env.PROD.

🛰️ Deployment (Render)
Backend
Push aura-backend to GitHub

Create a Web Service on Render

Set build command: pip install -r requirements.txt

Set start command: python app.py

Add environment variables:

GOOGLE_API_KEY

FIREBASE_SERVICE_ACCOUNT_JSON

Frontend
Push aura-frontend to GitHub

Create a Static Site on Render

Set build command: npm run build

Set publish directory: dist

📦 API Endpoints
Route	Method	Description
/chat	POST	Send message to Gemini
/get_history	GET	Fetch chat history
/speak	POST	Convert response to speech
/command	POST	Handle voice commands
/ (fallback)	GET	Serve React frontend

🔐 Environment Variables (.env)

GOOGLE_API_KEY=your_gemini_api_key
FIREBASE_SERVICE_ACCOUNT_JSON=your_firebase_json_or_leave_empty
🧪 Testing Locally
React calls Flask via:

const API_URL = import.meta.env.PROD ? "/api" : "http://localhost:5000/api";
Ensure CORS is enabled in app.py:

from flask_cors import CORS
CORS(app, supports_credentials=True)
🧠 Credits
Voice: pyttsx3

AI: Gemini by Google

Hosting: Render

Auth/DB: Firebase

📜 License
MIT © Anshul Kavishwar

