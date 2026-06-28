"use client";

import { useState, useEffect, useCallback } from "react";

export interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
  type: string;
  order: number;
  addedAt: string;
}

export function useWatchlist() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/watchlist")
      .then((r) => (r.ok ? r.json() : []))
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  const add = useCallback(async (symbol: string, name: string, type: string) => {
    const res = await fetch("/api/watchlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symbol, name, type }),
    });
    if (res.ok) {
      const item = await res.json();
      setItems((prev) => [...prev.filter((i) => i.symbol !== symbol), item]);
    }
  }, []);

  const remove = useCallback(async (symbol: string) => {
    await fetch(`/api/watchlist?symbol=${encodeURIComponent(symbol)}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.symbol !== symbol));
  }, []);

  const isWatched = useCallback(
    (symbol: string) => items.some((i) => i.symbol === symbol),
    [items]
  );

  return { items, loading, add, remove, isWatched };
}
