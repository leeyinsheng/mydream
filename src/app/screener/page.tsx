"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RotateCcw } from "lucide-react";

interface Stock {
  name: string; ticker: string; price: number; changePct: number;
  pe: number; yield_: number; mcap: number; industry: string; market: string;
}

const DATA: Stock[] = [
  { name: "台積電", ticker: "2330.TW", price: 784.00, changePct: 2.15, pe: 22.5, yield_: 1.8, mcap: 203000, industry: "半導體", market: "台股" },
  { name: "聯發科", ticker: "2454.TW", price: 1185.00, changePct: 3.04, pe: 18.2, yield_: 2.1, mcap: 18900, industry: "半導體", market: "台股" },
  { name: "鴻海", ticker: "2317.TW", price: 152.50, changePct: 0.66, pe: 12.8, yield_: 3.5, mcap: 21100, industry: "電子", market: "台股" },
  { name: "富邦金", ticker: "2881.TW", price: 72.80, changePct: 1.68, pe: 11.2, yield_: 4.2, mcap: 8900, industry: "金融", market: "台股" },
  { name: "國泰金", ticker: "2882.TW", price: 58.50, changePct: -0.51, pe: 10.5, yield_: 4.5, mcap: 7600, industry: "金融", market: "台股" },
  { name: "聯電", ticker: "2303.TW", price: 52.30, changePct: -0.85, pe: 14, yield_: 2.8, mcap: 6500, industry: "半導體", market: "台股" },
  { name: "長榮", ticker: "2603.TW", price: 178.50, changePct: 2.88, pe: 5.8, yield_: 6.2, mcap: 3800, industry: "航運", market: "台股" },
  { name: "陽明", ticker: "2609.TW", price: 52.80, changePct: 1.15, pe: 4.2, yield_: 7, mcap: 1700, industry: "航運", market: "台股" },
  { name: "台達電", ticker: "2308.TW", price: 338.00, changePct: -1.18, pe: 26, yield_: 1.5, mcap: 8800, industry: "電子", market: "台股" },
  { name: "藥華藥", ticker: "6446.TW", price: 358.00, changePct: 1.56, pe: 0, yield_: 0, mcap: 1200, industry: "生技", market: "台股" },
  { name: "中信金", ticker: "2891.TW", price: 34.20, changePct: 0.29, pe: 9.8, yield_: 5, mcap: 6200, industry: "金融", market: "台股" },
  { name: "中華電", ticker: "2412.TW", price: 125.00, changePct: -0.42, pe: 20.5, yield_: 3.2, mcap: 9700, industry: "傳產", market: "台股" },
  { name: "中鋼", ticker: "2002.TW", price: 24.50, changePct: -0.61, pe: 18, yield_: 2.5, mcap: 3800, industry: "傳產", market: "台股" },
  { name: "兆豐金", ticker: "2886.TW", price: 42.30, changePct: 0.38, pe: 13.5, yield_: 4.8, mcap: 5900, industry: "金融", market: "台股" },
  { name: "廣達", ticker: "2382.TW", price: 285.50, changePct: -1.21, pe: 15.4, yield_: 2.0, mcap: 11000, industry: "電子", market: "台股" },
];

type SortKey = "name" | "ticker" | "mcap" | "price" | "pe" | "yield_";

