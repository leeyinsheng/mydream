import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "個股篩選器 | FinPulse",
  description: "依市值、本益比、殖利率等條件篩選台股標的",
};

export default function ScreenerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
