import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface IndexCardProps {
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export function IndexCard({ name, price, change, changePercent }: IndexCardProps) {
  const isPositive = change >= 0;
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground">{name}</p>
        <p className="text-2xl font-bold mt-1">{price.toLocaleString("zh-TW", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</p>
        <div className={`flex items-center gap-1 mt-1 ${isPositive ? "text-green-500" : "text-red-500"}`}>
          {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          <span className="text-sm font-medium">{isPositive ? "+" : ""}{change.toFixed(2)} ({isPositive ? "+" : ""}{changePercent.toFixed(2)}%)</span>
        </div>
      </CardContent>
    </Card>
  );
}
