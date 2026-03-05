# ml_service/main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from services.forecast import run_forecast

app = FastAPI(title="ML Forecast Service")

class ForecastRequest(BaseModel):
    symbol: str
    interval: Optional[str] = "1d"
    limit: Optional[int] = 500
    predict_periods: Optional[int] = 7
    model: Optional[str] = "linear"  # "linear", "random_forest", "arima"

@app.get("/")
def root():
    return {"status": "ml_service ok"}

@app.post("/forecast")
def forecast(req: ForecastRequest):
    try:
        result = run_forecast(
            symbol=req.symbol,
            interval=req.interval,
            limit=req.limit,
            predict_periods=req.predict_periods,
            model_name=req.model
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
