"use client";
import { useEffect, useRef } from "react";
import { createChart, IChartApi, CandlestickSeriesPartialOptions, ColorType } from "lightweight-charts";

interface CandleData { time: string; open: number; high: number; low: number; close: number; }
interface Props { data: CandleData[]; height?: number; }

export function StockChart({ data, height = 400 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const chart = createChart(containerRef.current, {
      height,
      layout: { background: { type: ColorType.Solid, color: "transparent" }, textColor: "#9CA3AF" },
      grid: { vertLines: { color: "rgba(156, 163, 175, 0.1)" }, horzLines: { color: "rgba(156, 163, 175, 0.1)" } },
      crosshair: { mode: 0 },
      timeScale: { timeVisible: true, secondsVisible: false },
    });
    const series = chart.addCandlestickSeries({
      upColor: "#22C55E", downColor: "#EF4444",
      borderDownColor: "#EF4444", borderUpColor: "#22C55E",
      wickDownColor: "#EF4444", wickUpColor: "#22C55E",
    } as CandlestickSeriesPartialOptions);
    series.setData(data);
    chart.timeScale().fitContent();
    chartRef.current = chart;
    const handleResize = () => { if (containerRef.current) chart.applyOptions({ width: containerRef.current.clientWidth }); };
    window.addEventListener("resize", handleResize);
    return () => { window.removeEventListener("resize", handleResize); chart.remove(); };
  }, [data, height]);

  return <div ref={containerRef} className="w-full" />;
}
