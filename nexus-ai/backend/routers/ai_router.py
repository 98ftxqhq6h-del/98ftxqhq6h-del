from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from services.ai_service import AIService

router = APIRouter(prefix="/api/ai", tags=["AI Assistant"])

class ChatReq(BaseModel):
    message: str
    provider: Optional[str] = "ollama"
    model: Optional[str] = "qwen2.5-coder"
    system_prompt: Optional[str] = None

class MemoryReq(BaseModel):
    content: str
    category: Optional[str] = "General"
    tags: Optional[List[str]] = None

class SummarizeReq(BaseModel):
    text: str
    max_length: Optional[int] = 150

class CodeGenReq(BaseModel):
    prompt: str
    language: Optional[str] = "python"

@router.post("/chat")
def chat_endpoint(data: ChatReq):
    if not data.message.strip():
        raise HTTPException(status_code=400, detail="Message content cannot be empty")
    return AIService.chat(
        message=data.message,
        provider=data.provider or "ollama",
        model=data.model or "qwen2.5-coder",
        system_prompt=data.system_prompt
    )

@router.get("/memory")
def get_memories(query: Optional[str] = None):
    return AIService.get_memories(query)

@router.post("/memory")
def add_memory(data: MemoryReq):
    return AIService.add_memory(data.content, data.category, data.tags)

@router.delete("/memory")
def clear_memory(memory_id: Optional[str] = None):
    return AIService.clear_memory(memory_id)

@router.post("/summarize")
def summarize_endpoint(data: SummarizeReq):
    if not data.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    return AIService.summarize(data.text, data.max_length or 150)

@router.post("/codegen")
def codegen_endpoint(data: CodeGenReq):
    if not data.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")
    return AIService.generate_code(data.prompt, data.language or "python")
