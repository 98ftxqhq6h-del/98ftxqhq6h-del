import sys
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Ensure backend root is on Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

load_dotenv()

from routers.ai_router import router as ai_router
from routers.github_router import router as github_router
from routers.stock_router import router as stock_router
from routers.integrations_router import router as integrations_router

app = FastAPI(
    title="NEXUS AI Superintelligence OS Backend",
    description="High-performance FastAPI microservice powering AI Assistant, GitHub Assistant, Stock Market Analysis, and Multi-Service Connectors.",
    version="2.5.0"
)

# Enable CORS for local & production web apps
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(ai_router)
app.include_router(github_router)
app.include_router(stock_router)
app.include_router(integrations_router)

@app.get("/")
def root():
    return {
        "status": "ONLINE",
        "system": "NEXUS AI Superintelligence OS",
        "version": "2.5.0",
        "telemetry": {
            "ai_providers": ["Ollama", "OpenAI", "xAI Grok"],
            "github_integration": "ACTIVE",
            "stock_market_engine": "ACTIVE",
            "connectors": ["Dropbox", "Notion", "Slack", "Outlook"]
        }
    }

@app.get("/health")
def health():
    return {"status": "HEALTHY", "code": 200}