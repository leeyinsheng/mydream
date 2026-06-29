import { db } from "@/lib/db"
import { INDUSTRIES } from "./config"
import { fetchIndustryNews } from "@/lib/news/fetcher"
import { getMultipleQuotes } from "@/lib/market-data"

const DEEPSEEK_API = "https://api.deepseek.com/v1/chat/completions"
const MODEL = "deepseek-chat"

interface AnalysisContent {
  outlook: string
  updates: string[]
  drivers: string[]
  risks: string[]
  sourceCount: { zh: number; en: number }
  updatedAt: string
}

function buildPrompt(
  industry: string,
  zhNews: { title: string; snippet: string }[],
  enNews: { title: string; snippet: string }[],
  quotes: { symbol: string; price: number; changePercent: number }[],
): string {
  const zhBlock = zhNews.map((n) => `- ${n.title}\n  ${n.snippet}`).join("\n")
  const enBlock = enNews.map((n) => `- ${n.title}\n  ${n.snippet}`).join("\n")
  const priceBlock = quotes.map((q) => `${q.symbol} $${q.price} (${q.changePercent >= 0 ? "+" : ""}${q.changePercent.toFixed(2)}%)`).join("\n")

  return `你是一位專業的金融產業分析師。請根據以下中文與英文新聞資料，以及最新股價數據，針對「${industry}」產業撰寫客觀的市場分析。

請特別注意：
1. 平衡參考中文與英文來源的觀點
2. 分析必須客觀，不偏袒任何一方
3. 以繁體中文輸出

=== 中文新聞 ===
${zhBlock || "（暫無）"}

=== 英文新聞 ===
${enBlock || "（暫無）"}

=== 最新股價 ===
${priceBlock || "（暫無）"}

請輸出以下 JSON 格式（不要有其他文字）：
{
  "outlook": "本週產業展望（150-200字）",
  "updates": ["3-5 條近期重要事件，每條30-60字"],
  "drivers": ["3 條關鍵驅動因子，每條30-60字"],
  "risks": ["3 條風險因素，每條30-60字"]
}`
}

async function callDeepSeek(prompt: string): Promise<AnalysisContent | null> {
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) {
    console.warn("[Industry] DEEPSEEK_API_KEY not set, skipping generation")
    return null
  }

  try {
    const res = await fetch(DEEPSEEK_API, {
      method: "POST",
      signal: AbortSignal.timeout(30000),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content: "你是專業的金融產業分析師。請根據中英文新聞與股價數據，針對指定產業撰寫客觀的市場分析。只輸出 JSON，不要包含任何其他文字。",
          },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 1500,
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error(`[Industry] DeepSeek API error ${res.status}:`, errText)
      return null
    }

    const json = await res.json()
    const text = json.choices?.[0]?.message?.content
    if (!text) return null

    return JSON.parse(text) as AnalysisContent
  } catch (err) {
    console.error("[Industry] DeepSeek call failed:", err)
    return null
  }
}

export async function generateIndustryAnalysis(): Promise<void> {
  console.log("[Industry] Starting daily analysis generation...")

  for (const ind of INDUSTRIES) {
    try {
      console.log(`[Industry] Processing ${ind.key}...`)

      const { zh, en } = await fetchIndustryNews(ind.key, ind.enQuery, ind.zhQuery)
      const quotes = await getMultipleQuotes(ind.tickers)
      const quoteData = quotes.map((q) => ({
        symbol: q.symbol,
        price: q.price,
        changePercent: q.changePercent,
      }))

      const prompt = buildPrompt(ind.key, zh, en, quoteData)
      const result = await callDeepSeek(prompt)

      if (!result) {
        console.warn(`[Industry] Skipping ${ind.key}: no result from LLM`)
        continue
      }

      const content: AnalysisContent = {
        ...result,
        sourceCount: { zh: zh.length, en: en.length },
        updatedAt: new Date().toISOString(),
      }

      const jsonContent = JSON.parse(JSON.stringify(content))
      await db.industryAnalysis.upsert({
        where: { industry: ind.key },
        update: { content: jsonContent },
        create: { industry: ind.key, content: jsonContent },
      })

      console.log(`[Industry] ${ind.key} saved (zh:${zh.length} en:${en.length})`)
    } catch (err) {
      console.error(`[Industry] Error processing ${ind.key}:`, err)
    }
  }

  console.log("[Industry] Daily analysis generation complete.")
}
