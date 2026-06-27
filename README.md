# FinPulse — 投資分析入口網站

全球股市、原物料、外匯、產業分析、房地產一站式投資分析平台。

## 技術棧

| 層級 | 技術 |
|------|------|
| 框架 | Next.js 16 (App Router) |
| UI | Tailwind CSS v4 + shadcn/ui |
| 圖表 | TradingView Lightweight Charts + Recharts |
| 資料庫 | PostgreSQL + Prisma 6 |
| 認證 | NextAuth.js v4 (JWT + Credentials) |
| 主題 | next-themes (深/淺色) |
| 部署 | Vercel / Docker |

## 功能模組

| 模組 | 路徑 | 說明 |
|------|------|------|
| 首頁 | `/` | 全球指數、漲跌排行、頭條新聞、原物料/匯率速覽 |
| 股市 | `/stocks` | K 線圖 + MA5/MA20/MA60 技術指標 |
| 原物料 | `/commodities` | 8 項商品即時報價 |
| 外匯 | `/forex` | 8 貨幣對 + 各國基準利率 |
| 產業分析 | `/industry` | 6 大產業龍頭股比較 + ETF |
| 篩選器 | `/screener` | 多條件篩選並排序 |
| 兌換商城 | `/exchange` | 點數兌換合作平台商品 |
| 錢包 | `/wallet` | 餘額、充值、交易紀錄 |
| 房地產 | `/real-estate` | 亞洲 12 國房價地圖/卡片/比較表 |

## 快速開始

```bash
# 安裝依賴
npm install

# 設定環境變數
cp .env.example .env.local

# 生成 Prisma client
npx prisma generate

# 啟動開發伺服器
npm run dev
```

## 環境變數

參見 `.env.example`：

| 變數 | 必要 | 說明 |
|------|------|------|
| `DATABASE_URL` | 否 | PostgreSQL 連線字串，無 DB 時使用 mock |
| `NEXTAUTH_SECRET` | 是 | JWT 簽名密鑰 |
| `NEXTAUTH_URL` | 是 | 網站 URL |
| `FINNHUB_API_KEY` | 否 | Finnhub API key，無 key 時使用 mock |

## 部署

### Vercel（建議）

```bash
npm i -g vercel
vercel --prod
```

環境變數需在 Vercel dashboard 設定，`vercel.json` 已配置。

### Docker

```bash
docker compose up -d
```

含 PostgreSQL，執行後自動啟動應用 + 資料庫。

### 手動

```bash
npm ci
npx prisma generate
npm run build
npm start
```
