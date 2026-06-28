import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "隱私政策 | FinPulse",
  description: "FinPulse 隱私政策 — 個人資料收集、Cookie 使用、用戶權利說明",
};

export default function PrivacyPage() {
  return (
    <article className="prose prose-sm dark:prose-invert max-w-none space-y-4">
      <h1>隱私政策</h1>
      <p className="text-muted-foreground">最後更新：2026 年 6 月 29 日</p>

      <h2>1. 收集的資料</h2>
      <p>本平台收集以下個人資料：<br />
      • Email 地址（註冊必要）<br />
      • 用戶名稱（可選擇性提供）<br />
      • 密碼（經過雜湊加密儲存）<br />
      • Google / LINE 帳戶資訊（使用 OAuth 登入時）<br />
      • 頁面瀏覽數據（透過 Google Analytics）</p>

      <h2>2. 資料使用</h2>
      <p>收集的資料用於：<br />
      • 提供與維護服務（登入、充值、兌換）<br />
      • 改善用戶體驗與產品功能<br />
      • 分析使用趨勢（匿名化統計資料）<br />
      • 遵守法律義務</p>

      <h2>3. Cookie 使用</h2>
      <p>本平台使用必要的 Cookie 以維持登入狀態與服務運作，以及 Google Analytics Cookie 進行流量分析。您可以透過瀏覽器設定管理 Cookie 偏好。</p>

      <h2>4. 資料分享</h2>
      <p>本平台不會將您的個人資料出售給第三方。資料分享限於：<br />
      • Google Analytics（匿名化瀏覽數據）<br />
      • Google AdSense（匿名化廣告投放）<br />
      • 金流服務商（充值交易必要資訊）<br />
      • 法律要求之政府機關</p>

      <h2>5. 資料安全</h2>
      <p>我們採用業界標準的安全措施保護您的個人資料，包括 HTTPS 加密傳輸、密碼雜湊儲存、資料庫存取控制。但請注意，任何網路傳輸均無法保證 100% 安全。</p>

      <h2>6. 用戶權利</h2>
      <p>您有權：<br />
      • 查閱、修正您提供的個人資料<br />
      • 要求刪除您的帳戶與相關資料<br />
      • 拒絕 Google Analytics 追蹤（可安裝瀏覽器封鎖外掛）<br />
      如需行使上述權利，請透過客服管道聯繫我們。</p>

      <h2>7. 資料保留</h2>
      <p>我們在您持有帳戶期間保留您的個人資料。帳戶刪除後，必要資料（如交易紀錄）將依法保留一定期間。</p>

      <h2>8. 政策變更</h2>
      <p>本隱私政策如有變更，將於本頁面公告。重大變更將以 Email 通知。</p>

      <h2>9. 聯絡我們</h2>
      <p>如有隱私相關問題，請透過客服管道聯繫我們。</p>
    </article>
  );
}
