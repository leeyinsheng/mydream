"use client";

import { Star } from "lucide-react";
import { useWatchlist } from "@/hooks/useWatchlist";

interface Props {
  symbol: string;
  name: string;
  type: string;
  className?: string;
}

export function WatchlistStar({ symbol, name, type, className = "" }: Props) {
  const { isWatched, add, remove } = useWatchlist();
  const watched = isWatched(symbol);

  return (
    <button
      onClick={() => (watched ? remove(symbol) : add(symbol, name, type))}
      className={`p-1 transition-colors ${watched ? "text-yellow-500" : "text-muted-foreground hover:text-yellow-400"} ${className}`}
      aria-label={watched ? "移出自選" : "加入自選"}
    >
      <Star className="h-4 w-4" fill={watched ? "currentColor" : "none"} />
    </button>
  );
}
