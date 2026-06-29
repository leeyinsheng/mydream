import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { SessionProvider } from "@/providers/SessionProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { AdsenseScript } from "@/components/ads/AdsenseScript";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "FinPulse - 投資分析入口網站",
  description: "全球股市、原物料、外匯、產業分析一站式平台",
  openGraph: {
    title: "FinPulse - 投資分析入口網站",
    description: "全球股市、原物料、外匯、產業分析一站式平台",
    type: "website",
    locale: "zh_TW",
    siteName: "FinPulse",
  },
  twitter: {
    card: "summary_large_image",
    title: "FinPulse - 投資分析入口網站",
    description: "全球股市、原物料、外匯、產業分析一站式平台",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`${inter.variable} font-sans bg-background`}>
        <SessionProvider>
          <ThemeProvider>
            <div className="flex flex-col min-h-screen max-w-[430px] mx-auto border-x border-border">
              <Header />
              <main className="flex-1 px-3 py-3">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
        </SessionProvider>
        <GoogleAnalytics />
        <AdsenseScript />
      </body>
    </html>
  );
}