export default function ScreenerPage() {
  const [market, setMarket] = useState("all");
  const [capRange, setCapRange] = useState("");
  const [peRange, setPeRange] = useState("");
  const [yieldRange, setYieldRange] = useState("");
  const [industry, setIndustry] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("mcap");
  const [sortAsc, setSortAsc] = useState(false);

  const filtered = useMemo(() => {
    let items = [...DATA];
    if (market !== "all") items = items.filter((s) => s.market === market);
    if (industry) items = items.filter((s) => s.industry === industry);
    if (capRange) {
      const [lo, hi] = capRange.split("-").map(Number);
      if (!isNaN(lo)) items = items.filter((s) => s.mcap >= lo && (isNaN(hi) || s.mcap <= hi));
    }
    if (peRange) {
      const [lo, hi] = peRange.split("-").map(Number);
      if (!isNaN(lo)) items = items.filter((s) => s.pe > 0 && s.pe >= lo && (isNaN(hi) || s.pe <= hi));
    }
    if (yieldRange) {
      const [lo, hi] = yieldRange.split("-").map(Number);
      if (!isNaN(lo)) items = items.filter((s) => s.yield_ >= lo && (isNaN(hi) || s.yield_ <= hi));
    }
    items.sort((a, b) => {
      const va = a[sortKey], vb = b[sortKey];
      if (typeof va === "string") return sortAsc ? va.localeCompare(vb as string) : (vb as string).localeCompare(va);
      return sortAsc ? (va as number) - (vb as number) : (vb as number) - (va as number);
    });
    return items;
  }, [market, capRange, peRange, yieldRange, industry, sortKey, sortAsc]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  }

  function reset() {
    setMarket("all"); setCapRange(""); setPeRange(""); setYieldRange(""); setIndustry("");
  }

  const industries = [...new Set(DATA.map((d) => d.industry))];

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold">篩選器</h1>

      <Card>
        <CardHeader><CardTitle className="text-base">篩選條件</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground uppercase font-semibold">市場</label>
              <select value={market} onChange={(e) => setMarket(e.target.value)}
                className="h-9 rounded border bg-background px-3 text-sm">
                <option value="all">全部</option>
                <option value="台股">台股</option>
                <option value="美股">美股</option>
                <option value="陸股">陸股</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground uppercase font-semibold">市值 (億)</label>
              <select value={capRange} onChange={(e) => setCapRange(e.target.value)}
                className="h-9 rounded border bg-background px-3 text-sm">
                <option value="">全部</option>
                <option value="1000-">1,000+</option>
                <option value="500-1000">500–1,000</option>
                <option value="100-500">100–500</option>
                <option value="-100">&lt;100</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground uppercase font-semibold">本益比</label>
              <Input placeholder="e.g. 10-20" value={peRange} onChange={(e) => setPeRange(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground uppercase font-semibold">殖利率 (%)</label>
              <Input placeholder="e.g. 3-8" value={yieldRange} onChange={(e) => setYieldRange(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground uppercase font-semibold">產業</label>
              <select value={industry} onChange={(e) => setIndustry(e.target.value)}
                className="h-9 rounded border bg-background px-3 text-sm">
                <option value="">全部</option>
                {industries.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={reset}><RotateCcw className="h-3 w-3 mr-1" /> 重置</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">篩選結果 · {filtered.length} 筆</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b text-muted-foreground text-xs uppercase">
                <th className="py-2 pr-4 cursor-pointer hover:text-foreground" onClick={() => toggleSort("name")}>名稱 {sortKey === "name" ? (sortAsc ? "▲" : "▼") : ""}</th>
                <th className="py-2 pr-4 cursor-pointer hover:text-foreground" onClick={() => toggleSort("ticker")}>代碼</th>
                <th className="py-2 pr-4 text-right cursor-pointer hover:text-foreground" onClick={() => toggleSort("mcap")}>市值(億) {sortKey === "mcap" ? (sortAsc ? "▲" : "▼") : ""}</th>
                <th className="py-2 pr-4 text-right cursor-pointer hover:text-foreground" onClick={() => toggleSort("price")}>股價 {sortKey === "price" ? (sortAsc ? "▲" : "▼") : ""}</th>
                <th className="py-2 pr-4 text-right cursor-pointer hover:text-foreground" onClick={() => toggleSort("pe")}>本益比 {sortKey === "pe" ? (sortAsc ? "▲" : "▼") : ""}</th>
                <th className="py-2 text-right cursor-pointer hover:text-foreground" onClick={() => toggleSort("yield_")}>殖利率 {sortKey === "yield_" ? (sortAsc ? "▲" : "▼") : ""}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.ticker} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="py-2 pr-4 font-medium">{s.name}</td>
                  <td className="py-2 pr-4 font-mono text-xs">{s.ticker}</td>
                  <td className="py-2 pr-4 text-right font-mono">{s.mcap.toLocaleString()}</td>
                  <td className="py-2 pr-4 text-right font-mono">{s.price.toFixed(2)}</td>
                  <td className="py-2 pr-4 text-right font-mono">{s.pe > 0 ? s.pe.toFixed(1) : "--"}</td>
                  <td className="py-2 text-right font-mono">{s.yield_ > 0 ? s.yield_.toFixed(1) + "%" : "--"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-8">無符合條件的標的</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
