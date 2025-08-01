#!/usr/bin/env python3
"""
Test API Routes Specifically
"""

import requests
import json

def test_api_routes():
    BASE_URL = "https://aura-voice-assistant-1.onrender.com"
    
    print("🧪 Testing API Routes Specifically")
    print(f"📡 Base URL: {BASE_URL}")
    print("=" * 50)
    
    # Test each API route individually
    api_routes = [
        ("/health", "GET"),
        ("/api/info", "GET"),
        ("/api/get_history", "GET"),
    ]
    
    for route, method in api_routes:
        print(f"\n🎯 Testing {method} {route}")
        try:
            url = f"{BASE_URL}{route}"
            print(f"   📡 URL: {url}")
            
            if method == "GET":
                response = requests.get(url, timeout=15)
            else:
                response = requests.post(url, timeout=15)
            
            print(f"   📊 Status: {response.status_code}")
            print(f"   📊 Content-Type: {response.headers.get('content-type')}")
            print(f"   📊 Content-Length: {response.headers.get('content-length')}")
            
            # Check if it's JSON or HTML
            content_type = response.headers.get('content-type', '')
            if 'application/json' in content_type:
                try:
                    data = response.json()
                    print(f"   ✅ JSON Response received")
                    if isinstance(data, dict):
                        print(f"   📋 Keys: {list(data.keys())}")
                    else:
                        print(f"   📋 Type: {type(data)}")
                except:
                    print(f"   ❌ Failed to parse JSON")
            elif 'text/html' in content_type:
                print(f"   ❌ HTML Response (should be JSON!)")
                content = response.text[:200]
                print(f"   📄 Content preview: {content}...")
            else:
                print(f"   ⚠️  Unknown content type")
                
        except Exception as e:
            print(f"   ❌ Error: {e}")
    
    print("\n" + "=" * 50)
    print("📋 Summary:")
    print("   - If all routes return JSON: ✅ API routing works")
    print("   - If routes return HTML: ❌ Flask routing issue")
    print("   - Check Render logs for detailed error messages")

if __name__ == "__main__":
    test_api_routes()
