#!/usr/bin/env python3
"""
API Testing Script for AURA+ Backend
Run this to test your API endpoints
"""

import requests
import json

def test_api_endpoints():
    # Change this to your server URL
    BASE_URL = "http://localhost:5000"  # For development
    # BASE_URL = "https://your-app.onrender.com"  # For production
    
    print("🧪 Testing AURA+ API Endpoints")
    print(f"📡 Base URL: {BASE_URL}")
    print("-" * 50)
    
    # Test 1: Health Check
    print("1️⃣ Testing Health Check...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"   Status: {response.status_code}")
        print(f"   Content-Type: {response.headers.get('content-type')}")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Health check passed")
            print(f"   Firebase: {data.get('firebase_connected')}")
            print(f"   Gemini: {data.get('gemini_connected')}")
        else:
            print(f"   ❌ Health check failed")
    except Exception as e:
        print(f"   ❌ Health check error: {e}")
    
    print()
    
    # Test 2: API Info
    print("2️⃣ Testing API Info...")
    try:
        response = requests.get(f"{BASE_URL}/api/info")
        print(f"   Status: {response.status_code}")
        print(f"   Content-Type: {response.headers.get('content-type')}")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ API info retrieved")
            print(f"   Version: {data.get('version')}")
            print(f"   Environment: {data.get('environment')}")
        else:
            print(f"   ❌ API info failed")
            print(f"   Response: {response.text[:200]}")
    except Exception as e:
        print(f"   ❌ API info error: {e}")
    
    print()
    
    # Test 3: Get History
    print("3️⃣ Testing Get History...")
    try:
        session = requests.Session()  # Use session to maintain cookies
        response = session.get(f"{BASE_URL}/api/get_history")
        print(f"   Status: {response.status_code}")
        print(f"   Content-Type: {response.headers.get('content-type')}")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ History retrieved")
            print(f"   Messages: {len(data)}")
        else:
            print(f"   ❌ Get history failed")
            print(f"   Response: {response.text[:200]}")
    except Exception as e:
        print(f"   ❌ Get history error: {e}")
    
    print()
    
    # Test 4: Send Chat Message
    print("4️⃣ Testing Chat Message...")
    try:
        session = requests.Session()  # Use session to maintain cookies
        chat_data = {"prompt": "Hello, this is a test message"}
        response = session.post(
            f"{BASE_URL}/api/chat",
            json=chat_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"   Status: {response.status_code}")
        print(f"   Content-Type: {response.headers.get('content-type')}")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Chat message sent")
            print(f"   Response: {data.get('response', 'No response')[:100]}...")
        else:
            print(f"   ❌ Chat message failed")
            print(f"   Response: {response.text[:200]}")
    except Exception as e:
        print(f"   ❌ Chat message error: {e}")
    
    print()
    print("🏁 API Testing Complete")

if __name__ == "__main__":
    test_api_endpoints()
