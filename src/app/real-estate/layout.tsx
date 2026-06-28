import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "亞洲房地產市場分析 | FinPulse",
  description: "日本、台灣、泰國、越南等亞洲國家房地產數據比較與分析",
};

export default function RealEstateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
