"use client";

import Link from "next/link";
import { useWatchlist } from "@/hooks/useWatchlist";
import { Star, ChevronRight } from "lucide-react";

const TYPE_LABELS: Record<string, string> = {
  stock: "股票",
  index: "指數",
  forex: "外匯",
  commodity: "原物料",
};

export function WatchlistSection() {
  const { items, loading } = useWatchlist();

  if (loading || items.length === 0) return null;

  const display = items.slice(0, 4);

  return (
    <section>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Star className="h-4 w-4 text-yellow-500" fill="currentColor" />
          <h2 className="text-sm font-semibold">我的自選</h2>
        </div>
        {items.length > 4 && (
          <Link href="/watchlist" className="text-xs text-primary flex items-center gap-0.5">
            查看更多 <ChevronRight className="h-3 w-3" />
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {display.map((item) => (
          <Link
            key={item.id}
            href={item.type === "index" ? `/stocks/${encodeURIComponent(item.symbol)}` : `/stocks/${encodeURIComponent(item.symbol)}`}
            className="rounded-lg border p-2.5 hover:bg-muted/50 transition-colors"
          >
            <p className="text-xs text-muted-foreground">{TYPE_LABELS[item.type] || item.type}</p>
            <p className="text-sm font-medium truncate">{item.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
