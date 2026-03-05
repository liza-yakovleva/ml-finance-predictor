# backend/app/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from app.services.ml_client import request_ml_forecast

app = FastAPI(title="Backend API")

# allow frontend dev origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FrontRequest(BaseModel):
    symbol: str
    interval: Optional[str] = "1d"
    limit: Optional[int] = 500
    predict_periods: Optional[int] = 7
    model: Optional[str] = "linear"

@app.get("/")
def root():
    return {"status": "backend ok"}

@app.post("/api/crypto-forecast")
def crypto_forecast(req: FrontRequest):
    try:
        payload = req.dict()
        resp = request_ml_forecast(payload)
        return resp
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
