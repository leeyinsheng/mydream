import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "兌換商城 | FinPulse",
  description: "使用點數兌換合作平台商品，包含便利商店禮券、影音平台月卡等",
};

export default function ExchangeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
