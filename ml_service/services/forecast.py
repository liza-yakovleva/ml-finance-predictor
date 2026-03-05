# ml_service/services/forecast.py
from typing import Tuple, List, Dict, Any
import requests
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor

# try optional import for ARIMA
try:
    from statsmodels.tsa.arima.model import ARIMA
    HAS_ARIMA = True
except Exception:
    HAS_ARIMA = False

BINANCE_KLINES = "https://api.binance.com/api/v3/klines"

def fetch_ohlcv(symbol: str, interval: str = "1d", limit: int = 500) -> pd.DataFrame:
    params = {"symbol": symbol.upper(), "interval": interval, "limit": limit}
    r = requests.get(BINANCE_KLINES, params=params, timeout=10)
    r.raise_for_status()
    data = r.json()
    # Each kline: [ openTime, open, high, low, close, volume, closeTime, ... ]
    df = pd.DataFrame(data, columns=[
        "open_time", "open", "high", "low", "close", "volume",
        "close_time", "qav", "num_trades", "taker_base_vol", "taker_quote_vol", "ignore"
    ])
    df["close"] = df["close"].astype(float)
    df["open_time"] = pd.to_datetime(df["open_time"], unit="ms")
    return df[["open_time", "close"]]

def make_lag_features(prices: pd.Series, lags: int = 5) -> Tuple[np.ndarray, np.ndarray]:
    X = []
    y = []
    for i in range(lags, len(prices)):
        X.append(prices[i-lags:i].tolist())
        y.append(prices[i])
    return np.array(X), np.array(y)

def forecast_linear(prices: pd.Series, predict_periods: int = 7, lags: int = 5) -> List[float]:
    X, y = make_lag_features(prices.values, lags)
    model = LinearRegression()
    model.fit(X, y)
    last_window = prices.values[-lags:].tolist()
    preds = []
    for _ in range(predict_periods):
        p = float(model.predict([last_window])[0])
        preds.append(p)
        last_window = last_window[1:] + [p]
    return preds

def forecast_rf(prices: pd.Series, predict_periods: int = 7, lags: int = 10, n_estimators: int = 100) -> List[float]:
    X, y = make_lag_features(prices.values, lags)
    model = RandomForestRegressor(n_estimators=n_estimators, random_state=42)
    model.fit(X, y)
    last_window = prices.values[-lags:].tolist()
    preds = []
    for _ in range(predict_periods):
        p = float(model.predict([last_window])[0])
        preds.append(p)
        last_window = last_window[1:] + [p]
    return preds

def forecast_arima(prices: pd.Series, predict_periods: int = 7) -> List[float]:
    if not HAS_ARIMA:
        raise RuntimeError("ARIMA not available (install statsmodels).")
    model = ARIMA(prices.values, order=(5,1,0))
    res = model.fit()
    fc = res.forecast(steps=predict_periods)
    return [float(x) for x in fc]

def run_forecast(symbol: str, interval: str = "1d", limit: int = 500, predict_periods: int = 7, model_name: str = "linear") -> Dict[str, Any]:
    df = fetch_ohlcv(symbol, interval=interval, limit=limit)
    closes = df["close"]
    last_prices = closes.tolist()[-100:]  # return recent 100 for frontend
    if model_name == "linear":
        preds = forecast_linear(closes, predict_periods=predict_periods, lags=5)
    elif model_name == "random_forest":
        preds = forecast_rf(closes, predict_periods=predict_periods, lags=10)
    elif model_name == "arima":
        preds = forecast_arima(closes, predict_periods=predict_periods)
    else:
        raise ValueError("Unknown model: " + model_name)

    # build future timestamps (daily by interval)
    last_time = df["open_time"].iloc[-1]
    freq_map = {"1d":"1D","1h":"1H","1m":"1T"}  # basic
    freq = freq_map.get(interval, "1D")
    future_times = pd.date_range(start=last_time + pd.Timedelta(1, unit=freq[1].upper()), periods=predict_periods, freq=freq)
    future_times = [str(t) for t in future_times]
    return {
        "symbol": symbol.upper(),
        "interval": interval,
        "last_prices": last_prices,
        "predicted": preds,
        "predicted_times": future_times
    }
