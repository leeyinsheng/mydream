import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp } from "lucide-react";
import { getForexRates } from "@/lib/market-data";

export const dynamic = "force-dynamic";

const RATES = [
  { country: "美國 (Fed)", rate: "5.50%" },
  { country: "歐元區 (ECB)", rate: "4.50%" },
  { country: "日本 (BOJ)", rate: "0.25%" },
  { country: "台灣 (CBC)", rate: "2.00%" },
  { country: "中國 (PBOC)", rate: "3.45%" },
];

export default async function ForexPage() {
  const forex = await getForexRates();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">外匯</h1>
      <p className="text-xs text-muted-foreground -mt-2">即時匯率 · 資料來源：ExchangeRate-API · 點擊看走勢</p>
      <div className="grid grid-cols-2 gap-3">
        {forex.map((item) => (
          <Link key={item.pair} href={`/stocks/${encodeURIComponent(item.yahoosym)}?range=1mo`}>
            <Card className="active:bg-muted transition-colors">
              <CardHeader className="pb-2"><CardTitle className="text-sm">{item.pair}</CardTitle></CardHeader>
              <CardContent>
                <p className="text-xl font-bold">{item.rate.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                  <ArrowUp className="h-4 w-4" />
                  <span>即時</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <h2 className="text-lg font-semibold mt-6 mb-3">各國基準利率</h2>
      <div className="grid grid-cols-3 gap-2">
        {RATES.map((r) => (
          <Card key={r.country}>
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">{r.country}</p>
              <p className="text-lg font-bold">{r.rate}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="h-24 bg-muted rounded-lg flex items-center justify-center text-sm text-muted-foreground">廣告版位</div>
    </div>
  );
}
