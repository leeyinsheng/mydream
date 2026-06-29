# FinPulse 開發計畫（Live 站驗證更新）

> 基於 product-optimization-2026-06-29.md 報告 + http://8.213.209.231/ 實際檢視
> 更新日期：2026-06-29（第二輪優化已實作，待部署）

---

## ✅ 已實作項目（報告中已解決）

| 報告項目 | 優先級 | 對應實作 | Live 站驗證 |
|---------|--------|---------|------------|
| Landing Page Hero | ✅ W2 | 首頁 CTA 區塊 | ✅ 正常顯示 |
| SEO title | ✅ W2 | 各頁獨立 Metadata | ✅ 各頁獨立 |
| OAuth Google/LINE | ✅ W2 | next-auth providers | ✅ 登入頁有按鈕 |
| 新聞數據源 | ✅ W2 | Yahoo Finance API | ✅ 即時新聞 |
| GA4 分析 | ✅ W2 | GoogleAnalytics component | ✅ injected |
| Sitemap.xml | ✅ W2 | src/app/sitemap.ts | ✅ 可存取 |
| robots.txt | ✅ 剛補 | src/app/robots.ts | ✅ Live |
| Open Graph + Twitter Card | ✅ 剛補 | layout.tsx metadata | ✅ Live |
| PWA manifest + SW | ✅ W2 | public/manifest.json + sw.js | ✅ manifest link |
| Footer 政策頁面連結 | ✅ W3 | Footer 四頁連結 | ✅ 顯示 |
| 法律政策頁面內容 | ✅ W3 | Terms/Privacy/Disclaimer/FAQ | ✅ 有完整內容 |
| AdSense 元件 | ✅ W3 | AdsenseScript | ✅ injected |
| 充值金流驗證 | ✅ W3 | PaymentGateway 抽象層 | 需部署新 build |
| Admin 權限保護 | ✅ W1 | requireAdmin() | ✅ |
| 扣款檢查餘額 | ✅ W1 | createTransaction | ✅ |
| 兌換缺貨檢查 | ✅ W1 | stock === 0 | ✅ |
| 自選清單 Watchlist | ✅ W4 | Hook + API + 元件 | ⚠️ 需登入（正常）|
| 邀請推薦機制 | ✅ W4 | 完整實作 | ⚠️ 需登入驗證 |
| 個人化首頁 | ✅ W4 | 歡迎訊息 + Watchlist | ⚠️ 需登入驗證 |

---

## ✅ 本輪已修復項目

| 問題 | 原因 | 處理 |
|------|------|------|
| 漲幅排行空白 | Live 站資料全部為負值，`changePercent > 0` 無匹配 | GainersLosers 改為：無正值時取 sorted 前 5 名 |
| 註冊頁「空白」誤報 | 純文字爬取遺漏 JS 渲染的 `<input>` 元素 | HTML 證實 4 個欄位正常渲染 |
| 外匯匯率格式 | TWD/USD 0.031 非台灣習慣 | FOREX_INFO 改為 USD/TWD、USD/JPY 等，rate 不再反算 |
| 產業模塊 LLM 自動化 | 全靜態 Mock 資料 | DeepSeek API + Google News RSS 中英新聞，node-cron 每日 08:00 更新 |
| refresh 權限保護 | 未設權限 | 加入 requireAdmin() 保護 |

---

## 🔴 待修項目

### 1. 廣告版位灰色佔位 — P1
**Live 狀態**：首頁底部仍有灰色佔位區塊
**做法**：實際申請 AdSense 後替換

### 2. ~~外匯匯率格式 — P1~~ ✅ 已修復
**Live 狀態**：等待部署後生效
**做法**：FOREX_INFO 對亞洲貨幣改為 USD/TWD、USD/JPY 格式

---

## 🟡 可暫緩項目（上線後迭代）

| 項目 | 優先級 | 說明 |
|------|--------|------|
| Push Notification | P2 | 需 Firebase Cloud Messaging |
| 每日摘要郵件 | P2 | 需郵件服務（SendGrid 等）|

---

## 🟢 產業模塊 ✅ 已實作（LLM 自動化）

### 方案：LLM（DeepSeek）+ Google News RSS 中英雙語

```
node-cron 每日 08:00
  → Google News RSS 6 產業 × (中+英) = 12 次請求
  → DeepSeek API 產出 JSON 分析
  → 寫入 PostgreSQL
  → 前端 from API，回退靜態文案
```

### 新增檔案

| 檔案 | 說明 |
|------|------|
| `src/lib/news/fetcher.ts` | Google News RSS 爬取 |
| `src/lib/news/types.ts` | 型別定義 |
| `src/lib/industry/config.ts` | 6 產業關鍵字+ticker |
| `src/lib/industry/generator.ts` | DeepSeek prompt + DB 寫入 |
| `src/lib/industry/cron.ts` | node-cron 排程 |
| `src/instrumentation.ts` | Next.js 啟動註冊 cron |
| `src/app/api/industry/analysis/route.ts` | GET 回傳 DB |
| `src/app/api/industry/refresh/route.ts` | POST 管理員手動刷新 |

### 剩餘改善

1. 龍頭股價格串 Yahoo Finance 即時化（市值/本益比暫維持靜態）
2. 待 DeepSeek API Key 上線後產出第一版分析

---

## 📋 行動順序

```
Step 1: 設定 DEEPSEEK_API_KEY 至伺服器 .env.local
Step 2: git push → 伺服器 git pull → npm ci → npx prisma generate
Step 3: npx prisma db push（同步 IndustryAnalysis 表）
Step 4: npm run build → pm2 restart finpulse
Step 5: 驗證產業頁顯示 LLM 分析、外匯匯率格式正確
Step 6: 申請 AdSense、設定 GA4 轉換目標、提交 Search Console
```

## 🔧 環境變數檢查清單（部署前）

```
AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET          — OAuth
AUTH_LINE_ID / AUTH_LINE_SECRET               — OAuth
NEXT_PUBLIC_GA_ID                             — Google Analytics
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID              — AdSense
MOCK_PAYMENT_ENABLED                          — 開發環境設 true，正式移除
NEXTAUTH_SECRET                               — Session 加密
DATABASE_URL                                  — PostgreSQL
DEEPSEEK_API_KEY                              — DeepSeek 產業分析 LLM（免費 500 萬 tokens）
```
