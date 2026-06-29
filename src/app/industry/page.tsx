"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Lightbulb, AlertTriangle, TrendingUpIcon, BarChart3, ArrowRight, Sparkles, Clock } from "lucide-react";

interface AnalysisSection {
  title: string;
  icon: React.ReactNode;
  items: string[];
}

interface StockInfo {
  name: string; ticker: string; mcap: number; price: number; pe: number; yoy: number;
}

interface IndustryData {
  analysis: AnalysisSection[];
  outlook: string;
  stocks: StockInfo[];
  etfs: string[];
  updatedAt: string;
}

const INDUSTRIES: Record<string, IndustryData> = {
  "半導體": {
    outlook: "2026 年全球半導體市場預估突破 7,000 億美元，AI 晶片、HBM 記憶體、先進封裝為三大成長引擎。台灣在先進製程的領先地位短期內難以被撼動，但地緣政治風險與各國補貼競賽將持續重塑供應鏈版圖。",
    analysis: [
      {
        title: "產業觀點",
        icon: <Lightbulb className="h-4 w-4 text-amber-500" />,
        items: [
          "AI 加速器晶片需求持續井噴，CoWoS 先進封裝產能供不應求將延續至 2027 年",
          "3nm 家族貢獻營收比重突破 35%，2nm 將於 2026 下半年量產，持續拉大與競爭對手差距",
          "IC 設計族群受惠於 AI 邊緣運算與 ASIC 客製化需求，成長動能優於代工",
        ],
      },
      {
        title: "關鍵驅動因子",
        icon: <TrendingUpIcon className="h-4 w-4 text-green-500" />,
        items: [
          "大型 CSP 業者（Microsoft、Meta、Google）2026 年資本支出合計超過 2,500 億美元，主要用於 AI 基礎建設",
          "HBM4 將於 2027 年進入量產，推動記憶體產業進入新一輪成長週期",
          "車用半導體庫存調整結束，2026 下半年可望重回成長軌道",
        ],
      },
      {
        title: "風險關注",
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
        items: [
          "美國大選後對中晶片管制可能進一步收緊，影響部分 IC 設計客戶",
          "日本 Rapidus 與 Intel 代工服務若量產順利，2027 年起可能對先進製程價格形成壓力",
          "終端消費性電子需求復甦力道不明，庫存回補動能可能低於預期",
        ],
      },
    ],
    stocks: [
      { name: "台積電", ticker: "2330.TW", mcap: 203000, price: 784, pe: 22.5, yoy: 68 },
      { name: "聯發科", ticker: "2454.TW", mcap: 18900, price: 1185, pe: 18.2, yoy: 42 },
      { name: "聯電", ticker: "2303.TW", mcap: 6500, price: 52.30, pe: 14, yoy: 8 },
      { name: "日月光", ticker: "3711.TW", mcap: 5200, price: 158, pe: 16.5, yoy: 22 },
    ],
    etfs: ["0050.TW 元大台灣50", "00881.TW 國泰台灣5G+", "00923.TW 群益半導體收益"],
    updatedAt: "2026-06-29T12:00:00.000Z",
  },
  "金融": {
    outlook: "全球金融業在 2026 年面臨降息循環與 macro 不確定性的雙重考驗。歐美大型銀行在利率正常化後 ROE 改善顯著，亞洲跨境金融與財富管理需求持續增長。台灣金融業在淨利差收窄壓力下，透過海外佈局與手續費收入多元化維持獲利動能。",
    analysis: [
      {
        title: "產業觀點",
        icon: <Lightbulb className="h-4 w-4 text-amber-500" />,
        items: [
          "Fed 與 ECB 降息循環壓縮銀行淨利差，但歐美大型銀行透過投資銀行業務多元化緩解衝擊",
          "歐洲銀行業獲利顯著回升，Deutsche Bank、BNP Paribas 等 ROE 達 10% 以上，為金融危機以來最佳",
          "亞洲跨境金融與私人銀行業務快速增長，新加坡、香港 AUM 年增 15-20%",
        ],
      },
      {
        title: "關鍵驅動因子",
        icon: <TrendingUpIcon className="h-4 w-4 text-green-500" />,
        items: [
          "全球保險業投資收益受惠於利率環境改善，AIA、AXA 等壽險龍頭 NBV 維持 double-digit 增長",
          "東南亞金融滲透率仍低，越南、印尼信貸年增 12-15%，吸引外資銀行積極佈局",
          "Embedded Finance 與 Banking-as-a-Service 正在重塑零售銀行業務模式，全球市場規模 CAGR 預估 25%",
        ],
      },
      {
        title: "風險關注",
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
        items: [
          "美國商業不動產（CRE）貸款違約率攀升，中型區域銀行暴露風險最高",
          "中國房地產持續調整對亞洲金融業資產品質的連鎖效應仍待觀察",
          "AI 與 FinTech 新創持續侵蝕傳統銀行支付與放款中間業務",
        ],
      },
    ],
    stocks: [
      { name: "富邦金", ticker: "2881.TW", mcap: 8900, price: 72.80, pe: 11.2, yoy: 35 },
      { name: "國泰金", ticker: "2882.TW", mcap: 7600, price: 58.50, pe: 10.5, yoy: 28 },
      { name: "中信金", ticker: "2891.TW", mcap: 6200, price: 34.20, pe: 9.8, yoy: 18 },
      { name: "兆豐金", ticker: "2886.TW", mcap: 5900, price: 42.30, pe: 13.5, yoy: 12 },
    ],
    etfs: ["0055.TW 元大金融", "00915.TW 凱基金融"],
    updatedAt: "2026-06-29T12:00:00.000Z",
  },
  "生技": {
    outlook: "全球生技產業在 2026 年持續受惠於三股趨勢：GLP-1 類藥物市場爆發式成長、AI 輔助藥物發現加速 pipeline 推進、以及 CDMO 供應鏈重組。台灣生技業在特定 niche（CDMO、細胞治療）具有全球競爭力，但整體仍以國際授權與合作為主要成長動力。",
    analysis: [
      {
        title: "產業觀點",
        icon: <Lightbulb className="h-4 w-4 text-amber-500" />,
        items: [
          "GLP-1 受體促效劑全球市場 2026 年預估突破 500 億美元，Novo Nordisk、Eli Lilly 持續擴充產能",
          "AI 輔助藥物發現進入實質貢獻階段，Recursion、Insilico 等 AI-first 生技公司多項候選藥物進入臨床",
          "全球 CDMO 市場受大藥廠外包趨勢推動，Lonza、三星生物製劑產能滿載，台灣 CDMO 業者受惠轉單",
        ],
      },
      {
        title: "關鍵驅動因子",
        icon: <TrendingUpIcon className="h-4 w-4 text-green-500" />,
        items: [
          "美國 IRA 法案壓抑品牌藥價，大藥廠擴大對外授權與 CDMO 委託，全球授權交易總額年增 20%",
          "細胞與基因治療（CGT）商業化加速，FDA 已批准超過 30 項 CGT 產品，供應鏈需求爆發",
          "精準醫療與生物標記（Biomarker）檢測普及，推動伴隨式診斷市場 CAGR 達 18%",
        ],
      },
      {
        title: "風險關注",
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
        items: [
          "臨床試驗失敗為生技投資最大風險，後期解盲失敗往往造成股價腰斬",
          "美國藥價改革立法的不確定性可能影響大藥廠定價能力與獲利預期",
          "中國生技產業在政府補貼與人才回流政策推動下，與台灣形成直接競爭",
        ],
      },
    ],
    stocks: [
      { name: "藥華藥", ticker: "6446.TW", mcap: 1200, price: 358, pe: 0, yoy: 85 },
      { name: "合一", ticker: "4743.TW", mcap: 850, price: 168.50, pe: 0, yoy: -8 },
      { name: "中裕", ticker: "4147.TW", mcap: 450, price: 85.20, pe: 0, yoy: 32 },
      { name: "泰博", ticker: "4736.TW", mcap: 380, price: 142, pe: 18.5, yoy: 5 },
    ],
    etfs: ["00892.TW 富邦台灣生技"],
    updatedAt: "2026-06-29T12:00:00.000Z",
  },
  "航運": {
    outlook: "貨櫃航運在紅海危機與美國關稅政策雙重影響下，2026 年供需格局仍有變數。散裝航運受惠於中國基礎建設刺激政策，運價可望維持在獲利水準之上。長期來看，航運業的碳中和轉型將加速老舊船舶拆解，有利供需結構改善。",
    analysis: [
      {
        title: "產業觀點",
        icon: <Lightbulb className="h-4 w-4 text-amber-500" />,
        items: [
          "紅海繞航效應持續吸收過剩運力，2026 上半年運價可望維持在獲利區間之上",
          "美國對中國加徵關稅導致供應鏈提前拉貨，短期推升運量但中長期需求仍需觀察",
          "新船交付高峰集中在 2026-2027 年，供需平衡的關鍵在於老舊船舶拆解速度",
        ],
      },
      {
        title: "關鍵驅動因子",
        icon: <TrendingUpIcon className="h-4 w-4 text-green-500" />,
        items: [
          "IMO 碳排放新規將加速不符標準的船舶拆解，預計 2026-2028 年拆解量將創新高",
          "中國一帶一路基建需求帶動鋼材與原物料進口，散裝航運直接受惠",
          "美國東岸與墨西哥灣港口基礎建設升級，長期有助於貨運效率提升",
        ],
      },
      {
        title: "風險關注",
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
        items: [
          "紅海危機若緩解，航商將回到正常航線，運力過剩問題將重新浮現",
          "全球經濟衰退風險將直接衝擊貨櫃運量需求",
          "運價波動劇烈，航運股股價高度連動運價指數，不適合風險承受度低的投資人",
        ],
      },
    ],
    stocks: [
      { name: "長榮", ticker: "2603.TW", mcap: 3800, price: 178.50, pe: 5.8, yoy: 55 },
      { name: "陽明", ticker: "2609.TW", mcap: 1700, price: 52.80, pe: 4.2, yoy: 38 },
      { name: "萬海", ticker: "2615.TW", mcap: 1200, price: 62.40, pe: 6.5, yoy: 15 },
      { name: "裕民", ticker: "2606.TW", mcap: 850, price: 58.20, pe: 8.2, yoy: 10 },
    ],
    etfs: ["00915.TW 凱基航運", "0056.TW 元大高股息（含航運）"],
    updatedAt: "2026-06-29T12:00:00.000Z",
  },
  "電信": {
    outlook: "全球電信產業正經歷從傳統電信服務商邁向科技平台商的結構性轉型。5G-Advanced 與 6G 研發競賽升溫，LEO 衛星通訊（Starlink）開始挑戰傳統電信邊界。台灣電信三雄在資本支出高峰過後自由現金流顯著改善，企業客戶業務成為第二成長引擎。",
    analysis: [
      {
        title: "產業觀點",
        icon: <Lightbulb className="h-4 w-4 text-amber-500" />,
        items: [
          "全球 5G 用戶數突破 25 億，5G-Advanced 標準凍結推動下一波網路升級週期",
          "Starlink 等 LEO 衛星通訊用戶數突破 500 萬，對偏遠地區傳統電信形成直接競爭",
          "全球電信業者積極轉型雲端/IoT/資安服務，T-Mobile US 企業業務營收年增 25%",
        ],
      },
      {
        title: "關鍵驅動因子",
        icon: <TrendingUpIcon className="h-4 w-4 text-green-500" />,
        items: [
          "6G 研發進入關鍵階段，預計 2028 年標準凍結，中國、美國、歐盟三大陣營投入數百億美元",
          "全球企業 IoT 連接數突破 200 億，電信業者從連接服務延伸至平台與數據分析",
          "資安威脅日益嚴峻，全球電信級資安市場年增 18%，電信業者具備網路基礎設施優勢",
        ],
      },
      {
        title: "風險關注",
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
        items: [
          "衛星通訊直接對手機（D2D）技術成熟後可能顛覆傳統電信商業模式",
          "全球頻譜拍賣成本持續攀升，歐洲電信業者獲利率受到壓縮",
          "OTT 通訊服務（WhatsApp、WeChat、LINE）持續取代傳統語音與簡訊收入",
        ],
      },
    ],
    stocks: [
      { name: "中華電", ticker: "2412.TW", mcap: 9700, price: 125, pe: 20.5, yoy: 5 },
      { name: "台灣大", ticker: "3045.TW", mcap: 4200, price: 112, pe: 18.8, yoy: 8 },
      { name: "遠傳", ticker: "4904.TW", mcap: 3800, price: 85.50, pe: 19.2, yoy: 6 },
    ],
    etfs: ["00731.TW 復華台灣科技優息", "00919.TW 群益台灣精選高息"],
    updatedAt: "2026-06-29T12:00:00.000Z",
  },
  "鋼鐵": {
    outlook: "全球鋼鐵產業正經歷從供過於求邁向供需再平衡的結構性調整。中國產能調控政策持續收緊，碳中和轉型加速高爐轉電爐的製程變革。台灣鋼鐵龍頭中鋼積極朝精緻鋼廠轉型，高值化產品比重逐年提升。",
    analysis: [
      {
        title: "產業觀點",
        icon: <Lightbulb className="h-4 w-4 text-amber-500" />,
        items: [
          "中國鋼鐵產能平控政策持續，2026 年粗鋼產量預計再減 2-3%，有助於支撐國際鋼價",
          "碳中和趨勢推動電爐煉鋼佔比提升，廢鋼需求長期看漲",
          "中鋼精緻鋼材（電磁鋼片、汽車用鋼）出貨比重目標在 2030 年前達 25%",
        ],
      },
      {
        title: "關鍵驅動因子",
        icon: <TrendingUpIcon className="h-4 w-4 text-green-500" />,
        items: [
          "美國基建法案與乾淨能源補貼帶動鋼材需求，特別是在變壓器用電磁鋼片",
          "東南亞基礎建設發展加速，越南、印尼鋼材需求年增 5-8%",
          "碳邊境調整機制（CBAM）使歐洲進口鋼材成本提高，相對有利亞洲鋼廠",
        ],
      },
      {
        title: "風險關注",
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
        items: [
          "中國房地產景氣持續低迷，拖累建築用鋼需求",
          "全球貿易保護主義升溫，反傾銷稅調查案件增加",
          "碳權成本將逐步提高煉鋼成本，影響獲利能力",
        ],
      },
    ],
    stocks: [
      { name: "中鋼", ticker: "2002.TW", mcap: 3800, price: 24.50, pe: 18, yoy: -5 },
      { name: "中鴻", ticker: "2014.TW", mcap: 500, price: 22.80, pe: 15, yoy: 12 },
      { name: "燁輝", ticker: "2023.TW", mcap: 350, price: 17.60, pe: 14.5, yoy: 8 },
    ],
    etfs: ["0050.TW", "00876.TW 富邦鋼鐵"],
    updatedAt: "2026-06-29T12:00:00.000Z",
  },
};

