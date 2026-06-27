import { getCached, setCache } from "./redis";

const FINNHUB_KEY = process.env.FINNHUB_API_KEY || "";
const FINNHUB_BASE = "https://finnhub.io/api/v1";

export interface Quote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
}

const TW_STOCKS = [
  "2330.TW", "2317.TW", "2454.TW", "2382.TW", "2308.TW",
  "2881.TW", "2882.TW", "2412.TW", "2303.TW", "2002.TW",
];

interface FinnhubQuote {
  c: number; d: number; dp: number;
  h: number; l: number; o: number; pc: number;
}

async function fetchFinnhubQuote(symbol: string): Promise<FinnhubQuote | null> {
  const cacheKey = `quote:${symbol}`;
  const cached = await getCached<FinnhubQuote>(cacheKey);
  if (cached) return cached;
  try {
    const url = `${FINNHUB_BASE}/quote?symbol=${symbol}&token=${FINNHUB_KEY}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data: FinnhubQuote = await res.json();
    if (!data.c) return null;
    await setCache(cacheKey, data, 60000);
    return data;
  } catch { return null; }
}

export async function getQuote(symbol: string): Promise<Quote | null> {
  const raw = await fetchFinnhubQuote(symbol);
  if (!raw) return null;
  return { symbol, price: raw.c, change: raw.d, changePercent: raw.dp,
    high: raw.h, low: raw.l, open: raw.o, previousClose: raw.pc };
}

export async function getMultipleQuotes(symbols: string[]): Promise<Quote[]> {
  const results = await Promise.allSettled(symbols.map((s) => getQuote(s)));
  return results
    .filter((r) => r.status === "fulfilled" && r.value !== null)
    .map((r) => (r as PromiseFulfilledResult<Quote>).value);
}

const MOCK_MARKET_OVERVIEW = {
  twMarket: [
    { symbol: "2330.TW", price: 784.00, change: 16.50, changePercent: 2.15, high: 790, low: 778, open: 772, previousClose: 767.5 },
    { symbol: "2317.TW", price: 152.50, change: 1.00, changePercent: 0.66, high: 154, low: 151, open: 151.5, previousClose: 151.5 },
    { symbol: "2454.TW", price: 1185.00, change: 35.00, changePercent: 3.04, high: 1195, low: 1165, open: 1150, previousClose: 1150 },
    { symbol: "2382.TW", price: 285.50, change: -3.50, changePercent: -1.21, high: 290, low: 283, open: 289, previousClose: 289 },
    { symbol: "2308.TW", price: 338.00, change: -4.00, changePercent: -1.18, high: 344, low: 336, open: 342, previousClose: 342 },
    { symbol: "2881.TW", price: 72.80, change: 1.20, changePercent: 1.68, high: 73.5, low: 72.0, open: 71.6, previousClose: 71.6 },
    { symbol: "2882.TW", price: 58.50, change: -0.30, changePercent: -0.51, high: 59, low: 58, open: 58.8, previousClose: 58.8 },
    { symbol: "2412.TW", price: 125.00, change: -0.50, changePercent: -0.42, high: 126, low: 124.5, open: 125.5, previousClose: 125.5 },
    { symbol: "2303.TW", price: 52.30, change: -0.45, changePercent: -0.85, high: 53, low: 52, open: 52.75, previousClose: 52.75 },
    { symbol: "2002.TW", price: 24.50, change: -0.15, changePercent: -0.61, high: 24.8, low: 24.3, open: 24.65, previousClose: 24.65 },
  ],
  usIndices: {
    spy: { symbol: "SPY", price: 542.18, change: 4.42, changePercent: 0.82, high: 544, low: 538, open: 537.76, previousClose: 537.76 },
    qqq: { symbol: "QQQ", price: 486.50, change: 5.80, changePercent: 1.18, high: 488, low: 481, open: 480.70, previousClose: 480.70 },
    dia: { symbol: "DIA", price: 394.50, change: 1.26, changePercent: 0.32, high: 396, low: 393, open: 393.24, previousClose: 393.24 },
  },
};

const MOCK_NEWS: NewsItem[] = [
  { headline: "台積電 3nm 製程產能滿載 Q3 營收上看 EPS 45 元", summary: "台積電先進製程需求旺盛，3nm 產能利用率維持高檔，法人預估 Q3 獲利可望再創新高。", url: "#", source: "鉅亨網", datetime: Date.now() / 1000 - 3600 },
  { headline: "Fed 暗示下半年降息兩碼 新台幣升值壓力增", summary: "聯準會主席在 Jackson Hole 演說中釋放鴿派訊號，市場預期 9 月啟動降息循環。", url: "#", source: "Bloomberg", datetime: Date.now() / 1000 - 7200 },
  { headline: "國際油價震盪 OPEC+ 增產決策分歧", summary: "沙烏地阿拉伯與俄羅斯在增產幅度上意見不一，油價波動加劇。", url: "#", source: "Reuters", datetime: Date.now() / 1000 - 10800 },
  { headline: "日銀 7 月升息預期升溫 日圓一度升破 150", summary: "日本央行官員近期多次暗示可能 7 月升息，日圓兌美元匯率創一個月新高。", url: "#", source: "工商時報", datetime: Date.now() / 1000 - 14400 },
  { headline: "台灣 5 月出口年增 12.3% AI 供應鏈持續暢旺", summary: "財政部公布 5 月出口統計，受惠於 AI 晶片與伺服器需求，出口表現優於預期。", url: "#", source: "經濟日報", datetime: Date.now() / 1000 - 18000 },
  { headline: "Nasdaq 創歷史新高 科技七巨頭領漲", summary: "AI 熱潮持續推動科技股上漲，Nasdaq 指數首次突破 19,000 點大關。", url: "#", source: "CNBC", datetime: Date.now() / 1000 - 21600 },
];

export async function getMarketOverview() {
  if (!FINNHUB_KEY) return MOCK_MARKET_OVERVIEW;
  const [twQuotes, spyQuote, qqqQuote, diaQuote] = await Promise.all([
    getMultipleQuotes(TW_STOCKS),
    fetchFinnhubQuote("SPY"), fetchFinnhubQuote("QQQ"), fetchFinnhubQuote("DIA"),
  ]);
  const toQ = (raw: FinnhubQuote | null, sym: string) => raw ? {
    symbol: sym, price: raw.c, change: raw.d, changePercent: raw.dp,
    high: raw.h, low: raw.l, open: raw.o, previousClose: raw.pc,
  } : null;
  const result = {
    twMarket: twQuotes,
    usIndices: { spy: toQ(spyQuote, "SPY"), qqq: toQ(qqqQuote, "QQQ"), dia: toQ(diaQuote, "DIA") },
  };
  if (result.twMarket.length === 0 && !result.usIndices.spy && !result.usIndices.qqq && !result.usIndices.dia) {
    return MOCK_MARKET_OVERVIEW;
  }
  return result;
}

export interface NewsItem {
  headline: string; summary: string; url: string; source: string; datetime: number;
}

export async function getMarketNews(): Promise<NewsItem[]> {
  const cacheKey = "market:news";
  const cached = await getCached<NewsItem[]>(cacheKey);
  if (cached) return cached;
  if (!FINNHUB_KEY) return MOCK_NEWS;
  try {
    const url = `${FINNHUB_BASE}/news?category=general&token=${FINNHUB_KEY}`;
    const res = await fetch(url);
    if (!res.ok) return MOCK_NEWS;
    const data = await res.json();
    const items: NewsItem[] = (data || []).slice(0, 8).map((n: any) => ({
      headline: n.headline, summary: n.summary, url: n.url,
      source: n.source, datetime: n.datetime,
    }));
    if (items.length === 0) return MOCK_NEWS;
    await setCache(cacheKey, items, 300000);
    return items;
  } catch { return MOCK_NEWS; }
}
