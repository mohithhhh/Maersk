import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Correct model naming (must include "models/")
DEFAULT_MODEL = os.getenv("GEMINI_MODEL", "models/gemini-2.5-pro")
GEMINI_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_KEY:
    raise ValueError("❌ GEMINI_API_KEY not found in .env")

# ✅ Correct URL base for Gemini v1
BASE_URL = "https://generativelanguage.googleapis.com/v1"

def call_gemini(prompt: str, model: str = DEFAULT_MODEL, temperature: float = 0.3, max_tokens: int = 4096):
    """
    Calls Gemini API and returns structured text safely.
    """
    url = f"{BASE_URL}/{model}:generateContent?key={GEMINI_KEY}"

    body = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": temperature,
            "maxOutputTokens": max_tokens
        }
    }

    try:
        resp = requests.post(url, json=body, timeout=60)
        resp.raise_for_status()
        data = resp.json()

        if "candidates" in data and data["candidates"]:
            parts = data["candidates"][0].get("content", {}).get("parts", [])
            if parts and "text" in parts[0]:
                return {"text": parts[0]["text"].strip()}

        return {"text": f"[Gemini Debug] Unexpected response: {data}"}

    except requests.exceptions.HTTPError as http_err:
        return {"text": f"[GeminiError] HTTP {resp.status_code}: {http_err}"}
    except requests.exceptions.Timeout:
        return {"text": "[GeminiError] Request timed out."}
    except Exception as e:
        return {"text": f"[GeminiError] {e}"}