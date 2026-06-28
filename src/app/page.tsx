import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { IndexCard } from "@/components/market/IndexCard";
import { GainersLosers } from "@/components/market/GainersLosers";
import { NewsFeed } from "@/components/market/NewsFeed";
import { CommodityForexBar } from "@/components/market/CommodityForexBar";
import { getGlobalIndices, getMarketOverview, getMarketNews } from "@/lib/market-data";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "FinPulse - 免費全球股市、外匯、原物料分析工具",
  description: "即時全球指數、台股漲跌排行、外匯匯率、原物料價格 — 免費投資分析平台，專為手機用戶設計。",
  openGraph: { title: "FinPulse - 免費全球股市分析", description: "即時全球指數、台股漲跌排行，免費投資分析平台" },
};

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const [indices, overview, news] = await Promise.all([
    getGlobalIndices(),
    getMarketOverview(),
    getMarketNews(),
  ]);
  const headline = news[0];
  const restNews = news.slice(1);

  return (
    <div className="space-y-4">
      {!session && (
        <section className="bg-gradient-to-br from-primary/10 via-background to-primary/5 rounded-xl p-6 text-center space-y-3">
          <h2 className="text-xl font-bold">免費全球股市、外匯、原物料分析工具</h2>
          <p className="text-sm text-muted-foreground">加入 FinPulse，掌握市場脈動</p>
          <Link href="/register">
            <button className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold text-sm">
              免費註冊
            </button>
          </Link>
          <p className="text-xs text-muted-foreground">或 <Link href="/login" className="text-primary underline">登入</Link></p>
        </section>
      )}

      {/* 全球指數 */}
      <section>
        <h2 className="text-sm font-semibold mb-2">全球指數</h2>
        <div className="grid grid-cols-2 gap-2">
          {indices.map((idx) => (
            <IndexCard
              key={idx.symbol}
              flag={idx.flag}
              name={idx.name}
              country={idx.country}
              price={idx.price}
              change={idx.change}
              changePercent={idx.changePercent}
              href={`/stocks/${encodeURIComponent(idx.symbol)}`}
            />
          ))}
        </div>
      </section>

      {/* 頭條新聞 */}
      {headline && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-3">
            <Link href={headline.url} target="_blank" className="block">
              <p className="text-xs text-primary font-semibold uppercase mb-0.5">頭條</p>
              <h3 className="text-sm font-bold leading-snug">{headline.headline}</h3>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{headline.source} · {new Date(headline.datetime * 1000).toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" })}</p>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* 漲跌排行 + 新聞 */}
      <section className="space-y-3">
        <GainersLosers quotes={overview.twMarket} />
        <NewsFeed news={restNews} />
      </section>

      {/* 外匯速覽 */}
      <section>
        <h2 className="text-sm font-semibold mb-2">外匯速覽</h2>
        <CommodityForexBar />
      </section>

      {/* 廣告 */}
      <div className="h-16 bg-muted rounded-lg flex items-center justify-center text-xs text-muted-foreground">廣告版位</div>
    </div>
  );
}
