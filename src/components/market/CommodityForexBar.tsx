import { Card, CardContent } from "@/components/ui/card";

const MOCK_DATA = [
  { name: "黃金", price: "2,350", change: "+0.5%", positive: true },
  { name: "原油", price: "78.50", change: "-1.2%", positive: false },
  { name: "USD/TWD", price: "32.15", change: "+0.1%", positive: true },
  { name: "EUR/USD", price: "1.085", change: "-0.3%", positive: false },
];

export function CommodityForexBar() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {MOCK_DATA.map((item) => (
        <Card key={item.name}>
          <CardContent className="p-3 text-center">
            <p className="text-xs text-muted-foreground">{item.name}</p>
            <p className="text-lg font-bold">{item.price}</p>
            <p className={`text-xs ${item.positive ? "text-green-500" : "text-red-500"}`}>{item.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
