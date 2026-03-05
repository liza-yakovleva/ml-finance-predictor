# backend/app/services/ml_client.py
import httpx
from typing import Dict, Any

ML_SERVICE_URL = "http://127.0.0.1:8001/forecast"  # ml_service адреса

def request_ml_forecast(payload: Dict[str, Any]) -> Dict[str, Any]:
    with httpx.Client(timeout=30.0) as client:
        r = client.post(ML_SERVICE_URL, json=payload)
        r.raise_for_status()
        return r.json()
