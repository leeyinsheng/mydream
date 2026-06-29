import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { getCommodityPrices } from "@/lib/market-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "原物料即時報價 | FinPulse",
  description: "黃金、白銀、原油、天然氣、農產品等原物料即時價格走勢與漲跌。",
  openGraph: { title: "原物料即時報價 | FinPulse", description: "黃金、白銀、原油等原物料即時價格" },
};

export default async function CommoditiesPage() {
  const items = await getCommodityPrices();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">原物料</h1>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <Link key={item.symbol} href={`/commodities/${encodeURIComponent(item.symbol)}?range=6mo`}>
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
              <CardHeader className="pb-2"><CardTitle className="text-sm">{item.name}</CardTitle></CardHeader>
              <CardContent>
                <p className="text-xl font-bold">{item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <div className={`flex items-center gap-1 mt-1 text-sm ${item.changePercent >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {item.changePercent >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  {item.changePercent >= 0 ? "+" : ""}{item.changePercent.toFixed(2)}%
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <div className="h-24 bg-muted rounded-lg flex items-center justify-center text-sm text-muted-foreground">廣告版位</div>
    </div>
  );
}
