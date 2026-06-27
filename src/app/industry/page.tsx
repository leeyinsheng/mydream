"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

const INDUSTRIES: Record<string, {
  desc: string;
  stocks: { name: string; ticker: string; mcap: number; price: number; pe: number; yoy: number }[];
  etfs: string[];
}> = {
  "半導體": {
    desc: "台灣半導體產業涵蓋晶圓代工、IC設計、封裝測試，全球市佔率超過60%，為台灣最具國際競爭力的產業。龍頭台積電在先進製程上獨佔鰲頭。",
    stocks: [
      { name: "台積電", ticker: "2330.TW", mcap: 203000, price: 784, pe: 22.5, yoy: 68 },
      { name: "聯發科", ticker: "2454.TW", mcap: 18900, price: 1185, pe: 18.2, yoy: 42 },
      { name: "聯電", ticker: "2303.TW", mcap: 6500, price: 52.30, pe: 14, yoy: 8 },
      { name: "日月光", ticker: "3711.TW", mcap: 5200, price: 158, pe: 16.5, yoy: 22 },
    ],
    etfs: ["0050.TW 元大台灣50", "00881.TW 國泰台灣5G+", "00923.TW 群益半導體收益"],
  },
  "金融": {
    desc: "台灣金融產業包括銀行、保險、證券三大子行業，受惠於升息環境與資本市場活絡，獲利普遍成長。",
    stocks: [
      { name: "富邦金", ticker: "2881.TW", mcap: 8900, price: 72.80, pe: 11.2, yoy: 35 },
      { name: "國泰金", ticker: "2882.TW", mcap: 7600, price: 58.50, pe: 10.5, yoy: 28 },
      { name: "中信金", ticker: "2891.TW", mcap: 6200, price: 34.20, pe: 9.8, yoy: 18 },
      { name: "兆豐金", ticker: "2886.TW", mcap: 5900, price: 42.30, pe: 13.5, yoy: 12 },
    ],
    etfs: ["0055.TW 元大金融", "00915.TW 凱基金融"],
  },
  "生技": {
    desc: "台灣生技產業在新藥開發、細胞治療、醫材領域持續突破，多家公司進入臨床後期階段，2025年為產業爆發元年。",
    stocks: [
      { name: "藥華藥", ticker: "6446.TW", mcap: 1200, price: 358, pe: 0, yoy: 85 },
      { name: "合一", ticker: "4743.TW", mcap: 850, price: 168.50, pe: 0, yoy: -8 },
      { name: "中裕", ticker: "4147.TW", mcap: 450, price: 85.20, pe: 0, yoy: 32 },
      { name: "泰博", ticker: "4736.TW", mcap: 380, price: 142, pe: 18.5, yoy: 5 },
    ],
    etfs: ["00892.TW 富邦台灣生技"],
  },
  "航運": {
    desc: "2024年貨櫃航運市場受惠於紅海危機繞航效應，運價維持高檔，長榮、陽明等貨櫃三雄獲利亮眼。",
    stocks: [
      { name: "長榮", ticker: "2603.TW", mcap: 3800, price: 178.50, pe: 5.8, yoy: 55 },
      { name: "陽明", ticker: "2609.TW", mcap: 1700, price: 52.80, pe: 4.2, yoy: 38 },
      { name: "萬海", ticker: "2615.TW", mcap: 1200, price: 62.40, pe: 6.5, yoy: 15 },
      { name: "裕民", ticker: "2606.TW", mcap: 850, price: 58.20, pe: 8.2, yoy: 10 },
    ],
    etfs: ["00915.TW 凱基航運", "0056.TW 元大高股息（含航運）"],
  },
  "電信": {
    desc: "台灣電信三雄在5G布建完成後資本支出降低，自由現金流改善，股利政策穩定，成為防禦型資金首選。",
    stocks: [
      { name: "中華電", ticker: "2412.TW", mcap: 9700, price: 125, pe: 20.5, yoy: 5 },
      { name: "台灣大", ticker: "3045.TW", mcap: 4200, price: 112, pe: 18.8, yoy: 8 },
      { name: "遠傳", ticker: "4904.TW", mcap: 3800, price: 85.50, pe: 19.2, yoy: 6 },
    ],
    etfs: ["00731.TW 復華台灣科技優息", "00919.TW 群益台灣精選高息"],
  },
  "鋼鐵": {
    desc: "全球鋼市供需逐步改善，碳中和政策帶動綠鋼需求，中鋼等大廠朝高值化轉型。",
    stocks: [
      { name: "中鋼", ticker: "2002.TW", mcap: 3800, price: 24.50, pe: 18, yoy: -5 },
      { name: "中鴻", ticker: "2014.TW", mcap: 500, price: 22.80, pe: 15, yoy: 12 },
      { name: "燁輝", ticker: "2023.TW", mcap: 350, price: 17.60, pe: 14.5, yoy: 8 },
    ],
    etfs: ["0050.TW", "00876.TW 富邦鋼鐵"],
  },
};

const KEYS = Object.keys(INDUSTRIES);

export default function IndustryPage() {
  const [active, setActive] = useState(KEYS[0]);
  const ind = INDUSTRIES[active];

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold">產業分析</h1>
      <div className="flex gap-2 flex-wrap">
        {KEYS.map((k) => (
          <button
            key={k}
            onClick={() => setActive(k)}
            className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
              k === active
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="p-4 text-sm text-muted-foreground leading-relaxed">
          {ind.desc}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">龍頭股比較</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b text-muted-foreground text-xs uppercase">
                <th className="py-2 pr-4">代碼</th>
                <th className="py-2 pr-4">名稱</th>
                <th className="py-2 pr-4 text-right">市值(億)</th>
                <th className="py-2 pr-4 text-right">股價</th>
                <th className="py-2 pr-4 text-right">本益比</th>
                <th className="py-2 text-right">今年漲跌</th>
              </tr>
            </thead>
            <tbody>
              {ind.stocks.map((s) => (
                <tr key={s.ticker} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="py-2 pr-4 font-mono text-xs">{s.ticker}</td>
                  <td className="py-2 pr-4 font-medium">{s.name}</td>
                  <td className="py-2 pr-4 text-right font-mono">{s.mcap.toLocaleString()}</td>
                  <td className="py-2 pr-4 text-right font-mono">{s.price.toFixed(2)}</td>
                  <td className="py-2 pr-4 text-right font-mono">{s.pe > 0 ? s.pe.toFixed(1) : "--"}</td>
                  <td className={`py-2 text-right font-mono ${s.yoy >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {s.yoy >= 0 ? <TrendingUp className="h-3 w-3 inline mr-1" /> : <TrendingDown className="h-3 w-3 inline mr-1" />}
                    {s.yoy >= 0 ? "+" : ""}{s.yoy}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">相關 ETF</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {(ind.etfs || []).map((e) => (
              <span key={e} className="px-3 py-1 bg-muted rounded text-xs font-mono">{e}</span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
