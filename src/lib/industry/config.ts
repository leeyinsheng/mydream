export interface IndustryConfig {
  key: string
  zhName: string
  enQuery: string
  zhQuery: string
  tickers: string[]
}

export const INDUSTRIES: IndustryConfig[] = [
  {
    key: "半導體",
    zhName: "半導體",
    enQuery: "semiconductor industry Taiwan AI chips 2026",
    zhQuery: "半導體 產業",
    tickers: ["2330.TW", "2454.TW", "2303.TW", "3711.TW"],
  },
  {
    key: "金融",
    zhName: "金融",
    enQuery: "Taiwan banking financial sector 2026",
    zhQuery: "金融 銀行 產業",
    tickers: ["2881.TW", "2882.TW", "2891.TW", "2886.TW"],
  },
  {
    key: "生技",
    zhName: "生技",
    enQuery: "biotech pharmaceutical Taiwan 2026",
    zhQuery: "生技 醫療 產業",
    tickers: ["6446.TW", "4743.TW", "4147.TW", "4736.TW"],
  },
  {
    key: "航運",
    zhName: "航運",
    enQuery: "shipping container freight logistics 2026",
    zhQuery: "航運 貨櫃 散裝",
    tickers: ["2603.TW", "2609.TW", "2615.TW", "2606.TW"],
  },
  {
    key: "電信",
    zhName: "電信",
    enQuery: "telecommunications Taiwan 5G 2026",
    zhQuery: "電信 5G 產業",
    tickers: ["2412.TW", "3045.TW", "4904.TW"],
  },
  {
    key: "鋼鐵",
    zhName: "鋼鐵",
    enQuery: "steel industry Taiwan 2026",
    zhQuery: "鋼鐵 產業",
    tickers: ["2002.TW", "2014.TW", "2023.TW"],
  },
]
