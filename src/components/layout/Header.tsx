"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { User, Wallet, Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { href: "/stocks", label: "股市" },
  { href: "/forex", label: "外匯" },
  { href: "/commodities", label: "原物料" },
  { href: "/industry", label: "產業" },
  { href: "/screener", label: "篩選" },
  { href: "/real-estate", label: "房地產" },
  { href: "/exchange", label: "兌換" },
];

export function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="flex items-center h-11 px-3 gap-2">
          <button className="p-1" onClick={() => setMenuOpen(!menuOpen)} aria-label="選單">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link href="/" className={`font-bold text-base ${isActive("/") ? "text-primary" : ""}`}>
            FinPulse
          </Link>
          <div className="flex-1" />
          <ThemeToggle />
          {session && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push("/wallet")}>
              <Wallet className="h-4 w-4" />
            </Button>
          )}
          {session ? (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => signOut()}>
              <User className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="default" size="sm" className="h-7 text-xs" onClick={() => router.push("/login")}>
              登入
            </Button>
          )}
        </div>

        {/* Quick nav tabs */}
        <div className="flex overflow-x-auto gap-1 px-3 pb-2 no-scrollbar">
          {NAV_ITEMS.slice(0, 6).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 px-3 py-1 rounded-full text-xs transition-colors ${
                isActive(item.href)
                  ? "bg-primary text-primary-foreground font-medium"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Full menu dropdown */}
        {menuOpen && (
          <div className="border-t bg-background px-3 py-2 space-y-0.5">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm ${
                  isActive(item.href) ? "bg-primary/10 text-primary font-semibold" : "hover:bg-muted"
                }`}
              >
                {item.label}
              </Link>
            ))}
            {!session && (
              <Link href="/login" onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm hover:bg-muted text-primary font-medium"
              >
                登入 / 註冊
              </Link>
            )}
            {session && (
              <Link href="/profile" onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm hover:bg-muted"
              >
                個人中心
              </Link>
            )}
          </div>
        )}
      </header>
    </>
  );
}
