import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { NewsItem } from "@/lib/market-data";
interface Props { news: NewsItem[]; }

export function NewsFeed({ news }: Props) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">市場動態</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {news.map((item) => (
          <a key={item.url} href={item.url} target="_blank" rel="noopener noreferrer"
             className="block text-sm hover:text-primary transition-colors">
            <p className="font-medium line-clamp-1">{item.headline}</p>
            <p className="text-muted-foreground text-xs mt-0.5 line-clamp-1">{item.source} &middot; {new Date(item.datetime * 1000).toLocaleDateString("zh-TW")}</p>
          </a>
        ))}
      </CardContent>
    </Card>
  );
}
