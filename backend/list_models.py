#!/usr/bin/env python3
"""
Script to list available Gemini API models
"""

import os
import sys
import requests
from dotenv import load_dotenv
import dotenv

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

load_dotenv()
GOOGLE_API_KEY = dotenv.get_key(dotenv.find_dotenv(), "GOOGLE_GEMINI_API_KEY")

def list_available_models():
    """List all available Gemini API models"""
    
    if not GOOGLE_API_KEY:
        print("❌ Error: GOOGLE_GEMINI_API_KEY not found in environment variables")
        return False
    
    print(f"✅ API Key found: {GOOGLE_API_KEY[:10]}...")
    
    # Try v1 API first
    url = "https://generativelanguage.googleapis.com/v1/models"
    headers = {
        "x-goog-api-key": GOOGLE_API_KEY
    }
    
    try:
        print("🔄 Fetching models from v1 API...")
        response = requests.get(url, headers=headers)
        
        print(f"📊 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            models_data = response.json()
            if "models" in models_data:
                print(f"✅ Found {len(models_data['models'])} models in v1 API:")
                for model in models_data["models"]:
                    name = model.get("name", "Unknown")
                    display_name = model.get("displayName", "No display name")
                    supported_methods = model.get("supportedGenerationMethods", [])
                    print(f"  - {name} ({display_name})")
                    if supported_methods:
                        print(f"    Supported methods: {', '.join(supported_methods)}")
                return True
            else:
                print("❌ No models found in response")
                print(f"Response: {response.text}")
                return False
        else:
            print(f"❌ v1 API Error: {response.status_code}")
            print(f"Response: {response.text}")
            
            # Try v1beta as fallback
            print("\n🔄 Trying v1beta API...")
            url_beta = "https://generativelanguage.googleapis.com/v1beta/models"
            response_beta = requests.get(url_beta, headers=headers)
            
            print(f"📊 v1beta Status Code: {response_beta.status_code}")
            
            if response_beta.status_code == 200:
                models_data = response_beta.json()
                if "models" in models_data:
                    print(f"✅ Found {len(models_data['models'])} models in v1beta API:")
                    for model in models_data["models"]:
                        name = model.get("name", "Unknown")
                        display_name = model.get("displayName", "No display name")
                        supported_methods = model.get("supportedGenerationMethods", [])
                        print(f"  - {name} ({display_name})")
                        if supported_methods:
                            print(f"    Supported methods: {', '.join(supported_methods)}")
                    return True
                else:
                    print("❌ No models found in v1beta response")
                    print(f"Response: {response_beta.text}")
                    return False
            else:
                print(f"❌ v1beta API Error: {response_beta.status_code}")
                print(f"Response: {response_beta.text}")
                return False
                
    except requests.exceptions.RequestException as e:
        print(f"❌ Network Error: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected Error: {e}")
        return False

if __name__ == "__main__":
    print("🔍 Listing Available Gemini API Models")
    print("=" * 40)
    
    success = list_available_models()
    
    if success:
        print("\n✅ Model listing completed successfully!")
    else:
        print("\n❌ Failed to list models. Please check your API key and configuration.")
