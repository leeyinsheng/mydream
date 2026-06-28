import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StockChart } from "@/components/chart/StockChart";
import { getQuote, getCandles } from "@/lib/market-data";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ symbol: string }>;
}

export default async function StockDetailPage({ params }: Props) {
  const { symbol } = await params;
  const decoded = decodeURIComponent(symbol);

  const [quote, candles] = await Promise.all([
    getQuote(decoded),
    getCandles(decoded, "6mo"),
  ]);

  if (!quote && candles.length === 0) {
    notFound();
  }

  const name = quote?.name || decoded;
  const items = quote ? [
    { label: "最新價", value: quote.price.toLocaleString(), bold: true },
    { label: "漲跌", value: `${quote.change >= 0 ? "+" : ""}${quote.change.toFixed(2)} (${quote.changePercent >= 0 ? "+" : ""}${quote.changePercent.toFixed(2)}%)`, color: quote.change >= 0 ? "text-green-500" : "text-red-500" },
    { label: "開盤", value: quote.open.toLocaleString() },
    { label: "最高", value: quote.high.toLocaleString() },
    { label: "最低", value: quote.low.toLocaleString() },
    { label: "昨收", value: quote.previousClose.toLocaleString() },
  ] : [];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">{name}</h1>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">K線圖</CardTitle>
        </CardHeader>
        <CardContent>
          {candles.length > 0 ? (
            <StockChart data={candles} height={350} showMA={true} />
          ) : (
            <div className="h-[350px] flex items-center justify-center text-muted-foreground text-sm">
              尚無 K 線資料
            </div>
          )}
        </CardContent>
      </Card>

      {items.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">指數資訊</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {items.map((item) => (
                <div key={item.label} className="flex justify-between">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className={item.bold ? "font-bold" : ""}>{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="h-16 bg-muted rounded-lg flex items-center justify-center text-xs text-muted-foreground">
        廣告版位
      </div>
    </div>
  );
}
