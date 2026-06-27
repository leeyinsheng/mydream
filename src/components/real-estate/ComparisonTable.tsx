"use client";
import { useMemo, useState } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import type { CountryRealEstate } from "@/lib/real-estate";

type Key = keyof CountryRealEstate;

export function ComparisonTable({ countries }: { countries: CountryRealEstate[] }) {
  const [key, setKey] = useState<Key>("capitalPricePerSqm");
  const [asc, setAsc] = useState(false);

  const sorted = useMemo(() => {
    return [...countries].sort((a, b) => {
      const va = a[key], vb = b[key];
      if (typeof va === "string") return asc ? va.localeCompare(vb as string) : (vb as string).localeCompare(va);
      return asc ? (va as number) - (vb as number) : (vb as number) - (va as number);
    });
  }, [countries, key, asc]);

  function toggle(k: Key) { if (key === k) setAsc(!asc); else { setKey(k); setAsc(false); } }

  function Icon({ col }: { col: Key }) {
    if (key !== col) return <ArrowUpDown className="h-3 w-3 ml-1 inline" />;
    return asc ? <ArrowUp className="h-3 w-3 ml-1 inline" /> : <ArrowDown className="h-3 w-3 ml-1 inline" />;
  }

  const numCols: { label: string; k: Key }[] = [
    { label: "每平米均價", k: "capitalPricePerSqm" },
    { label: "房價指數", k: "priceIndex" },
    { label: "年增率", k: "priceIndexYoY" },
    { label: "租金報酬率", k: "rentalYield" },
    { label: "房價所得比", k: "priceToIncome" },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b text-muted-foreground text-xs uppercase">
            <th className="py-2 pr-4 cursor-pointer hover:text-foreground" onClick={() => toggle("country")}>國家<Icon col="country" /></th>
            {numCols.map((c) => (
              <th key={c.k} className="py-2 pr-4 text-right cursor-pointer hover:text-foreground" onClick={() => toggle(c.k)}>{c.label}<Icon col={c.k} /></th>
            ))}
            <th className="py-2 text-right">房貸利率</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((c) => (
            <tr key={c.id} className="border-b hover:bg-muted/50">
              <td className="py-2 pr-4 font-medium">{c.flag} {c.country}</td>
              <td className="py-2 pr-4 text-right font-mono">${c.capitalPricePerSqm.toLocaleString()}</td>
              <td className="py-2 pr-4 text-right font-mono">{c.priceIndex.toFixed(1)}</td>
              <td className={`py-2 pr-4 text-right font-mono ${c.priceIndexYoY >= 0 ? "text-green-500" : "text-red-500"}`}>{c.priceIndexYoY >= 0 ? "+" : ""}{c.priceIndexYoY.toFixed(1)}%</td>
              <td className="py-2 pr-4 text-right font-mono">{c.rentalYield.toFixed(1)}%</td>
              <td className="py-2 pr-4 text-right font-mono">{c.priceToIncome.toFixed(1)}</td>
              <td className="py-2 text-right font-mono">{c.mortgageRateLow}–{c.mortgageRateHigh}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
