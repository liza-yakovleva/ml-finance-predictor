export interface ForecastResponse {
  symbol: string;
  interval: string;
  last_prices: number[];
  predicted: number[];
  predicted_times?: string[];
}
