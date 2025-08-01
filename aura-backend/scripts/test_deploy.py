#!/usr/bin/env python3
"""
Deployment Debug Script
Run this to test your production deployment
"""

import requests
import json

def test_production_deployment():
    BASE_URL = "https://aura-voice-assistant-1.onrender.com"
    
    print("🧪 Testing Production Deployment")
    print(f"📡 Base URL: {BASE_URL}")
    print("-" * 50)
    
    # Test 1: Root endpoint
    print("1️⃣ Testing Root Endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"   Status: {response.status_code}")
        print(f"   Content-Type: {response.headers.get('content-type')}")
        if response.status_code == 200:
            if 'text/html' in response.headers.get('content-type', ''):
                print("   ✅ HTML response (React app)")
            else:
                print("   📄 JSON response:", response.json())
        else:
            print(f"   ❌ Root endpoint failed")
    except Exception as e:
        print(f"   ❌ Root endpoint error: {e}")
    
    print()
    
    # Test 2: Health Check
    print("2️⃣ Testing Health Check...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"   Status: {response.status_code}")
        print(f"   Content-Type: {response.headers.get('content-type')}")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Health check passed")
            print(f"   Environment: {data.get('environment')}")
            print(f"   Firebase: {data.get('firebase_connected')}")
            print(f"   Gemini: {data.get('gemini_connected')}")
            print(f"   Static folder exists: {data.get('static_folder_exists')}")
        else:
            print(f"   ❌ Health check failed")
    except Exception as e:
        print(f"   ❌ Health check error: {e}")
    
    print()
    
    # Test 3: API Info
    print("3️⃣ Testing API Info...")
    try:
        response = requests.get(f"{BASE_URL}/api/info")
        print(f"   Status: {response.status_code}")
        print(f"   Content-Type: {response.headers.get('content-type')}")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ API info retrieved")
            print(f"   Version: {data.get('version')}")
            print(f"   CORS origins: {data.get('cors_origins')}")
        else:
            print(f"   ❌ API info failed")
            print(f"   Response: {response.text[:200]}")
    except Exception as e:
        print(f"   ❌ API info error: {e}")
    
    print()
    
    # Test 4: Chatbot page
    print("4️⃣ Testing Chatbot Page...")
    try:
        response = requests.get(f"{BASE_URL}/chatbot")
        print(f"   Status: {response.status_code}")
        print(f"   Content-Type: {response.headers.get('content-type')}")
        if response.status_code == 200:
            if 'text/html' in response.headers.get('content-type', ''):
                print("   ✅ Chatbot page served (HTML)")
            else:
                print("   📄 JSON response:", response.json())
        else:
            print(f"   ❌ Chatbot page failed")
    except Exception as e:
        print(f"   ❌ Chatbot page error: {e}")
    
    print()
    
    # Test 5: API History (with session)
    print("5️⃣ Testing API History...")
    try:
        session = requests.Session()
        response = session.get(f"{BASE_URL}/api/get_history")
        print(f"   Status: {response.status_code}")
        print(f"   Content-Type: {response.headers.get('content-type')}")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ History retrieved")
            print(f"   Messages: {len(data)}")
        else:
            print(f"   ❌ History failed")
            print(f"   Response: {response.text[:200]}")
    except Exception as e:
        print(f"   ❌ History error: {e}")
    
    print()
    print("🏁 Production Testing Complete")

if __name__ == "__main__":
    test_production_deployment()
