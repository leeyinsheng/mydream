# 自選清單 Watchlist 設計

> 日期：2026-06-29
> 對應：產品優化報告 — 第四週「留存強化」— 自選清單

## 目標

讓用戶可以追蹤關注的股票/指數/外匯/原物料，提升每日回訪率。

## Prisma Model

```prisma
model WatchlistItem {
  id        String   @id @default(cuid())
  userId    String
  symbol    String
  name      String
  type      String   // stock | index | forex | commodity
  order     Int      @default(0)
  addedAt   DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, symbol])
  @@index([userId])
}
```

User model 加 `watchlistItems` 關聯。

## API Routes

| Method | Route | 功能 |
|--------|-------|------|
| GET | `/api/watchlist` | 回傳用戶自選列表 (依 order 排序)，附即時價格 |
| POST | `/api/watchlist` | Body `{ symbol, name, type }` → 加入自選 |
| DELETE | `/api/watchlist?symbol=X` | 移除自選 |

## 前端元件

| 元件 | 位置 | 說明 |
|------|------|------|
| `WatchlistSection` | 首頁頂部（登入用戶） | 顯示 3-4 個卡片 + 點數/查看更多 |
| `WatchlistStar` | 個股頁 / 指數卡片 | 星號切換，使用 `useWatchlist` hook |
| `useWatchlist` | client hook | 統一管理自選狀態（SWR 或 useState + context） |
| `/watchlist` page | 獨立管理頁 | 列表 + 搜尋加入 + 刪除 |

## 不做的

- 不支援拖曳排序（order 欄位保留但第一期只做基本排序）
- 不支援群組/分類功能
- 不支援價格通知

## 驗收條件

- [ ] 個股頁星號可加入/移出自選
- [ ] 首頁顯示「我的自選」區塊（登入用戶）
- [ ] `/watchlist` 管理頁列出所有自選，可刪除
- [ ] lint + tsc 無錯誤
