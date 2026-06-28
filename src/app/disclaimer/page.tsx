import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "免責聲明 | FinPulse",
  description: "FinPulse 免責聲明 — 投資警語與資料準確性免責說明",
};

export default function DisclaimerPage() {
  return (
    <article className="prose prose-sm dark:prose-invert max-w-none space-y-4">
      <h1>免責聲明</h1>
      <p className="text-muted-foreground">最後更新：2026 年 6 月 29 日</p>

      <h2>投資警語</h2>
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-sm">
        <p className="font-semibold">⚠ 重要提醒</p>
        <p>FinPulse 提供的所有資訊僅供參考，不構成任何投資建議、推薦或要約。投資涉及風險，包括可能損失本金，過去績效不代表未來表現。</p>
        <p className="mt-2">用戶應獨立判斷並諮詢專業財務顧問，本平台不對任何投資決策或損失負責。</p>
      </div>

      <h2>資料來源與準確性</h2>
      <p>本平台之市場數據來自第三方資料源（包括但不限於 Yahoo Finance、Finnhub、ExchangeRate-API）。我們盡力確保資料即時與準確，但無法保證其完整性、正確性或即時性。資料可能因來源端延遲、技術問題或市場休市而有所差異。</p>

      <h2>服務中斷</h2>
      <p>本平台不保證服務永不中斷。因第三方 API 不穩定、網路問題、系統維護或不可抗力事件導致的服務中斷或資料遺失，本平台不負擔賠償責任。</p>

      <h2>外部連結</h2>
      <p>本平台可能包含外部網站連結，本平台不對外部網站的內容或隱私實務負責。</p>

      <h2>點數與兌換</h2>
      <p>點數不具現金價值，不得轉讓或兌換現金。商品兌換為最終交易，除商品無法兌換外，不接受退貨或退款。詳細規範請參閱服務條款。</p>

      <h2>法律效力</h2>
      <p>本免責聲明如有部分條款無效，其餘條款仍具有法律效力。</p>
    </article>
  );
}
