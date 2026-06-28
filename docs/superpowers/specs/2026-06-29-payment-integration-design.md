# 金流串接設計

> 日期：2026-06-29
> 對應：產品優化報告 — 第三週「變現啟動」— 金流串接

## 目標

將目前虛擬的充值流程（dev 直接 POST 加點、production 503）改為：
1. 用戶選金額 → 2. 後端建立 PaymentOrder → 3. 導向金流頁付款 → 4. Webhook 回調自動加點

採用抽象 PaymentGateway 介面設計，未來可抽換不同金流商。

## 架構

### PaymentOrder Prisma Model

```prisma
model PaymentOrder {
  id             String    @id @default(cuid())
  userId         String
  user           User      @relation(fields: [userId], references: [id])
  amount         Int
  currency       String    @default("TWD")
  status         String    @default("pending") // pending | paid | failed | expired
  gateway        String    // mock | newebpay | ecpay | linepay
  gatewayOrderId String?   // 金流端訂單編號
  tradeNo        String?   // 金流端交易序號
  paidAt         DateTime?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
}
```

### PaymentGateway 介面 (`src/lib/payment/types.ts`)

```typescript
interface CreatePaymentResult {
  paymentUrl: string;     // 導向金流付款頁的 URL
  gatewayOrderId: string; // 金流端的訂單編號
}

interface VerifyResult {
  valid: boolean;
  tradeNo: string;
}

interface PaymentGateway {
  name: string;
  createPayment(order: { id: string; amount: number; currency: string }): Promise<CreatePaymentResult>;
  verifyWebhook(payload: unknown, headers: Record<string, string>): Promise<VerifyResult>;
}
```

### Mock Gateway (`src/lib/payment/mock-gateway.ts`)

開發用，自動通過付款：

- `createPayment`：回傳模擬的付款 URL（含 callback token）
- `verifyWebhook`：永遠回傳 valid
- 付款 URL 導回 `/api/payment/mock-return?orderId=xxx`，由一個 mock return handler 自動標記 paid

### Gateway Factory (`src/lib/payment/index.ts`)

```typescript
function getPaymentGateway(): PaymentGateway
```

從 `NEXT_PAYMENT_GATEWAY` 環境變數決定實作，預設 `mock`。

### API Routes

| Route | Method | 功能 |
|-------|--------|------|
| `/api/payment/create-order` | POST | 驗證金額 → 建立 PaymentOrder → gateway.createPayment() → 回傳 paymentUrl |
| `/api/payment/webhook` | POST | gateway.verifyWebhook() → 更新 PaymentOrder → createTransaction(deposit) |
| `/api/payment/callback` | GET | 金流付款完成後導回，顯示成功/失敗狀態 |
| `/api/payment/mock-return` | GET | Mock 專用：模擬付款成功 + 觸發 deposit |

### 前端異動

**`/recharge/page.tsx`**：改為呼叫 `/api/payment/create-order`，收到 paymentUrl 後 redirect。

## 環境變數

```
NEXT_PAYMENT_GATEWAY=mock
# 未來真實金流需要：
# NEPAY_MERCHANT_ID=
# NEPAY_HASH_KEY=
# NEPAY_HASH_IV=
```

## 不做的

- 不串接任何真實金流（需使用者自行申請 API keys）
- 不刪除舊的 `POST /api/wallet/recharge`（保留 dev 測試用，production 仍回 503）

## 驗收條件

- [ ] `POST /api/payment/create-order` 建立 PaymentOrder，回傳 paymentUrl
- [ ] Mock 模式下造訪 paymentUrl 自動完成付款，餘額增加
- [ ] `GET /api/payment/callback` 顯示付款結果
- [ ] `lint` 無錯誤
- [ ] `tsc --noEmit` 無錯誤
