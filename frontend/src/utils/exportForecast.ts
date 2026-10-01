import type { ForecastResponse } from "../types";

function escapeCsvField(value: string | number): string {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function forecastToCsv(data: ForecastResponse): string {
  const rows = ["symbol,interval,type,index,timestamp,value"];
  const predictedTimes = data.predicted_times ?? [];

  data.last_prices.forEach((value, index) => {
    rows.push([
      data.symbol,
      data.interval,
      "actual",
      index + 1,
      "",
      value,
    ].map(escapeCsvField).join(","));
  });

  data.predicted.forEach((value, index) => {
    rows.push([
      data.symbol,
      data.interval,
      "predicted",
      index + 1,
      predictedTimes[index] ?? "",
      value,
    ].map(escapeCsvField).join(","));
  });

  return rows.join("\n");
}

export function createForecastCsvUrl(data: ForecastResponse): string {
  const blob = new Blob([forecastToCsv(data)], { type: "text/csv;charset=utf-8" });
  return URL.createObjectURL(blob);
}

export function revokeForecastExportUrl(url: string): void {
  URL.revokeObjectURL(url);
}
