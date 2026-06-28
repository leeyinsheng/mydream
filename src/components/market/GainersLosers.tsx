import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { Quote } from "@/lib/market-data";

interface Props { quotes: Quote[]; }

function pct(v: number) {
  return `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`;
}

export function GainersLosers({ quotes }: Props) {
  const sorted = [...quotes].sort((a, b) => b.changePercent - a.changePercent);
  const gainers = sorted.filter((q) => q.changePercent > 0).slice(0, 5);
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
                <span className="text-green-500">{pct(q.changePercent)}</span>
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
