from fastapi import APIRouter, Query
from typing import Optional
from services.stock_service import StockService

router = APIRouter(prefix="/api/stocks", tags=["Stock Market Analysis"])

@router.get("/live")
def get_live_prices():
    return StockService.get_live_prices()

@router.get("/history")
def get_stock_history(symbol: str = Query("NVDA"), days: int = Query(30)):
    return StockService.get_stock_history(symbol, days)

@router.get("/technical")
def get_technical_analysis(symbol: str = Query("NVDA")):
    return StockService.get_technical_analysis(symbol)

@router.get("/sentiment")
def get_news_sentiment(symbol: str = Query("NVDA")):
    return StockService.get_news_sentiment(symbol)

@router.get("/risk")
def get_risk_analysis(symbol: str = Query("NVDA")):
    return StockService.get_risk_analysis(symbol)

@router.get("/trade-ideas")
def get_trade_ideas(symbol: Optional[str] = Query(None)):
    return StockService.get_ai_trade_ideas(symbol)
