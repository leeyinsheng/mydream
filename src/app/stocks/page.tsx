import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StockChartView } from "./StockChartView";
import { getQuote } from "@/lib/market-data";

export const dynamic = "force-dynamic";

export default async function StocksPage() {
  const quote = await getQuote("2330.TW");

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold">股市</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-3">
          <CardHeader><CardTitle className="text-base">台積電 (2330.TW)</CardTitle></CardHeader>
          <CardContent><StockChartView /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">個股資訊</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">最新價</span>
              <span className="font-bold">{quote?.price ? quote.price.toLocaleString() : "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">漲跌</span>
              <span className={quote && quote.change >= 0 ? "text-green-500" : "text-red-500"}>
                {quote ? `${quote.change >= 0 ? "+" : ""}${quote.change.toFixed(2)} (${quote.changePercent >= 0 ? "+" : ""}${quote.changePercent.toFixed(2)}%)` : "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">開盤</span>
              <span>{quote?.open ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">最高</span>
              <span>{quote?.high ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">最低</span>
              <span>{quote?.low ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">昨收</span>
              <span>{quote?.previousClose ?? "—"}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="h-20 bg-muted rounded-lg flex items-center justify-center text-sm text-muted-foreground">廣告版位</div>
    </div>
  );
}
