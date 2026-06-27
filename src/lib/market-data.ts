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

export async function getMarketOverview() {
  const [twQuotes, spyQuote, qqqQuote, diaQuote] = await Promise.all([
    getMultipleQuotes(TW_STOCKS),
    fetchFinnhubQuote("SPY"), fetchFinnhubQuote("QQQ"), fetchFinnhubQuote("DIA"),
  ]);
  const toQ = (raw: FinnhubQuote | null, sym: string) => raw ? {
    symbol: sym, price: raw.c, change: raw.d, changePercent: raw.dp,
    high: raw.h, low: raw.l, open: raw.o, previousClose: raw.pc,
  } : null;
  return {
    twMarket: twQuotes,
    usIndices: { spy: toQ(spyQuote, "SPY"), qqq: toQ(qqqQuote, "QQQ"), dia: toQ(diaQuote, "DIA") },
  };
}

export interface NewsItem {
  headline: string; summary: string; url: string; source: string; datetime: number;
}

export async function getMarketNews(): Promise<NewsItem[]> {
  const cacheKey = "market:news";
  const cached = await getCached<NewsItem[]>(cacheKey);
  if (cached) return cached;
  try {
    const url = `${FINNHUB_BASE}/news?category=general&token=${FINNHUB_KEY}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    const items: NewsItem[] = (data || []).slice(0, 8).map((n: any) => ({
      headline: n.headline, summary: n.summary, url: n.url,
      source: n.source, datetime: n.datetime,
    }));
    await setCache(cacheKey, items, 300000);
    return items;
  } catch { return []; }
}
