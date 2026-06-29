"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Lightbulb, AlertTriangle, TrendingUpIcon, BarChart3, ArrowRight, Sparkles } from "lucide-react";

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
  },
  "金融": {
    outlook: "2026 年台灣金融業面臨降息循環啟動與資本市場波動加劇的雙重考驗。銀行淨利差可能收窄，但財富管理與手續費收入可望填補缺口。壽險族群在避險成本改善與股市上漲帶動下，獲利表現仍有支撐。",
    analysis: [
      {
        title: "產業觀點",
        icon: <Lightbulb className="h-4 w-4 text-amber-500" />,
        items: [
          "Fed 降息循環將壓縮銀行淨利差（NIM），預估每家影響 3-8 bps，但放款量成長可部分抵銷",
          "壽險業避險成本因新台幣貶值壓力緩解而改善，經常性收益回溫",
          "證券經紀手續費受惠於日均成交量維持 4,000 億以上，經紀業務維持穩定貢獻",
        ],
      },
      {
        title: "關鍵驅動因子",
        icon: <TrendingUpIcon className="h-4 w-4 text-green-500" />,
        items: [
          "台灣財富管理市場滲透率持續提升，高資產客戶（AUM 1,000 萬以上）年增 15%",
          "銀行海外分行獲利貢獻度提高，特別是越南、柬埔寨等東南亞據點",
          "數位銀行轉型降低營運成本，部分銀行分行租金與人事費用年減 5-8%",
        ],
      },
      {
        title: "風險關注",
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
        items: [
          "國內不動產放款集中度偏高，若房價修正可能引發資產品質疑慮",
          "降息幅度超預期將直接衝擊外幣債券投資收益",
          "純網銀與電子支付業者持續瓜分年輕客群與支付市場",
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
  },
  "生技": {
    outlook: "台灣生技產業正處於從研發型轉向商業化的關鍵轉折期。多家新藥公司進入藥證申請或上市銷售階段，CDMO 業務受惠於全球供應鏈重組持續擴張。但個股波動極大，選股需要聚焦在明確的授權里程碑與營收能見度。",
    analysis: [
      {
        title: "產業觀點",
        icon: <Lightbulb className="h-4 w-4 text-amber-500" />,
        items: [
          "新藥開發進入收成期，2025-2027 年預計有 5-8 項台灣研發新藥在美/歐申請藥證",
          "CDMO 族群受惠於全球生技供應鏈去中化的轉單效應，中長期成長趨勢明確",
          "細胞治療與基因治療成為下一波焦點，台灣多家業者在 CAR-T 領域取得初步成果",
        ],
      },
      {
        title: "關鍵驅動因子",
        icon: <TrendingUpIcon className="h-4 w-4 text-green-500" />,
        items: [
          "美國 Inflation Reduction Act 壓抑品牌藥價，促使大藥廠擴大對外授權與委託開發",
          "台灣食品藥物管理署（TFDA）審查效率提升，新藥審查平均縮短至 12 個月",
          "國內健保給付鬆綁，高階自費醫療與癌症用藥市場持續擴張",
        ],
      },
      {
        title: "風險關注",
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
        items: [
          "臨床試驗失敗為生技投資最大風險，後期臨床解盲結果往往造成股價劇烈波動",
          "多數公司尚未獲利，本夢比偏高，利率變化對評價影響顯著",
          "中國生技產業政策補貼與人才回流對台灣形成競爭壓力",
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
  },
  "電信": {
    outlook: "台灣電信市場進入 5G 後期的穩定獲利階段，三大業者資本支出高峰已過，自由現金流顯著改善。價格競爭趨於理性，行動通訊 ARPU 止跌回升。中長期成長動能來自企業客戶業務（5G 專網、雲端、資安）與海外布局。",
    analysis: [
      {
        title: "產業觀點",
        icon: <Lightbulb className="h-4 w-4 text-amber-500" />,
        items: [
          "5G 資本支出高峰已過，電信三雄 2026-2027 年自由現金流將明顯改善，股利發放率可望提升",
          "行動通訊價格戰趨緩，用戶數淨增轉為正成長，ARPU 年增率轉正",
          "企業客戶業務（ICT/雲端/資安）營收佔比持續攀升，成為第二成長曲線",
        ],
      },
      {
        title: "關鍵驅動因子",
        icon: <TrendingUpIcon className="h-4 w-4 text-green-500" />,
        items: [
          "台灣企業數位轉型需求強勁，特別是製造業 5G 專網與智慧工廠應用",
          "資安法規趨嚴帶動企業資安支出年增 15-20%，電信業者具網路層級優勢",
          "低軌衛星通訊（LEO）商轉將為電信業者開創新收入來源",
        ],
      },
      {
        title: "風險關注",
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
        items: [
          "頻譜折舊費用仍處於高檔，影響獲利表現",
          "有線電視剪線潮加速，家用固網 VoIP 收入持續下滑",
          "虛擬電信業者（MVNO）與 OTT 通訊服務持續分食傳統語音收入",
        ],
      },
    ],
    stocks: [
      { name: "中華電", ticker: "2412.TW", mcap: 9700, price: 125, pe: 20.5, yoy: 5 },
      { name: "台灣大", ticker: "3045.TW", mcap: 4200, price: 112, pe: 18.8, yoy: 8 },
      { name: "遠傳", ticker: "4904.TW", mcap: 3800, price: 85.50, pe: 19.2, yoy: 6 },
    ],
    etfs: ["00731.TW 復華台灣科技優息", "00919.TW 群益台灣精選高息"],
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
        {useLlm && globalUpdatedAt && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-blue-400" />
            AI 自動更新 · {formatTime(globalUpdatedAt)}
            <span className="text-muted-foreground/60">（中{llm.sourceCount.zh} 英{llm.sourceCount.en}）</span>
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
