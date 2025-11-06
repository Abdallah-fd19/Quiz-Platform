#!/usr/bin/env python3
"""
Test script for Gemini API integration
Run this script to test if your API key and configuration are working correctly.
"""

import os
import sys
import json
import requests
from dotenv import load_dotenv
import dotenv

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

load_dotenv()
GOOGLE_API_KEY = dotenv.get_key(dotenv.find_dotenv(), "GOOGLE_GEMINI_API_KEY")

def test_gemini_api():
    """Test the Gemini API with a simple request"""
    
    if not GOOGLE_API_KEY:
        print("❌ Error: GOOGLE_GEMINI_API_KEY not found in environment variables")
        print("Please create a .env file in the backend directory with:")
        print("GOOGLE_GEMINI_API_KEY=your_api_key_here")
        return False
    
    print(f"✅ API Key found: {GOOGLE_API_KEY[:10]}...")
    
    # Test with a simple prompt
    model_name = "gemini-2.5-flash"
    url = f"https://generativelanguage.googleapis.com/v1/models/{model_name}:generateContent?key={GOOGLE_API_KEY}"
    
    headers = {
        "Content-Type": "application/json"
    }
    
    data = {
        "contents": [{
            "parts": [{"text": "Hello! Please respond with 'API is working' if you can read this."}]
        }],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 2000
        }
    }
    
    try:
        print("🔄 Sending test request to Gemini API...")
        response = requests.post(url, json=data, headers=headers)
        
        print(f"📊 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            response_data = response.json()
            if "candidates" in response_data and response_data["candidates"]:
                content = response_data["candidates"][0]["content"]["parts"][0]["text"]
                print(f"✅ API Response: {content}")
                return True
            else:
                print("❌ No content in response")
                print(f"Response: {json.dumps(response_data, indent=2)}")
                return False
        else:
            print(f"❌ API Error: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Network Error: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected Error: {e}")
        return False

def test_quiz_generation():
    """Test the quiz generation functionality"""
    
    if not GOOGLE_API_KEY:
        print("❌ Cannot test quiz generation without API key")
        return False
    
    print("\n🔄 Testing quiz generation...")
    
    model_name = "gemini-2.5-flash"
    url = f"https://generativelanguage.googleapis.com/v1/models/{model_name}:generateContent?key={GOOGLE_API_KEY}"
    
    headers = {
        "Content-Type": "application/json"
    }
    
    prompt = """
    Generate a quiz on the topic 'Python Programming' with 2 multiple-choice questions.
    Provide JSON in this format:
    {
        "title": "Python Programming Quiz",
        "description": "Quiz description",
        "questions": [
            {
                "text": "Question text",
                "choices": [
                    {"text": "Choice 1", "is_correct": true},
                    {"text": "Choice 2", "is_correct": false}
                ]
            }
        ]
    }
    """
    
    data = {
        "contents": [{
            "parts": [{"text": prompt}]
        }],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 2000
        }
    }
    
    try:
        response = requests.post(url, json=data, headers=headers)
        
        if response.status_code == 200:
            response_data = response.json()
            if "candidates" in response_data and response_data["candidates"]:
                content = response_data["candidates"][0]["content"]["parts"][0]["text"]
                print("✅ Quiz generation successful!")
                print("Generated content:")
                print("-" * 50)
                print(content)
                print("-" * 50)
                
                # Try to parse as JSON
                try:
                    # Remove markdown code blocks if present
                    json_content = content.strip()
                    if json_content.startswith('```json'):
                        json_content = json_content[7:]  # Remove ```json
                    if json_content.endswith('```'):
                        json_content = json_content[:-3]  # Remove ```
                    json_content = json_content.strip()
                    
                    quiz_data = json.loads(json_content)
                    print("✅ JSON parsing successful!")
                    print(f"Quiz title: {quiz_data.get('title', 'N/A')}")
                    print(f"Number of questions: {len(quiz_data.get('questions', []))}")
                    return True
                except json.JSONDecodeError as e:
                    print(f"❌ JSON parsing failed: {e}")
                    print(f"Raw content: {content[:200]}...")
                    return False
            else:
                print("❌ No content generated")
                return False
        else:
            print(f"❌ Quiz generation failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Quiz generation error: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Testing Gemini API Integration")
    print("=" * 40)
    
    # Test basic API connectivity
    basic_test = test_gemini_api()
    
    if basic_test:
        # Test quiz generation
        quiz_test = test_quiz_generation()
        
        if quiz_test:
            print("\n🎉 All tests passed! Your Gemini API integration is working correctly.")
        else:
            print("\n⚠️  Basic API works but quiz generation needs attention.")
    else:
        print("\n❌ Basic API test failed. Please check your API key and configuration.")
