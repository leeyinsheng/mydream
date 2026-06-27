"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, Wallet, Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { href: "/stocks", label: "股市" },
  { href: "/commodities", label: "原物料" },
  { href: "/forex", label: "外匯" },
  { href: "/industry", label: "產業分析" },
  { href: "/screener", label: "篩選器" },
];

export function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4">
        <Link href="/" className={`font-bold text-xl mr-8 ${isActive("/") ? "text-primary" : ""}`}>FinPulse</Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition-colors ${
                isActive(item.href)
                  ? "text-primary font-semibold"
                  : "hover:text-primary"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex-1" />

        {/* Mobile hamburger */}
        <button className="md:hidden p-2 mr-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="選單">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {session && (
            <Button variant="ghost" size="icon" onClick={() => router.push("/wallet")} aria-label="錢包">
              <Wallet className="h-5 w-5" />
            </Button>
          )}
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="icon"><User className="h-5 w-5" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-muted-foreground">{session.user?.email}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/wallet")}>錢包</DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>登出</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" size="sm" onClick={() => router.push("/login")}>登入</Button>
          )}
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background px-4 py-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded text-sm transition-colors ${
                isActive(item.href)
                  ? "bg-primary/10 text-primary font-semibold"
                  : "hover:bg-muted"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
