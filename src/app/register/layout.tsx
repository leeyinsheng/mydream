import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "註冊 | FinPulse",
  description: "免費註冊，開始使用 FinPulse 投資分析工具",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
