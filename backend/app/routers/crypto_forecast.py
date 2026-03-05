from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
import httpx

router = APIRouter(prefix="/api")

class CryptoForecastRequest(BaseModel):
    symbol: str
    predict_for: int
    model: str  # 'linear', 'random_forest', 'lstm'

class CryptoForecastResponse(BaseModel):
    last_prices: List[float]
    predicted: List[float]

ML_SERVICE_URL = "http://127.0.0.1:8001/forecast"

async def get_historical_prices(symbol: str, limit: int = 50):
    import pandas as pd
    from binance.client import Client
    import os
    api_key = os.getenv("BINANCE_API_KEY", "")
    api_secret = os.getenv("BINANCE_API_SECRET", "")
    client = Client(api_key, api_secret)

    klines = client.get_klines(symbol=symbol, interval=Client.KLINE_INTERVAL_1DAY, limit=limit)
    df = pd.DataFrame(klines, columns=["open_time", "open", "high", "low", "close", "volume", "close_time",
                                       "quote_asset_volume", "number_of_trades", "taker_buy_base", "taker_buy_quote", "ignore"])
    return df["close"].astype(float).tolist()

@router.post("/crypto-forecast", response_model=CryptoForecastResponse)
async def crypto_forecast(req: CryptoForecastRequest):
    prices = await get_historical_prices(req.symbol)
    async with httpx.AsyncClient() as client:
        response = await client.post(ML_SERVICE_URL, json={
            "prices": prices,
            "predict_for": req.predict_for,
            "model": req.model
        })
        pred = response.json()["predicted"]
    return CryptoForecastResponse(last_prices=prices, predicted=pred)
