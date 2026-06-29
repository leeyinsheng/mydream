import { getCached, setCache } from "./redis";

const FINNHUB_KEY = process.env.FINNHUB_API_KEY || "";
const FINNHUB_BASE = "https://finnhub.io/api/v1";
const YAHOO_BASE = "https://query1.finance.yahoo.com/v8/finance/chart";
const FOREX_BASE = "https://open.er-api.com/v6";

export interface Quote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  name?: string;
}

export interface CandleData {
  time: string | number;
  open: number;
  high: number;
  low: number;
  close: number;
}

const TW_STOCKS = [
  "2330.TW", "2317.TW", "2454.TW", "2382.TW", "2308.TW",
  "2881.TW", "2882.TW", "2412.TW", "2303.TW", "2002.TW",
];

interface YahooResult {
  meta: {
    symbol: string;
    regularMarketPrice: number;
    chartPreviousClose: number;
    regularMarketDayHigh: number;
    regularMarketDayLow: number;
    longName?: string;
    shortName?: string;
  };
  timestamp: number[];
  indicators: {
    quote: Array<{
      open: (number | null)[];
      high: (number | null)[];
      low: (number | null)[];
      close: (number | null)[];
    }>;
  };
}

async function fetchYahoo(symbol: string, range = "1d", interval = "1d"): Promise<YahooResult | null> {
  const cacheKey = `yahoo:${symbol}:${range}:${interval}`;
  const cached = await getCached<YahooResult>(cacheKey);
  if (cached) return cached;
  try {
    const url = `${YAHOO_BASE}/${encodeURIComponent(symbol)}?interval=${interval}&range=${range}&includePrePost=false`;
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) return null;
    const json = await res.json();
    const result = json.chart?.result?.[0];
    if (!result) return null;
    await setCache(cacheKey, result, 5000);
    return result;
  } catch { return null; }
}

export async function getQuote(symbol: string): Promise<Quote | null> {
  const raw = await fetchYahoo(symbol, "1d");
  if (!raw) return null;
  const m = raw.meta;
  const price = m.regularMarketPrice;
  const prev = m.chartPreviousClose;
  const change = price - prev;
  const changePercent = prev ? (change / prev) * 100 : 0;
  return {
    symbol,
    price,
    change,
    changePercent,
    high: m.regularMarketDayHigh,
    low: m.regularMarketDayLow,
    open: prev,
    previousClose: prev,
    name: m.longName || m.shortName,
  };
}

export async function getMultipleQuotes(symbols: string[]): Promise<Quote[]> {
  const results = await Promise.allSettled(symbols.map((s) => getQuote(s)));
  return results
    .filter((r) => r.status === "fulfilled" && r.value !== null)
    .map((r) => (r as PromiseFulfilledResult<Quote>).value);
}

export async function getCandles(symbol: string, range = "6mo"): Promise<CandleData[]> {
  const intervalMap: Record<string, string> = {
    "1d": "15m",
    "5d": "1h",
    "1mo": "1d",
    "3mo": "1d",
    "6mo": "1d",
    "1y": "1d",
    "10y": "1wk",
  };
  const interval = intervalMap[range] || "1d";
  const raw = await fetchYahoo(symbol, range, interval);
  if (!raw) return [];
  const quotes = raw.indicators.quote[0];
  const isIntraday = interval !== "1d" && interval !== "1wk";
  return raw.timestamp
    .map((t, i) => {
      const o = quotes.open[i];
      const h = quotes.high[i];
      const l = quotes.low[i];
      const c = quotes.close[i];
      if (o === null || h === null || l === null || c === null) return null;
      return {
        time: isIntraday ? t : new Date(t * 1000).toISOString().split("T")[0],
        open: o,
        high: h,
        low: l,
        close: c,
      };
    })
    .filter((d): d is CandleData => d !== null);
}

