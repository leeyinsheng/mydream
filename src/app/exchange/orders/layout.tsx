import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "兌換紀錄 | FinPulse",
  description: "查看兌換商品歷史紀錄",
};

export default function ExchangeOrdersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
