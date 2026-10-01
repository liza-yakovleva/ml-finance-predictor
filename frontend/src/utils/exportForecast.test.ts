import { describe, expect, it } from "vitest";
import type { ForecastResponse } from "../types";
import { forecastToCsv, forecastToJson } from "./exportForecast";

const sampleForecast: ForecastResponse = {
  symbol: "TEST,ASSET",
  interval: "1d",
  last_prices: [100],
  predicted: [101.5],
  predicted_times: ["2026-10-01T00:00:00Z"],
};

describe("forecast export", () => {
  it("creates CSV with actual and predicted rows", () => {
    const csv = forecastToCsv(sampleForecast);
    const rows = csv.split("\n");

    expect(rows[0]).toBe("symbol,interval,type,index,timestamp,value");
    expect(rows).toHaveLength(3);
    expect(rows[1]).toContain('"TEST,ASSET",1d,actual,1,,100');
    expect(rows[2]).toContain('"TEST,ASSET",1d,predicted,1,2026-10-01T00:00:00Z,101.5');
  });

  it("creates valid JSON with the forecast structure", () => {
    const parsed = JSON.parse(forecastToJson(sampleForecast)) as ForecastResponse;

    expect(parsed).toEqual(sampleForecast);
    expect(parsed.predicted).toHaveLength(1);
    expect(parsed.predicted_times?.[0]).toBe("2026-10-01T00:00:00Z");
  });
});