const MOCK_TW_STOCKS = [
  { symbol: "2330.TW", price: 2340, change: 70, changePercent: 3.08, high: 2370, low: 2325, open: 2270, previousClose: 2270 },
  { symbol: "2317.TW", price: 152.50, change: 1.00, changePercent: 0.66, high: 154, low: 151, open: 151.5, previousClose: 151.5 },
  { symbol: "2454.TW", price: 1185.00, change: 35.00, changePercent: 3.04, high: 1195, low: 1165, open: 1150, previousClose: 1150 },
  { symbol: "2382.TW", price: 285.50, change: -3.50, changePercent: -1.21, high: 290, low: 283, open: 289, previousClose: 289 },
  { symbol: "2308.TW", price: 338.00, change: -4.00, changePercent: -1.18, high: 344, low: 336, open: 342, previousClose: 342 },
  { symbol: "2881.TW", price: 72.80, change: 1.20, changePercent: 1.68, high: 73.5, low: 72.0, open: 71.6, previousClose: 71.6 },
  { symbol: "2882.TW", price: 58.50, change: -0.30, changePercent: -0.51, high: 59, low: 58, open: 58.8, previousClose: 58.8 },
  { symbol: "2412.TW", price: 125.00, change: -0.50, changePercent: -0.42, high: 126, low: 124.5, open: 125.5, previousClose: 125.5 },
  { symbol: "2303.TW", price: 52.30, change: -0.45, changePercent: -0.85, high: 53, low: 52, open: 52.75, previousClose: 52.75 },
  { symbol: "2002.TW", price: 24.50, change: -0.15, changePercent: -0.61, high: 24.8, low: 24.3, open: 24.65, previousClose: 24.65 },
];

export interface IndexInfo {
  symbol: string;
  name: string;
  country: string;
  flag: string;
}

const GLOBAL_INDICES: IndexInfo[] = [
  { symbol: "^TWII", name: "台股加權", country: "台灣", flag: "🇹🇼" },
  { symbol: "^GSPC", name: "標普500", country: "美國", flag: "🇺🇸" },
  { symbol: "^IXIC", name: "NASDAQ", country: "美國", flag: "🇺🇸" },
  { symbol: "^DJI", name: "道瓊工業", country: "美國", flag: "🇺🇸" },
  { symbol: "^N225", name: "日經225", country: "日本", flag: "🇯🇵" },
  { symbol: "^KS11", name: "KOSPI", country: "韓國", flag: "🇰🇷" },
  { symbol: "000001.SS", name: "上證綜合", country: "中國", flag: "🇨🇳" },
  { symbol: "399001.SZ", name: "深圳成指", country: "中國", flag: "🇨🇳" },
  { symbol: "^HSI", name: "恆生指數", country: "香港", flag: "🇭🇰" },
  { symbol: "^STI", name: "海峽時報", country: "新加坡", flag: "🇸🇬" },
];

export interface IndexQuote extends Quote {
  name: string;
  country: string;
  flag: string;
}

