from typing import List
from pydantic import BaseModel

class ForecastRequest(BaseModel):
    symbol: str
    interval: str = "1d"
    limit: int = 500
    predict_periods: int = 7
    model: str = "linear"

class ForecastResponse(BaseModel):
    symbol: str
    interval: str
    last_prices: List[float]
    predicted: List[float]
    predicted_times: List[str]
