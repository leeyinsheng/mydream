import { IndexCard } from "@/components/market/IndexCard";
import { GainersLosers } from "@/components/market/GainersLosers";
import { NewsFeed } from "@/components/market/NewsFeed";
import { CommodityForexBar } from "@/components/market/CommodityForexBar";
import { getMarketOverview, getMarketNews } from "@/lib/market-data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [overview, news] = await Promise.all([getMarketOverview(), getMarketNews()]);
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
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2"><GainersLosers quotes={overview.twMarket} /></div>
        <div><NewsFeed news={news} /></div>
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
