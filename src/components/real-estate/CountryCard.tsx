import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { CountryRealEstate } from "@/lib/real-estate";

interface Props { country: CountryRealEstate; onClick: () => void; }

export function CountryCard({ country, onClick }: Props) {
  const up = country.priceIndexYoY >= 0;
  return (
    <Card className="cursor-pointer hover:shadow-sm transition-shadow" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">{country.flag}</span>
          <div>
            <p className="font-semibold text-sm">{country.country}</p>
            <p className="text-xs text-muted-foreground">{country.capitalCity}</p>
          </div>
        </div>
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">每平米均價</span><span className="font-mono">${country.capitalPricePerSqm.toLocaleString()}</span></div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">年增率</span>
            <span className={`flex items-center gap-0.5 font-mono ${up ? "text-green-500" : "text-red-500"}`}>
              {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {up ? "+" : ""}{country.priceIndexYoY.toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between"><span className="text-muted-foreground">租金報酬率</span><span className="font-mono">{country.rentalYield.toFixed(1)}%</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">房貸利率</span><span className="font-mono">{country.mortgageRateLow}–{country.mortgageRateHigh}%</span></div>
        </div>
      </CardContent>
    </Card>
  );
}