interface LlmAnalysis {
  outlook: string;
  updates: string[];
  drivers: string[];
  risks: string[];
  sourceCount: { zh: number; en: number };
  updatedAt: string;
}

const KEYS = Object.keys(INDUSTRIES);

function toAnalysis(llm: LlmAnalysis): AnalysisSection[] {
  return [
    {
      title: "產業觀點",
      icon: <Lightbulb className="h-4 w-4 text-amber-500" />,
      items: llm.updates,
    },
    {
      title: "關鍵驅動因子",
      icon: <TrendingUpIcon className="h-4 w-4 text-green-500" />,
      items: llm.drivers,
    },
    {
      title: "風險關注",
      icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
      items: llm.risks,
    },
  ];
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function IndustryPage() {
  const [active, setActive] = useState(KEYS[0]);
  const [llmData, setLlmData] = useState<Record<string, LlmAnalysis> | null>(null);
  const [globalUpdatedAt, setGlobalUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/industry/analysis")
      .then((r) => r.json())
      .then((res) => {
        if (res.data) {
          setLlmData(res.data);
          setGlobalUpdatedAt(res.updatedAt);
        }
      })
      .catch((e) => console.error("產業分析讀取失敗:", e));
  }, []);

  const llm = llmData?.[active];
  const ind = INDUSTRIES[active];
  const useLlm = llm && llm.outlook && llm.updates.length > 0;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">產業分析</h1>
        <p className="text-sm text-muted-foreground mt-1">專業產業觀點與趨勢解讀，協助掌握投資主線</p>
        {useLlm && globalUpdatedAt ? (
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-blue-400" />
            AI 自動更新 · {formatTime(globalUpdatedAt)}
            <span className="text-muted-foreground/60">（中{llm.sourceCount.zh} 英{llm.sourceCount.en}）</span>
          </p>
        ) : (
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            最後更新 · {formatTime(ind.updatedAt)}
          </p>
        )}
      </div>

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

      {/* 總覽展望 */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><BarChart3 className="h-4 w-4" /> 產業總覽與展望</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">{useLlm ? llm.outlook : ind.outlook}</p>
        </CardContent>
      </Card>

      {/* 深度分析 */}
      {(useLlm ? toAnalysis(llm) : ind.analysis).map((section) => (
        <Card key={section.title}>
          <CardHeader><CardTitle className="text-base flex items-center gap-2">{section.icon} {section.title}</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {section.items.map((item) => (
                <li key={`${section.title}-${item}`} className="flex gap-2 text-sm">
                  <ArrowRight className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}

      {/* 龍頭股比較 */}
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

      {/* 相關 ETF */}
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
