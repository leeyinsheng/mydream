# 邀請推薦機制設計

> 日期：2026-06-29
> 對應：產品優化報告 — 第四週「留存強化」— 邀請推薦機制

## 目標

讓用戶可邀請朋友註冊 FinPulse，雙方獲得獎勵點數，實現病毒式增長。

## Prisma Schema

### User model 新增欄位

```prisma
model User {
  // ... 現有欄位
  referralCode  String?  @unique  // 8 碼邀請碼，註冊時自動產生
  referredBy    String?           // 邀請人的 referralCode
  referralCount Int      @default(0)
}
```

### ReferralReward model (新)

```prisma
model ReferralReward {
  id            String   @id @default(cuid())
  inviterId     String
  inviteeId     String
  pointsAwarded Int      @default(50)
  createdAt     DateTime @default(now())
  inviter       User     @relation("ReferralInviter", fields: [inviterId], references: [id])
  invitee       User     @relation("ReferralInvitee", fields: [inviteeId], references: [id])

  @@unique([inviterId, inviteeId])
  @@index([inviterId])
}
```

## 流程

1. **註冊時**：用戶填寫 Email、密碼、可選填「邀請碼」
2. **註冊成功後**：
   - 自動產生 8 碼推薦碼（格式：`FIN-` + 6 碼大寫英數字）
   - 若有填寫邀請碼，查找擁有該碼的用戶：
     - 獎勵邀請人 50 點（`createTransaction(inviterId, "deposit", 50, "邀請獎勵")`）
     - 獎勵新用戶 50 點（`createTransaction(newUserId, "deposit", 50, "邀請獎勵")`）
     - 建立 ReferralReward 紀錄
     - 邀請人 referralCount +1
3. **個人中心**：顯示「我的推薦碼」、「已邀請人數」、「累積獎勵點數」

## API Routes

| Method | Route | 功能 |
|--------|-------|------|
| GET | `/api/referral/stats` | 回傳 { referralCode, referralCount, totalRewards } |
| POST | `/api/auth/register` | 加入 `referralCode` 參數處理 |

## 前端

- `register/page.tsx`：表單加入「邀請碼（選填）」欄位
- `src/app/profile/page.tsx` 或個人中心：顯示推薦碼、邀請人數、獎勵總計（如無此頁則新增）

## 不做的

- 不製作推薦排行榜
- 不支援 Email 直接發送邀請信
- 不製作分享到 LINE/Facebook 的分享按鈕（Web Share API 可後續補上）

## 驗收條件

- [ ] 註冊時填寫有效邀請碼，雙方各得 50 點
- [ ] 註冊時不填邀請碼，正常註冊不影響
- [ ] 無效邀請碼不阻擋註冊（忽略邀請碼）
- [ ] 個人中心顯示推薦碼與統計
- [ ] lint + tsc 無錯誤
