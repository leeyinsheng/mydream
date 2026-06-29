import { Card, CardContent } from "@/components/ui/card";
import { getForexRates, getCommodityPrices } from "@/lib/market-data";

export async function CommodityForexBar() {
  const [forex, commodities] = await Promise.all([
    getForexRates(),
    getCommodityPrices(),
  ]);

  return (
    <div className="grid grid-cols-2 gap-2">
      {commodities.slice(0, 2).map((item) => (
        <Card key={item.symbol}>
          <CardContent className="p-3 text-center">
            <p className="text-xs text-muted-foreground">{item.name}</p>
            <p className="text-lg font-bold">{item.price.toLocaleString(undefined, { maximumFractionDigits: item.price >= 100 ? 2 : 4 })}</p>
          </CardContent>
        </Card>
      ))}
      {forex.slice(0, 2).map((item) => (
        <Card key={item.pair}>
          <CardContent className="p-3 text-center">
            <p className="text-xs text-muted-foreground">{item.pair}</p>
            <p className="text-lg font-bold">{item.rate.toLocaleString(undefined, { maximumFractionDigits: item.rate >= 100 ? 2 : 4 })}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
