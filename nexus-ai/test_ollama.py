import requests

response = requests.post(
    "http://127.0.0.1:11434/api/generate",
    json={
        "model": "qwen2.5-coder",
        "prompt": "Say Hello",
        "stream": False
    }
)

print(response.json()["response"])