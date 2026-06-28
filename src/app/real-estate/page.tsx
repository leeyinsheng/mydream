"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AsiaMap } from "@/components/real-estate/AsiaMap";
import { CountryCard } from "@/components/real-estate/CountryCard";
import { ComparisonTable } from "@/components/real-estate/ComparisonTable";
import { getAllCountries, getCountriesByRegion } from "@/lib/real-estate";

const all = getAllCountries();
const REGIONS = ["全部", "東北亞", "東南亞", "大洋洲"];

export default function RealEstatePage() {
  const router = useRouter();
  const [region, setRegion] = useState("全部");
  const [view, setView] = useState("cards");

  const countries = region === "全部" ? all : getCountriesByRegion(region);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">房地產市場</h1>
      <p className="text-muted-foreground text-sm">亞洲 10 個國家/地區房地產數據比較與分析</p>

      <div className="flex gap-2 flex-wrap">
        {REGIONS.map((r) => {
          const count = r === "全部" ? all.length : getCountriesByRegion(r).length;
          return (
            <button key={r} onClick={() => setRegion(r)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${region === r ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}>
              {r} ({count})
            </button>
          );
        })}
      </div>

      <Tabs value={view} onValueChange={setView}>
        <TabsList>
          <TabsTrigger value="map">🗺️ 地圖</TabsTrigger>
          <TabsTrigger value="cards">📇 卡片</TabsTrigger>
          <TabsTrigger value="table">📋 比較表</TabsTrigger>
        </TabsList>
        <TabsContent value="map" className="mt-4">
          <AsiaMap countries={countries} onSelect={(id) => router.push(`/real-estate/${id}`)} />
        </TabsContent>
        <TabsContent value="cards" className="mt-4">
          <div className="grid grid-cols-2 gap-3">
            {countries.map((c) => (
              <CountryCard key={c.id} country={c} onClick={() => router.push(`/real-estate/${c.id}`)} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="table" className="mt-4">
          <ComparisonTable countries={countries} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
