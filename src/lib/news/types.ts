export interface NewsArticle {
  title: string
  url: string
  source: string
  sourceLang: "zh" | "en"
  publishedAt: Date | null
  snippet: string
}

export type IndustryKey =
  | "半導體"
  | "金融"
  | "生技"
  | "航運"
  | "電信"
  | "鋼鐵"
