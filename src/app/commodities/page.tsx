import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

export const metadata: Metadata = {
  title: "原物料即時報價 | FinPulse",
  description: "黃金、白銀、原油、天然氣、農產品等原物料即時價格走勢與漲跌。",
  openGraph: { title: "原物料即時報價 | FinPulse", description: "黃金、白銀、原油等原物料即時價格" },
};

const ITEMS = [
  { name: "黃金 (XAU/USD)", price: "2,350.50", change: "+0.5%", positive: true },
  { name: "白銀 (XAG/USD)", price: "28.32", change: "+0.8%", positive: true },
  { name: "原油 (WTI)", price: "78.50", change: "-1.2%", positive: false },
  { name: "天然氣", price: "2.15", change: "-0.4%", positive: false },
  { name: "玉米", price: "458.00", change: "+0.3%", positive: true },
  { name: "小麥", price: "542.00", change: "-0.6%", positive: false },
  { name: "黃豆", price: "1,185.00", change: "+1.1%", positive: true },
  { name: "銅", price: "4.52", change: "+0.2%", positive: true },
];

export default function CommoditiesPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">原物料</h1>
      <div className="grid grid-cols-2 gap-3">
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
      <div className="h-24 bg-muted rounded-lg flex items-center justify-center text-sm text-muted-foreground">廣告版位</div>
    </div>
  );
}
