import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "產業分析 | FinPulse",
  description: "半導體、金融、生技、航運等產業分析與龍頭股比較",
};

export default function IndustryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
