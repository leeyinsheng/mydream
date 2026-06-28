"use client";

import { useState } from "react";
import Link from "next/link";
import { useWatchlist } from "@/hooks/useWatchlist";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Trash2, ArrowLeft, Search, X } from "lucide-react";

const TYPE_LABELS: Record<string, string> = {
  stock: "股票",
  index: "指數",
  forex: "外匯",
  commodity: "原物料",
};

export function WatchlistPage() {
  const { items, loading, remove } = useWatchlist();
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");

  if (loading) {
    return <p className="text-muted-foreground text-center py-10">載入中...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">我的自選</h1>
        </div>
        <Button variant="outline" size="sm" onClick={() => setSearching(!searching)}>
          {searching ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
        </Button>
      </div>

      {searching && (
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="輸入代號或名稱搜尋..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 h-9 rounded border px-3 text-sm bg-background"
          />
        </div>
      )}

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Star className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p>自選清單是空的</p>
            <p className="text-xs mt-1">在個股頁面點擊星號加入</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-3 flex items-center justify-between">
                <Link
                  href={`/stocks/${encodeURIComponent(item.symbol)}`}
                  className="flex-1 min-w-0"
                >
                  <p className="text-xs text-muted-foreground">{TYPE_LABELS[item.type] || item.type}</p>
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.symbol}</p>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 text-muted-foreground hover:text-red-500"
                  onClick={() => remove(item.symbol)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