const MOCK_INDICES: IndexQuote[] = [
  { symbol: "^TWII", name: "台股加權", country: "台灣", flag: "🇹🇼", price: 21850, change: 268, changePercent: 1.24, high: 21900, low: 21600, open: 21582, previousClose: 21582 },
  { symbol: "^GSPC", name: "標普500", country: "美國", flag: "🇺🇸", price: 5420, change: 44, changePercent: 0.82, high: 5440, low: 5380, open: 5376, previousClose: 5376 },
  { symbol: "^IXIC", name: "NASDAQ", country: "美國", flag: "🇺🇸", price: 19012, change: 236, changePercent: 1.18, high: 19100, low: 18800, open: 18776, previousClose: 18776 },
  { symbol: "^DJI", name: "道瓊工業", country: "美國", flag: "🇺🇸", price: 39450, change: 126, changePercent: 0.32, high: 39600, low: 39300, open: 39324, previousClose: 39324 },
  { symbol: "^N225", name: "日經225", country: "日本", flag: "🇯🇵", price: 39842, change: -185, changePercent: -0.46, high: 40100, low: 39700, open: 40027, previousClose: 40027 },
  { symbol: "^KS11", name: "KOSPI", country: "韓國", flag: "🇰🇷", price: 2685, change: 12.5, changePercent: 0.47, high: 2695, low: 2675, open: 2672.5, previousClose: 2672.5 },
  { symbol: "000001.SS", name: "上證綜合", country: "中國", flag: "🇨🇳", price: 3150, change: -8.9, changePercent: -0.28, high: 3170, low: 3140, open: 3159, previousClose: 3159 },
  { symbol: "399001.SZ", name: "深圳成指", country: "中國", flag: "🇨🇳", price: 10580, change: 85, changePercent: 0.81, high: 10620, low: 10500, open: 10495, previousClose: 10495 },
  { symbol: "^HSI", name: "恆生指數", country: "香港", flag: "🇭🇰", price: 18200, change: 105, changePercent: 0.58, high: 18300, low: 18100, open: 18095, previousClose: 18095 },
  { symbol: "^STI", name: "海峽時報", country: "新加坡", flag: "🇸🇬", price: 3380, change: 18, changePercent: 0.54, high: 3395, low: 3365, open: 3362, previousClose: 3362 },
];

export async function getGlobalIndices(): Promise<IndexQuote[]> {
  const cacheKey = "global:indices";
  const cached = await getCached<IndexQuote[]>(cacheKey);
  if (cached) return cached;
  try {
    const results = await Promise.allSettled(
      GLOBAL_INDICES.map(async (info) => {
        const raw = await fetchYahoo(info.symbol);
        if (!raw || !raw.meta.regularMarketPrice) return null;
        const m = raw.meta;
        const price = m.regularMarketPrice;
        const prev = m.chartPreviousClose;
        return {
          symbol: info.symbol,
          name: info.name,
          country: info.country,
          flag: info.flag,
          price,
          change: price - prev,
          changePercent: prev ? ((price - prev) / prev) * 100 : 0,
          high: m.regularMarketDayHigh,
          low: m.regularMarketDayLow,
          open: prev,
          previousClose: prev,
        };
      })
    );
    const indices = results
      .filter((r) => r.status === "fulfilled" && r.value !== null)
      .map((r) => (r as PromiseFulfilledResult<IndexQuote>).value);
    if (indices.length === 0) return MOCK_INDICES;
    await setCache(cacheKey, indices, 5000);
    return indices;
  } catch { return MOCK_INDICES; }
}

export async function getMarketOverview() {
  const twResults = await getMultipleQuotes(TW_STOCKS);
  return {
    twMarket: twResults.length > 0 ? twResults : MOCK_TW_STOCKS,
  };
}

export interface NewsItem {
  headline: string; summary: string; url: string; source: string; datetime: number;
}

const MOCK_NEWS: NewsItem[] = [
  { headline: "台積電 3nm 製程產能滿載 Q3 營收上看 EPS 45 元", summary: "台積電先進製程需求旺盛，3nm 產能利用率維持高檔，法人預估 Q3 獲利可望再創新高。", url: "#", source: "鉅亨網", datetime: Date.now() / 1000 - 3600 },
  { headline: "Fed 暗示下半年降息兩碼 新台幣升值壓力增", summary: "聯準會主席在 Jackson Hole 演說中釋放鴿派訊號，市場預期 9 月啟動降息循環。", url: "#", source: "Bloomberg", datetime: Date.now() / 1000 - 7200 },
  { headline: "國際油價震盪 OPEC+ 增產決策分歧", summary: "沙烏地阿拉伯與俄羅斯在增產幅度上意見不一，油價波動加劇。", url: "#", source: "Reuters", datetime: Date.now() / 1000 - 10800 },
  { headline: "日銀 7 月升息預期升溫 日圓一度升破 150", summary: "日本央行官員近期多次暗示可能 7 月升息，日圓兌美元匯率創一個月新高。", url: "#", source: "工商時報", datetime: Date.now() / 1000 - 14400 },
  { headline: "台灣 5 月出口年增 12.3% AI 供應鏈持續暢旺", summary: "財政部公布 5 月出口統計，受惠於 AI 晶片與伺服器需求，出口表現優於預期。", url: "#", source: "經濟日報", datetime: Date.now() / 1000 - 18000 },
  { headline: "Nasdaq 創歷史新高 科技七巨頭領漲", summary: "AI 熱潮持續推動科技股上漲，Nasdaq 指數首次突破 19,000 點大關。", url: "#", source: "CNBC", datetime: Date.now() / 1000 - 21600 },
];

