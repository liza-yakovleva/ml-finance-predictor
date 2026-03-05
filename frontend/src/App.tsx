import React, { useState } from "react";
import ForecastForm from "./components/ForecastForm";
import ForecastChart from "./components/ForecastChart";
import type { ForecastResponse } from "./types";

export default function App() {
  const [result, setResult] = useState<ForecastResponse | null>(null);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="bg-white shadow-md p-6 rounded-xl mb-6">
          <h1 className="text-2xl font-bold">
            Diploma — Crypto Price Forecasting (Binance)
          </h1>
          <p className="text-gray-600 mt-1">
            Select model and parameters to generate a forecast.
          </p>
        </div>

        {/* Form */}
        <ForecastForm onResult={setResult} />

        {/* Chart or placeholder */}
        {result ? (
          <ForecastChart data={result} />
        ) : (
          <div className="bg-white shadow-md p-6 rounded-xl text-center">
            <p className="text-gray-500">No data yet — please request a forecast.</p>
          </div>
        )}

      </div>
    </div>
  );
}
