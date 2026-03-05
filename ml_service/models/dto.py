from pydantic import BaseModel
from typing import List

class ForecastRequest(BaseModel):
    symbol: str
    days: int = 7

class ForecastResponse(BaseModel):
    symbol: str
    last_prices: List[float]
    linear_forecast: List[float]
    rf_forecast: List[float]
    lstm_forecast: List[float]