const NON_FINANCE_KEYWORDS = [
  "world cup", "sports", "politics", "election", "hezbollah",
  "military", "war", "olympics", "soccer", "basketball",
  "celebrity", "entertainment", "music",
];

function isFinanceNews(item: NewsItem): boolean {
  const text = `${item.headline} ${item.summary}`.toLowerCase();
  return !NON_FINANCE_KEYWORDS.some((kw) => text.includes(kw));
}

export async function getMarketNews(): Promise<NewsItem[]> {
  const cacheKey = "market:news";
  const cached = await getCached<NewsItem[]>(cacheKey);
  if (cached) return cached;
  if (!FINNHUB_KEY) return MOCK_NEWS;
  try {
    const symbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "2330.TW"];
    const allItems: NewsItem[] = [];
    for (const sym of symbols) {
      const url = `${FINNHUB_BASE}/company-news?symbol=${sym}&from=2026-06-01&to=${new Date().toISOString().split("T")[0]}&token=${FINNHUB_KEY}`;
      const res = await fetch(url);
      if (!res.ok) continue;
      const data = await res.json();
      for (const n of (data || []).slice(0, 5)) {
        if (n.headline && n.url && n.headline !== "") {
          allItems.push({
            headline: n.headline, summary: n.summary || "", url: n.url,
            source: n.source, datetime: n.datetime,
          });
        }
      }
    }
    const items = allItems.filter(isFinanceNews).slice(0, 8);
    if (items.length === 0) return MOCK_NEWS;
    await setCache(cacheKey, items, 300000);
    return items;
  } catch { return MOCK_NEWS; }
}

export interface ForexPair {
  pair: string;
  rate: number;
  yahoosym: string;
}

const FOREX_INFO: { pair: string; yahoosym: string; currency: string; isUsdBase: boolean }[] = [
  { pair: "USD/TWD", yahoosym: "USDTWD=X", currency: "TWD", isUsdBase: true },
  { pair: "USD/JPY", yahoosym: "USDJPY=X", currency: "JPY", isUsdBase: true },
  { pair: "USD/CNH", yahoosym: "USDCNY=X", currency: "CNY", isUsdBase: true },
  { pair: "USD/CAD", yahoosym: "USDCAD=X", currency: "CAD", isUsdBase: true },
  { pair: "USD/KRW", yahoosym: "USDKRW=X", currency: "KRW", isUsdBase: true },
  { pair: "EUR/USD", yahoosym: "EURUSD=X", currency: "EUR", isUsdBase: false },
  { pair: "GBP/USD", yahoosym: "GBPUSD=X", currency: "GBP", isUsdBase: false },
  { pair: "AUD/USD", yahoosym: "AUDUSD=X", currency: "AUD", isUsdBase: false },
];

const MOCK_FOREX: ForexPair[] = [
  { pair: "USD/TWD", rate: 32.26, yahoosym: "USDTWD=X" },
  { pair: "USD/JPY", rate: 151.5, yahoosym: "USDJPY=X" },
  { pair: "USD/CNH", rate: 7.25, yahoosym: "USDCNY=X" },
  { pair: "USD/CAD", rate: 1.36, yahoosym: "USDCAD=X" },
  { pair: "USD/KRW", rate: 1351.3, yahoosym: "USDKRW=X" },
  { pair: "EUR/USD", rate: 1.0852, yahoosym: "EURUSD=X" },
  { pair: "GBP/USD", rate: 1.268, yahoosym: "GBPUSD=X" },
  { pair: "AUD/USD", rate: 0.657, yahoosym: "AUDUSD=X" },
];

