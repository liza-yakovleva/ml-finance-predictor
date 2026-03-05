import { useState } from "react"; 
import type { ForecastResponse } from "../types";
import { requestCryptoForecast } from "../services/api";

interface Props {
  onResult: (data: ForecastResponse | null) => void;
}

export default function ForecastForm({ onResult }: Props) {
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [interval, setInterval] = useState("1d");
  const [predictPeriods, setPredictPeriods] = useState(7);
  const [model, setModel] = useState("linear");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        symbol,
        interval,
        limit: 500,
        predict_periods: predictPeriods,
        model
      };
      const res = await requestCryptoForecast(payload);
      onResult(res);
    } catch (err: any) {
      alert("Помилка: " + (err.response?.data?.detail || err.message));
      onResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md p-6 rounded-xl mb-6"
    >
      <div className="grid sm:grid-cols-5 gap-4 items-end">

        <div>
          <label className="block text-sm font-medium mb-1">Symbol</label>
          <input
            className="border rounded-md px-3 py-2 w-full"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Interval</label>
          <select
            className="border rounded-md px-3 py-2 w-full"
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
          >
            <option value="1d">1d</option>
            <option value="1h">1h</option>
            <option value="1m">1m</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Predict periods
          </label>
          <input
            className="border rounded-md px-3 py-2 w-full"
            type="number"
            min={1}
            value={predictPeriods}
            onChange={(e) => setPredictPeriods(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Model</label>
          <select
            className="border rounded-md px-3 py-2 w-full"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            <option value="linear">Linear Regression</option>
            <option value="random_forest">Random Forest</option>
            <option value="arima">ARIMA</option>
          </select>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md w-full transition disabled:bg-gray-400"
          >
            {loading ? "Loading..." : "Get Forecast"}
          </button>
        </div>

      </div>
    </form>
  );
}
