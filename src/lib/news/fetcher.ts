import * as cheerio from "cheerio"
import type { NewsArticle } from "./types"

const MAX_AGE_MS = 4 * 60 * 60 * 1000 // 4 hours
const MAX_ARTICLES = 10

function googleNewsUrl(query: string, hl: string, gl: string): string {
  const q = encodeURIComponent(query)
  return `https://news.google.com/rss/search?q=${q}&hl=${hl}&gl=${gl}`
}

async function fetchGoogleNews(query: string, lang: "zh" | "en"): Promise<NewsArticle[]> {
  const hl = lang === "zh" ? "zh-TW" : "en-US"
  const gl = lang === "zh" ? "TW" : "US"
  const url = googleNewsUrl(query, hl, gl)

  let text: string
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(8000),
      headers: { "User-Agent": "Mozilla/5.0 FinPulse/1.0" },
    })
    text = await res.text()
  } catch {
    return []
  }

  const $ = cheerio.load(text, { xmlMode: true })
  const now = Date.now()
  const articles: NewsArticle[] = []

  $("item").each((_, el) => {
    if (articles.length >= MAX_ARTICLES) return false

    const title = $(el).find("title").text().trim()
    const link = $(el).find("link").text().trim()
    const pubDateStr = $(el).find("pubDate").text().trim()
    const source = $(el).find("source").text().trim() || "Google News"
    const snippet = $(el).find("description").text().trim().replace(/<[^>]*>/g, "").slice(0, 200)

    if (!title || !link) return

    const pubDate = pubDateStr ? new Date(pubDateStr) : null
    const age = pubDate ? now - pubDate.getTime() : MAX_AGE_MS + 1
    if (age > MAX_AGE_MS) return

    articles.push({ title, url: link, source, sourceLang: lang, publishedAt: pubDate, snippet })
  })

  return articles
}

export async function fetchIndustryNews(
  industry: string,
  enQuery: string,
  zhQuery: string,
): Promise<{ zh: NewsArticle[]; en: NewsArticle[] }> {
  const [zhArticles, enArticles] = await Promise.all([
    fetchGoogleNews(zhQuery, "zh"),
    fetchGoogleNews(enQuery, "en"),
  ])
  return { zh: zhArticles, en: enArticles }
}
