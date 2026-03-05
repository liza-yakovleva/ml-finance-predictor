import axios from "axios";
import type { ForecastResponse } from "../types";

const BACKEND = "http://127.0.0.1:8000";

export async function requestCryptoForecast(payload: {
  symbol: string;
  interval?: string;
  limit?: number;
  predict_periods?: number;
  model?: string;
}): Promise<ForecastResponse> {
  const res = await axios.post(`${BACKEND}/api/crypto-forecast`, payload, { timeout: 30000 });
  return res.data as ForecastResponse;
}
