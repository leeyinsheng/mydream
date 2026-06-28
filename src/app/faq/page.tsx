import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "常見問題 | FinPulse",
  description: "FinPulse 常見問題 — 充值、兌換、帳戶、點數相關問題解答",
};

const FAQS = [
  {
    q: "如何充值點數？",
    a: "登入後點擊錢包圖示，進入錢包頁面後選擇「充值」，選擇金額後依照指示完成付款。目前提供 Mock 測試模式，正式金流將於近期上線。",
  },
  {
    q: "點數可以換現金嗎？",
    a: "點數僅限於 FinPulse 平台內兌換指定商品或服務，不具現金價值，無法轉讓或兌換現金。",
  },
  {
    q: "兌換後多久可以收到序號？",
    a: "兌換完成後會立即顯示兌換序號（Redemption Code），您可以在「兌換紀錄」頁面查看所有歷史訂單與序號。",
  },
  {
    q: "兌換商品可以退貨嗎？",
    a: "商品兌換一經完成即不可取消或退貨。若合作夥伴無法提供商品，請聯絡客服協助處理。",
  },
  {
    q: "忘記密碼怎麼辦？",
    a: "目前尚未提供密碼重設功能，建議使用 Google 或 LINE 一鍵登入。若需協助，請聯絡客服。",
  },
  {
    q: "如何刪除我的帳戶？",
    a: "目前尚無自助刪除帳戶功能。如有需要，請透過客服管道聯繫我們，我們將協助處理。",
  },
  {
    q: "市場資料多久更新一次？",
    a: "指數、外匯、原物料價格在交易時間內每數秒至數分鐘更新一次，實際更新頻率取決於第三方資料源。新聞內容則於發布後同步顯示。",
  },
  {
    q: "服務條款或隱私政策變更時會通知嗎？",
    a: "重大變更將於本平台公告，必要時將以 Email 通知。建議定期查閱相關政策頁面。",
  },
];

export default function FAQPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">常見問題</h1>
      <div className="space-y-2">
        {FAQS.map((faq, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <p className="font-semibold text-sm mb-1">{faq.q}</p>
              <p className="text-sm text-muted-foreground">{faq.a}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
