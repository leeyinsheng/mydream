import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "登入 | FinPulse",
  description: "登入 FinPulse 投資分析平台",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
