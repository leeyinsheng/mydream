import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "點數充值 | FinPulse",
  description: "購買點數，用於兌換合作平台商品",
};

export default function RechargeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
