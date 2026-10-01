import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import type { ForecastResponse } from "../types";
import {
  createForecastCsvUrl,
  createForecastJsonUrl,
  revokeForecastExportUrl,
} from "../utils/exportForecast";

interface Props {
  data: ForecastResponse;
}

export default function ForecastChart({ data }: Props) {
  const recent = data.last_prices ?? [];
  const predicted = data.predicted ?? [];
  const times = data.predicted_times ?? [];

  const points: any[] = [];

  for (let i = 0; i < recent.length; i++) {
    points.push({ name: `t-${recent.length - i}`, actual: recent[i] });
  }

  for (let i = 0; i < predicted.length; i++) {
    points.push({
      name: times[i]
        ? new Date(times[i]).toLocaleString()
        : `f+${i + 1}`,
      predicted: predicted[i]
    });
  }

  const downloadForecast = (format: "csv" | "json") => {
    const url = format === "csv"
      ? createForecastCsvUrl(data)
      : createForecastJsonUrl(data);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${data.symbol.toLowerCase()}-forecast.${format}`;
    link.click();
    revokeForecastExportUrl(url);
  };

  return (
    <div className="bg-white shadow-md p-6 rounded-xl mt-6">
      <h3 className="text-lg font-semibold mb-4">
        {data.symbol} — forecast ({data.interval})
      </h3>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => downloadForecast("csv")}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Завантажити CSV
        </button>
        <button
          type="button"
          onClick={() => downloadForecast("json")}
          className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
        >
          Завантажити JSON
        </button>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={points}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" minTickGap={20} />
          
          <YAxis domain={["dataMin", "dataMax"]} tick={{ fontSize: 12 }} angle={-45} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="actual" name="Actual (recent)" stroke="#8884d8" dot={false} />
          <Line type="monotone" dataKey="predicted" name="Predicted" stroke="#ff7300" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
