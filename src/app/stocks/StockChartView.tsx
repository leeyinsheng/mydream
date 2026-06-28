"use client";
import { StockChart } from "@/components/chart/StockChart";
import type { CandleData } from "@/lib/market-data";

interface Props {
  candles: CandleData[];
}

export function StockChartView({ candles }: Props) {
  if (candles.length === 0) {
    return (
      <div className="h-[450px] flex items-center justify-center text-muted-foreground">
        尚無 K 線資料
      </div>
    );
  }
  return <StockChart data={candles} height={450} showMA={true} />;
}