export interface CommodityItem {
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

const COMMODITY_SYMBOLS: { name: string; symbol: string }[] = [
  { name: "黃金 (XAU/USD)", symbol: "GC=F" },
  { name: "白銀 (XAG/USD)", symbol: "SI=F" },
  { name: "原油 (WTI)", symbol: "CL=F" },
  { name: "天然氣", symbol: "NG=F" },
  { name: "玉米", symbol: "ZC=F" },
  { name: "小麥", symbol: "ZW=F" },
  { name: "黃豆", symbol: "ZS=F" },
  { name: "銅", symbol: "HG=F" },
];

export function getCommodityName(symbol: string): string | undefined {
  return COMMODITY_SYMBOLS.find((c) => c.symbol === symbol)?.name;
}

const MOCK_COMMODITIES: CommodityItem[] = [
  { name: "黃金 (XAU/USD)", symbol: "GC=F", price: 2350.50, change: 11.70, changePercent: 0.5 },
  { name: "白銀 (XAG/USD)", symbol: "SI=F", price: 28.32, change: 0.22, changePercent: 0.8 },
  { name: "原油 (WTI)", symbol: "CL=F", price: 78.50, change: -0.95, changePercent: -1.2 },
  { name: "天然氣", symbol: "NG=F", price: 2.15, change: -0.01, changePercent: -0.4 },
  { name: "玉米", symbol: "ZC=F", price: 458.00, change: 1.37, changePercent: 0.3 },
  { name: "小麥", symbol: "ZW=F", price: 542.00, change: -3.27, changePercent: -0.6 },
  { name: "黃豆", symbol: "ZS=F", price: 1185.00, change: 12.90, changePercent: 1.1 },
  { name: "銅", symbol: "HG=F", price: 4.52, change: 0.01, changePercent: 0.2 },
];

export async function getCommodityPrices(): Promise<CommodityItem[]> {
  const cacheKey = "commodity:prices";
  const cached = await getCached<CommodityItem[]>(cacheKey);
  if (cached) return cached;
  try {
    const results = await Promise.allSettled(
      COMMODITY_SYMBOLS.map(async (info) => {
        const quote = await getQuote(info.symbol);
        if (!quote) return null;
        return {
          name: info.name,
          symbol: info.symbol,
          price: quote.price,
          change: quote.change,
          changePercent: quote.changePercent,
        };
      })
    );
    const items = results
      .filter((r) => r.status === "fulfilled" && r.value !== null)
      .map((r) => (r as PromiseFulfilledResult<CommodityItem>).value);
    if (items.length === 0) return MOCK_COMMODITIES;
    await setCache(cacheKey, items, 5000);
    return items;
  } catch { return MOCK_COMMODITIES; }
}

export async function getForexRates(): Promise<ForexPair[]> {
  const cacheKey = "forex:rates";
  const cached = await getCached<ForexPair[]>(cacheKey);
  if (cached) return cached;
  try {
    const res = await fetch(`${FOREX_BASE}/latest/USD`);
    if (!res.ok) return MOCK_FOREX;
    const data = await res.json();
    const rates: Record<string, number> = data.rates || {};
    const result: ForexPair[] = [];
    const r = (code: string) => rates[code] || 0;
    for (const info of FOREX_INFO) {
      const rate = r(info.currency);
      if (!rate) continue;
      const val = info.isUsdBase ? rate : 1 / rate;
      const fixed = info.pair === "USD/KRW"
        ? parseFloat(val.toFixed(2))
        : parseFloat(val.toFixed(4));
      result.push({ pair: info.pair, rate: fixed, yahoosym: info.yahoosym });
    }
    if (result.length === 0) return MOCK_FOREX;
    await setCache(cacheKey, result, 3600000);
    return result;
  } catch { return MOCK_FOREX; }
}
