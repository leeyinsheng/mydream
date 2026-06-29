import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StockChart } from "@/components/chart/StockChart";
import { getQuote, getCandles, getCommodityName } from "@/lib/market-data";

export const dynamic = "force-dynamic";

const RANGES = [
  { label: "當日", range: "1d" },
  { label: "本週", range: "5d" },
  { label: "本月", range: "1mo" },
  { label: "3月", range: "3mo" },
  { label: "6月", range: "6mo" },
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
  const name = getCommodityName(decoded) || decoded;
  return {
    title: `${name} 即時報價 K線圖 | FinPulse`,
    description: `${name} 即時價格走勢、K線圖、技術分析 — 期貨即時報價與歷史走勢`,
    openGraph: { title: `${name} 即時報價 | FinPulse` },
  };
}

export default async function CommodityDetailPage({ params, searchParams }: Props) {
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

  const name = getCommodityName(decoded) || decoded;
  const items = quote ? [
    { label: "最新價", value: quote.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), bold: true },
    { label: "漲跌", value: `${quote.change >= 0 ? "+" : ""}${quote.change.toFixed(2)} (${quote.changePercent >= 0 ? "+" : ""}${quote.changePercent.toFixed(2)}%)` },
    { label: "開盤", value: quote.open.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) },
    { label: "最高", value: quote.high.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) },
    { label: "最低", value: quote.low.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) },
    { label: "昨收", value: quote.previousClose.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) },
  ] : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Link href="/commodities" className="text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold flex-1">{name}</h1>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">走勢圖</CardTitle>
            <div className="flex gap-0.5">
              <span className="text-[10px] text-muted-foreground mr-1 self-center">台北時間</span>
              {RANGES.map((r) => (
                <Link
                  key={r.range}
                  href={`/commodities/${encodeURIComponent(decoded)}?range=${r.range}`}
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
