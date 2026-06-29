# FinPulse 開發計畫（Live 站驗證更新）

> 基於 product-optimization-2026-06-29.md 報告 + http://8.213.209.231/ 實際檢視
> 更新日期：2026-06-29

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

---

## 🔴 待修項目

### 1. 廣告版位灰色佔位 — P1
**Live 狀態**：首頁底部仍有灰色佔位區塊
**做法**：實際申請 AdSense 後替換

### 2. 外匯匯率格式 — P1
**Live 狀態**：TWD/USD 0.031，非台灣習慣 USD/TWD
**做法**：CommodityForexBar 內反查顯示

---

## 🟡 可暫緩項目（上線後迭代）

| 項目 | 優先級 | 說明 |
|------|--------|------|
| Push Notification | P2 | 需 Firebase Cloud Messaging |
| 每日摘要郵件 | P2 | 需郵件服務（SendGrid 等）|
| 即時資料取代 Mock | P2 | 原物料/產業分析目前為靜態資料 |

---

## 📋 行動順序

```
Step 1: 部署最新程式碼（含 漲幅排行 fix + 所有已修項目）
Step 2: 設定環境變數 (NEXT_PUBLIC_GA_ID, NEXTAUTH_SECRET, DATABASE_URL)
Step 3: 執行 prisma migrate dev（新增 PaymentOrder/WatchlistItem/ReferralReward 表）
Step 4: 驗證註冊流程、Watchlist、推薦機制正常運作
Step 5: 申請 AdSense、設定 GA4 轉換目標、提交 Search Console
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
```
