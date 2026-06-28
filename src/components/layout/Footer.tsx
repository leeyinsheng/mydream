import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t py-3 px-3 space-y-2">
      <div className="flex justify-center gap-4 text-xs text-muted-foreground">
        <Link href="/terms" className="hover:text-foreground">服務條款</Link>
        <Link href="/privacy" className="hover:text-foreground">隱私政策</Link>
        <Link href="/disclaimer" className="hover:text-foreground">免責聲明</Link>
        <Link href="/faq" className="hover:text-foreground">常見問題</Link>
      </div>
      <p className="text-center text-xs text-muted-foreground">
        資料來源：Yahoo Finance、Finnhub、ExchangeRate-API<br />
        僅供參考，不構成投資建議
      </p>
    </footer>
  );
}
