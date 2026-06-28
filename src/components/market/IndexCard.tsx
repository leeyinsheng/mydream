import Link from "next/link";
import { WatchlistStar } from "@/components/watchlist/WatchlistStar";

interface IndexCardProps {
  flag: string;
  name: string;
  country: string;
  price: number;
  change: number;
  changePercent: number;
  href?: string;
  symbol?: string;
}

export function IndexCard({ flag, name, price, change, changePercent, href, symbol }: IndexCardProps) {
  const isPositive = change >= 0;
  const card = (
    <div className={`rounded-lg border p-2.5 transition-colors ${href ? "active:bg-muted cursor-pointer" : ""} ${isPositive ? "border-green-500/20 bg-green-500/5" : "border-red-500/20 bg-red-500/5"}`}>
      <div className="flex items-center gap-1 mb-1">
        <span className="text-base">{flag}</span>
        <span className="text-xs font-medium truncate flex-1">{name}</span>
        {symbol && href && <WatchlistStar symbol={symbol} name={name} type="index" />}
      </div>
      <p className="text-sm font-bold">{price.toLocaleString("zh-TW", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</p>
      <p className={`text-xs font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}>
        {isPositive ? "+" : ""}{change.toFixed(2)} ({isPositive ? "+" : ""}{changePercent.toFixed(2)}%)
      </p>
    </div>
  );

  if (href) {
    return <Link href={href}>{card}</Link>;
  }
  return card;
}
