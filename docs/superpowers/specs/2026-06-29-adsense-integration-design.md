# AdSense 廣告串接設計

> 日期：2026-06-29
> 對應：產品優化報告 — 第三週「變現啟動」— 廣告串接

## 目標

在 FinPulse 各頁面嵌入 Google AdSense 廣告，開始產生營收。

## 方案

使用 **AdSense Auto Ads（自動廣告）**，Google 自動分析頁面結構並在最佳位置插入廣告。

## 架構

### 環境變數

```
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-xxxxxxxxxxxxxx
```

未設定時不載入任何廣告 script（開發環境安全）。

### 元件

| 元件 | 路徑 | 職責 |
|------|------|------|
| `<AdsenseScript />` | `src/components/ads/AdsenseScript.tsx` | 使用 `next/script` 延遲載入 Auto Ads script；publisher ID 為空時 render null |
| Layout 整合 | `src/app/layout.tsx` | 在 `<head>` 加入 `<AdsenseScript />` |

### 流程

1. `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` 未設定 → 不載入任何廣告
2. 設定後 → Auto Ads script (adsbygoogle.js) 透過 `next/script` strategy="afterInteractive" 載入
3. Google Auto Ads 自動在所有頁面找最佳位置插入廣告
4. 既有灰色「廣告版位」佔位區塊保留，Auto Ads 可自行決定是否覆蓋

## 不做的

- 不建立手動 ad unit component（Auto Ads 已足夠）
- 不修改各頁面 JSX（Auto Ads 自動處理位置）
- 不申請 AdSense 帳戶（需使用者自行申請）

## 驗收條件

- [ ] `NEXT_PUBLIC_ADSENSE_PUBLISHER_ID` 未設定時，頁面無任何廣告 script
- [ ] 設定 publisher ID 後，頁面載入 `adsbygoogle.js`
- [ ] `lint` 無錯誤
- [ ] `tsc --noEmit` 無錯誤
