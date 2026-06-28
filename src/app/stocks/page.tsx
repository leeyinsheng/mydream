import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StockChartView } from "./StockChartView";
import { getQuote, getCandles } from "@/lib/market-data";

export const dynamic = "force-dynamic";

export default async function StocksPage() {
  const [quote, candles] = await Promise.all([
    getQuote("2330.TW"),
    getCandles("2330.TW", "3mo"),
  ]);

  const items = quote ? [
    { label: "名稱", value: quote.name || quote.symbol },
    { label: "最新價", value: quote.price.toLocaleString(), bold: true },
    { label: "漲跌", value: `${quote.change >= 0 ? "+" : ""}${quote.change.toFixed(2)} (${quote.changePercent >= 0 ? "+" : ""}${quote.changePercent.toFixed(2)}%)`, color: quote.change >= 0 ? "text-green-500" : "text-red-500" },
    { label: "開盤", value: quote.open.toLocaleString() },
    { label: "最高", value: quote.high.toLocaleString() },
    { label: "最低", value: quote.low.toLocaleString() },
    { label: "昨收", value: quote.previousClose.toLocaleString() },
  ] : [];

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold">股市</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">
              {quote?.name || quote?.symbol || "個股"} ({quote?.symbol || ""})
            </CardTitle>
          </CardHeader>
          <CardContent><StockChartView candles={candles} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">個股資訊</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {items.map((item) => (
              <div key={item.label} className="flex justify-between">
                <span className="text-muted-foreground">{item.label}</span>
                <span className={item.bold ? "font-bold" : ""}>
                  {item.value}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <div className="h-20 bg-muted rounded-lg flex items-center justify-center text-sm text-muted-foreground">廣告版位</div>
    </div>
  );
}
