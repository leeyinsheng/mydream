import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StockChart } from "@/components/chart/StockChart";
import { getQuote, getCandles } from "@/lib/market-data";

export const dynamic = "force-dynamic";

const RANGES = [
  { label: "當日", range: "1d" },
  { label: "本週", range: "5d" },
  { label: "本月", range: "1mo" },
  { label: "3月", range: "3mo" },
  { label: "1年", range: "1y" },
  { label: "10年", range: "10y" },
];

interface Props {
  params: Promise<{ symbol: string }>;
  searchParams: Promise<{ range?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { symbol } = await params;
  const decoded = decodeURIComponent(symbol);
  const quote = await getQuote(decoded);
  const name = quote?.name || decoded;
  return {
    title: `${name} 股價走勢 K線圖 | FinPulse`,
    description: `${name} 即時股價、K線圖、技術分析 — 最新價 ${quote?.price?.toLocaleString() || ""}，漲跌 ${quote?.changePercent ? (quote.changePercent >= 0 ? "+" : "") + quote.changePercent.toFixed(2) + "%" : ""}`,
    openGraph: { title: `${name} 股價走勢 | FinPulse`, description: `${name} 即時股價與技術分析` },
  };
}

export default async function StockDetailPage({ params, searchParams }: Props) {
  const { symbol } = await params;
  const { range: rangeParam } = await searchParams;
  const decoded = decodeURIComponent(symbol);
  const range = rangeParam || "6mo";

  const [quote, candles] = await Promise.all([
    getQuote(decoded),
    getCandles(decoded, range),
  ]);

  if (!quote && candles.length === 0) {
    notFound();
  }

  const name = quote?.name || decoded;
  const items = quote ? [
    { label: "最新價", value: quote.price.toLocaleString(), bold: true },
    { label: "漲跌", value: `${quote.change >= 0 ? "+" : ""}${quote.change.toFixed(2)} (${quote.changePercent >= 0 ? "+" : ""}${quote.changePercent.toFixed(2)}%)` },
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
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">走勢圖</CardTitle>
            <div className="flex gap-0.5">
              {RANGES.map((r) => (
                <Link
                  key={r.range}
                  href={`/stocks/${encodeURIComponent(decoded)}?range=${r.range}`}
                  className={`px-2 py-1 rounded text-xs transition-colors ${
                    range === r.range
                      ? "bg-primary text-primary-foreground font-medium"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {r.label}
                </Link>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {candles.length > 0 ? (
            <StockChart data={candles} height={350} showMA={range !== "1d" && range !== "5d"} />
          ) : (
            <div className="h-[350px] flex items-center justify-center text-muted-foreground text-sm">
              尚無走勢資料
            </div>
          )}
        </CardContent>
      </Card>

      {items.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">報價資訊</CardTitle>
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
