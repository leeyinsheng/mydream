"use client";
import { StockChart } from "@/components/chart/StockChart";

const MOCK_CANDLES = Array.from({ length: 60 }, (_, i) => {
  const base = 900 + Math.sin(i * 0.3) * 80 + Math.random() * 20;
  const open = base + (Math.random() - 0.5) * 10;
  const close = base + (Math.random() - 0.5) * 10;
  const high = Math.max(open, close) + Math.random() * 15;
  const low = Math.min(open, close) - Math.random() * 15;
  const date = new Date(2026, 2, 15 + i);
  return {
    time: date.toISOString().split("T")[0],
    open: Math.round(open * 100) / 100,
    high: Math.round(high * 100) / 100,
    low: Math.round(low * 100) / 100,
    close: Math.round(close * 100) / 100,
  };
});

export function StockChartView() {
  return <StockChart data={MOCK_CANDLES} height={450} />;
}
