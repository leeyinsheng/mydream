"use client";
import { useEffect, useRef } from "react";
import { createChart, CandlestickSeriesPartialOptions, LineSeriesPartialOptions, ColorType } from "lightweight-charts";

interface CandleData { time: string; open: number; high: number; low: number; close: number; }
interface Props {
  data: CandleData[];
  height?: number;
  showMA?: boolean;
}

function calcMA(data: CandleData[], period: number) {
  const result: { time: string; value: number }[] = [];
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) sum += data[i - j].close;
    result.push({ time: data[i].time, value: sum / period });
  }
  return result;
}

export function StockChart({ data, height = 400, showMA = true }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const chart = createChart(containerRef.current, {
      height,
      layout: { background: { type: ColorType.Solid, color: "transparent" }, textColor: "#9CA3AF" },
      grid: { vertLines: { color: "rgba(156,163,175,0.1)" }, horzLines: { color: "rgba(156,163,175,0.1)" } },
      crosshair: { mode: 0 },
      timeScale: { timeVisible: true, secondsVisible: false },
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: "#22C55E", downColor: "#EF4444",
      borderDownColor: "#EF4444", borderUpColor: "#22C55E",
      wickDownColor: "#EF4444", wickUpColor: "#22C55E",
    } as CandlestickSeriesPartialOptions);
    candleSeries.setData(data);

    if (showMA) {
      const ma5 = calcMA(data, 5);
      const ma20 = calcMA(data, 20);
      const ma60 = calcMA(data, 60);
      if (ma5.length > 0) {
        const ma5Line = chart.addLineSeries({ color: "#f59e0b", lineWidth: 1 } as LineSeriesPartialOptions);
        ma5Line.setData(ma5);
      }
      if (ma20.length > 0) {
        const ma20Line = chart.addLineSeries({ color: "#8b5cf6", lineWidth: 1 } as LineSeriesPartialOptions);
        ma20Line.setData(ma20);
      }
      if (ma60.length > 0) {
        const ma60Line = chart.addLineSeries({ color: "#3b82f6", lineWidth: 1 } as LineSeriesPartialOptions);
        ma60Line.setData(ma60);
      }
    }

    chart.timeScale().fitContent();

    return () => chart.remove();
  }, [data, height, showMA]);

  return (
    <div>
      <div ref={containerRef} className="w-full" />
      {showMA && (
        <div className="flex gap-4 justify-end mt-1 text-xs text-muted-foreground px-2">
          <span><span className="inline-block w-3 h-px bg-amber-500 align-middle mr-1" /> MA5</span>
          <span><span className="inline-block w-3 h-px bg-purple-500 align-middle mr-1" /> MA20</span>
          <span><span className="inline-block w-3 h-px bg-blue-500 align-middle mr-1" /> MA60</span>
        </div>
      )}
    </div>
  );
}
