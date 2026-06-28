import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "我的錢包 | FinPulse",
  description: "查看點數餘額、交易紀錄與充值",
};

export default function WalletLayout({ children }: { children: React.ReactNode }) {
  return children;
}
