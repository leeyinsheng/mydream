import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { IndexCard } from "@/components/market/IndexCard";
import { GainersLosers } from "@/components/market/GainersLosers";
import { NewsFeed } from "@/components/market/NewsFeed";
import { CommodityForexBar } from "@/components/market/CommodityForexBar";
import { getMarketOverview, getMarketNews } from "@/lib/market-data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [overview, news] = await Promise.all([getMarketOverview(), getMarketNews()]);
  const headline = news[0];
  const restNews = news.slice(1);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <section>
        <h2 className="text-lg font-semibold mb-3">全球指數</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <IndexCard name="台股加權" price={overview.twMarket[0]?.price || 0} change={overview.twMarket[0]?.change || 0} changePercent={overview.twMarket[0]?.changePercent || 0} />
          <IndexCard name="S&P 500" price={overview.usIndices.spy?.price || 0} change={overview.usIndices.spy?.change || 0} changePercent={overview.usIndices.spy?.changePercent || 0} />
          <IndexCard name="NASDAQ" price={overview.usIndices.qqq?.price || 0} change={overview.usIndices.qqq?.change || 0} changePercent={overview.usIndices.qqq?.changePercent || 0} />
          <IndexCard name="道瓊" price={overview.usIndices.dia?.price || 0} change={overview.usIndices.dia?.change || 0} changePercent={overview.usIndices.dia?.changePercent || 0} />
        </div>
      </section>

      {headline && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <Link href={headline.url} target="_blank" className="block hover:text-primary transition-colors">
              <p className="text-xs text-primary font-semibold uppercase mb-1">頭條新聞</p>
              <h3 className="text-lg font-bold leading-snug">{headline.headline}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{headline.summary}</p>
              <p className="text-xs text-muted-foreground mt-2">{headline.source} · {new Date(headline.datetime * 1000).toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" })}</p>
            </Link>
          </CardContent>
        </Card>
      )}

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2"><GainersLosers quotes={overview.twMarket} /></div>
        <div><NewsFeed news={restNews} /></div>
      </section>
      <section>
        <h2 className="text-lg font-semibold mb-3">原物料 &amp; 匯率</h2>
        <CommodityForexBar />
      </section>
      <section className="py-4">
        <div className="h-24 bg-muted rounded-lg flex items-center justify-center text-sm text-muted-foreground">廣告版位</div>
      </section>
    </div>
  );
}
