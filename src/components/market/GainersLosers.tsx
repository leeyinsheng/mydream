import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { Quote } from "@/lib/market-data";

interface Props { quotes: Quote[]; }

function pct(v: number) {
  return `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`;
}

const MOCK: Quote[] = [
  { symbol: "2330.TW", price: 2340, change: 70, changePercent: 3.08, high: 2370, low: 2325, open: 2270, previousClose: 2270 },
  { symbol: "2454.TW", price: 1185, change: 35, changePercent: 3.04, high: 1195, low: 1165, open: 1150, previousClose: 1150 },
  { symbol: "2317.TW", price: 152.5, change: 1, changePercent: 0.66, high: 154, low: 151, open: 151.5, previousClose: 151.5 },
  { symbol: "2881.TW", price: 72.8, change: 1.2, changePercent: 1.68, high: 73.5, low: 72, open: 71.6, previousClose: 71.6 },
  { symbol: "2382.TW", price: 285.5, change: -3.5, changePercent: -1.21, high: 290, low: 283, open: 289, previousClose: 289 },
  { symbol: "2308.TW", price: 338, change: -4, changePercent: -1.18, high: 344, low: 336, open: 342, previousClose: 342 },
  { symbol: "2303.TW", price: 52.3, change: -0.45, changePercent: -0.85, high: 53, low: 52, open: 52.75, previousClose: 52.75 },
  { symbol: "2002.TW", price: 24.5, change: -0.15, changePercent: -0.61, high: 24.8, low: 24.3, open: 24.65, previousClose: 24.65 },
  { symbol: "2882.TW", price: 58.5, change: -0.3, changePercent: -0.51, high: 59, low: 58, open: 58.8, previousClose: 58.8 },
  { symbol: "2412.TW", price: 125, change: -0.5, changePercent: -0.42, high: 126, low: 124.5, open: 125.5, previousClose: 125.5 },
];

export function GainersLosers({ quotes }: Props) {
  const data = (quotes.length > 0 ? quotes : MOCK).filter(
    (q) => typeof q.changePercent === "number" && !Number.isNaN(q.changePercent)
  );
  const sorted = [...data].sort((a, b) => b.changePercent - a.changePercent);

  const hasPositive = sorted.some((q) => q.changePercent > 0);
  const gainers = hasPositive
    ? sorted.filter((q) => q.changePercent > 0).slice(0, 5)
    : sorted.slice(0, 5);
  const losers = sorted.filter((q) => q.changePercent < 0).slice(-5).reverse();

  return (
    <div className="grid grid-cols-1 gap-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-green-500 flex items-center gap-1"><TrendingUp className="h-4 w-4" /> 漲幅排行</CardTitle>
        </CardHeader>
        <CardContent>
          {gainers.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">暫無資料</p>
          ) : (
            gainers.map((q) => (
              <div key={q.symbol} className="flex justify-between py-1.5 text-sm">
                <span>{q.symbol.replace(".TW", "")}</span>
                <span className={q.changePercent >= 0 ? "text-green-500" : "text-red-500"}>{pct(q.changePercent)}</span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-red-500 flex items-center gap-1"><TrendingDown className="h-4 w-4" /> 跌幅排行</CardTitle>
        </CardHeader>
        <CardContent>
          {losers.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">暫無資料</p>
          ) : (
            losers.map((q) => (
              <div key={q.symbol} className="flex justify-between py-1.5 text-sm">
                <span>{q.symbol.replace(".TW", "")}</span>
                <span className="text-red-500">{pct(q.changePercent)}</span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
