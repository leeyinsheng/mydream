# FinPulse 開發計畫（更新版）

> 對照 product-optimization-2026-06-29.md 報告，逐項確認完成狀態

---

## ✅ 已實作項目（報告中已解決）

| 報告項目 | 優先級 | 對應實作 |
|---------|--------|---------|
| Landing Page Hero | ✅ W2 | 首頁 CTA 區塊 |
| SEO title | ✅ W2 | 各頁獨立 Metadata |
| OAuth Google/LINE | ✅ W2 | next-auth providers |
| 新聞數據源 | ✅ W2 | Yahoo Finance API |
| GA4 分析 | ✅ W2 | GoogleAnalytics component + layout 整合 |
| Sitemap.xml | ✅ W2 | src/app/sitemap.ts |
| PWA manifest + SW | ✅ W2 | public/manifest.json + sw.js |
| Footer 政策頁面連結 | ✅ W3 | Footer 四頁連結 |
| 法律政策頁面內容 | ✅ W3 | Terms/Privacy/Disclaimer/FAQ |
| AdSense 元件 | ✅ W3 | AdsenseScript component + layout 整合 |
| 充值金流驗證 | ✅ W3 | PaymentGateway 抽象層 + MockGateway |
| Admin 權限保護 | ✅ W1 | requireAdmin() middleware |
| 扣款檢查餘額 | ✅ W1 | createTransaction balance >= amount + gte guard |
| 兌換缺貨檢查 | ✅ W1 | stock === 0 保護 |
| 自選清單 Watchlist | ✅ W4 | Hook + API + 元件 + 頁面 |
| 邀請推薦機制 | ✅ W4 | ReferralReward model + API + 註冊欄位 + 個人中心 |
| 個人化首頁 | ✅ W4 | 登入用戶歡迎訊息 + Watchlist 摘要 |

---

## 🔴 待修項目（部署前應完成）

### 1. robots.txt — P0（5 分鐘）
**狀態**：❌ 未實作
**影響**：Google 無法正確爬取網站結構
**做法**：`src/app/robots.ts`，參考 sitemap.ts 路徑

### 2. Open Graph 標籤 — P0（5 分鐘）
**狀態**：❌ 未實作
**影響**：LINE/Facebook 分享無預覽圖，降低社群傳播效果
**做法**：layout.tsx `metadata.openGraph` 補上 title/description/image

### 3. 註冊頁表單問題（Live 站）— P0
**狀態**：⚠️ 待診斷（本地程式碼正確，疑似部署/建置問題）
**建議**：部署後至 `http://8.213.209.231/register` 確認 Client Component 正確 hydrate

### 4. AdSense 廣告版位 — P1
**狀態**：⚠️ 僅完成 Auto Ads 腳本注入，手動廣告版位仍為灰色佔位
**做法**：部署後實際申請 AdSense，依審核結果放置廣告單元

---

## 🟡 可暫緩項目（上線後迭代）

| 項目 | 優先級 | 說明 |
|------|--------|------|
| 外匯匯率格式改善 | P1 | TWD/USD → USD/TWD，不影響功能 |
| Push Notification | P2 | 需 Firebase Cloud Messaging |
| 每日摘要郵件 | P2 | 需郵件服務（SendGrid 等）|
| 即時資料取代 Mock | P2 | 原物料/產業分析目前為靜態資料 |

---

## 📋 行動順序

```
Step 1: robots.ts + Open Graph metadata       (10 min)
Step 2: 部署至 Live 站                          (30 min)
Step 3: 驗證註冊頁、漲幅排行、Watchlist、推薦機制   (30 min)
Step 4: 設定環境變數 (GA_ID, AdSense, MOCK_PAYMENT_ENABLED)
Step 5: 檢查放大註冊轉換（分析 GA 數據後優化）
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

---

> 更新日期：2026-06-29
> 對照報告：product-optimization-2026-06-29.md
