"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, TrendingDown, Home, DollarSign, Percent, BarChart3, Landmark } from "lucide-react";
import { PriceIndexChart } from "@/components/real-estate/PriceIndexChart";
import { TransactionChart } from "@/components/real-estate/TransactionChart";
import { getCountryById } from "@/lib/real-estate";

export default function CountryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const country = getCountryById(params.id as string);

  useEffect(() => {
    document.title = country ? `${country.country} 房地產市場分析 | FinPulse` : "FinPulse";
  }, [country]);

  if (!country) {
    return (
      <div className="py-20 text-center">
        <p className="text-xl text-muted-foreground">找不到該國資料</p>
        <Button variant="link" onClick={() => router.push("/real-estate")}>返回總覽</Button>
      </div>
    );
  }

  const up = country.priceIndexYoY >= 0;

  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={() => router.push("/real-estate")}>
        <ArrowLeft className="h-4 w-4 mr-1" /> 返回總覽
      </Button>

      <div className="flex items-center gap-4">
        <span className="text-4xl">{country.flag}</span>
        <div>
          <h1 className="text-3xl font-bold">{country.country}</h1>
          <p className="text-muted-foreground">{country.countryEn} · {country.capitalCity}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Card><CardContent className="p-4 text-center"><Home className="h-5 w-5 mx-auto mb-1 text-muted-foreground" /><p className="text-xs text-muted-foreground">每平米均價</p><p className="text-xl font-bold mt-1">${country.capitalPricePerSqm.toLocaleString()}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><BarChart3 className="h-5 w-5 mx-auto mb-1 text-muted-foreground" /><p className="text-xs text-muted-foreground">房價指數</p><p className="text-xl font-bold mt-1">{country.priceIndex.toFixed(1)}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center">{up ? <TrendingUp className="h-5 w-5 mx-auto mb-1 text-green-500" /> : <TrendingDown className="h-5 w-5 mx-auto mb-1 text-red-500" />}<p className="text-xs text-muted-foreground">年增率</p><p className={`text-xl font-bold mt-1 ${up ? "text-green-500" : "text-red-500"}`}>{up ? "+" : ""}{country.priceIndexYoY.toFixed(1)}%</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><Percent className="h-5 w-5 mx-auto mb-1 text-muted-foreground" /><p className="text-xs text-muted-foreground">租金報酬率</p><p className="text-xl font-bold mt-1">{country.rentalYield.toFixed(1)}%</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><DollarSign className="h-5 w-5 mx-auto mb-1 text-muted-foreground" /><p className="text-xs text-muted-foreground">房價所得比</p><p className="text-xl font-bold mt-1">{country.priceToIncome.toFixed(1)}x</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><Landmark className="h-5 w-5 mx-auto mb-1 text-muted-foreground" /><p className="text-xs text-muted-foreground">房貸利率</p><p className="text-xl font-bold mt-1">{country.mortgageRateLow}~{country.mortgageRateHigh}%</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card><CardHeader><CardTitle className="text-base">房價指數走勢 (2018–2025)</CardTitle></CardHeader><CardContent><PriceIndexChart data={country.priceHistory} /></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">季度交易量</CardTitle></CardHeader><CardContent><TransactionChart data={country.transactionHistory} /></CardContent></Card>
      </div>
    </div>
  );
}
