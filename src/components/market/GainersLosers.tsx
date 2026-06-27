import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { Quote } from "@/lib/market-data";

interface Props { quotes: Quote[]; }

export function GainersLosers({ quotes }: Props) {
  const sorted = [...quotes].sort((a, b) => b.changePercent - a.changePercent);
  const gainers = sorted.slice(0, 5);
  const losers = sorted.slice(-5).reverse();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-green-500 flex items-center gap-1"><TrendingUp className="h-4 w-4" /> 漲幅排行</CardTitle>
        </CardHeader>
        <CardContent>{gainers.map((q) => (
          <div key={q.symbol} className="flex justify-between py-1.5 text-sm">
            <span>{q.symbol.replace(".TW", "")}</span>
            <span className="text-green-500">+{q.changePercent.toFixed(2)}%</span>
          </div>
        ))}</CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-red-500 flex items-center gap-1"><TrendingDown className="h-4 w-4" /> 跌幅排行</CardTitle>
        </CardHeader>
        <CardContent>{losers.map((q) => (
          <div key={q.symbol} className="flex justify-between py-1.5 text-sm">
            <span>{q.symbol.replace(".TW", "")}</span>
            <span className="text-red-500">{q.changePercent.toFixed(2)}%</span>
          </div>
        ))}</CardContent>
      </Card>
    </div>
  );
}
