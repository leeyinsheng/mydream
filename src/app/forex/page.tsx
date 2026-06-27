import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

const ITEMS = [
  { name: "USD/TWD", price: "32.15", change: "+0.1%", positive: true },
  { name: "EUR/USD", price: "1.0852", change: "-0.3%", positive: false },
  { name: "GBP/USD", price: "1.2680", change: "+0.2%", positive: true },
  { name: "USD/JPY", price: "151.25", change: "+0.4%", positive: true },
  { name: "AUD/USD", price: "0.6570", change: "-0.1%", positive: false },
  { name: "USD/CAD", price: "1.3620", change: "+0.15%", positive: true },
  { name: "USD/CNH", price: "7.2460", change: "-0.05%", positive: false },
  { name: "EUR/JPY", price: "164.10", change: "+0.1%", positive: true },
];

const RATES = [
  { country: "美國 (Fed)", rate: "5.50%" },
  { country: "歐元區 (ECB)", rate: "4.50%" },
  { country: "日本 (BOJ)", rate: "0.25%" },
  { country: "台灣 (CBC)", rate: "2.00%" },
  { country: "中國 (PBOC)", rate: "3.45%" },
];

export default function ForexPage() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold">外匯</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {ITEMS.map((item) => (
          <Card key={item.name}>
            <CardHeader className="pb-2"><CardTitle className="text-sm">{item.name}</CardTitle></CardHeader>
            <CardContent>
              <p className="text-xl font-bold">{item.price}</p>
              <div className={`flex items-center gap-1 mt-1 text-sm ${item.positive ? "text-green-500" : "text-red-500"}`}>
                {item.positive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {item.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <h2 className="text-lg font-semibold mt-6 mb-3">各國基準利率</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
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
