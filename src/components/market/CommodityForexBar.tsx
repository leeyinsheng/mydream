import { Card, CardContent } from "@/components/ui/card";
import { getForexRates } from "@/lib/market-data";

export async function CommodityForexBar() {
  const forex = await getForexRates();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {forex.slice(0, 4).map((item) => (
        <Card key={item.pair}>
          <CardContent className="p-3 text-center">
            <p className="text-xs text-muted-foreground">{item.pair}</p>
            <p className="text-lg font-bold">{item.rate.toLocaleString()}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
