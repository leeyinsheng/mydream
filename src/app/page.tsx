import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { IndexCard } from "@/components/market/IndexCard";
import { GainersLosers } from "@/components/market/GainersLosers";
import { NewsFeed } from "@/components/market/NewsFeed";
import { CommodityForexBar } from "@/components/market/CommodityForexBar";
import { getGlobalIndices, getMarketOverview, getMarketNews } from "@/lib/market-data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [indices, overview, news] = await Promise.all([
    getGlobalIndices(),
    getMarketOverview(),
    getMarketNews(),
  ]);
  const headline = news[0];
  const restNews = news.slice(1);

  return (
    <div className="space-y-4">
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
