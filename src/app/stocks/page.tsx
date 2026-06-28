import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "個股報價 | FinPulse",
  description: "全球個股即時報價與K線圖",
};

export default function StocksPage() {
  redirect("/");
}
