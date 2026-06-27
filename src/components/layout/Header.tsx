"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";

export function Header() {
  const { data: session } = useSession();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4">
        <Link href="/" className="font-bold text-xl mr-8">FinPulse</Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/stocks" className="hover:text-primary transition-colors">股市</Link>
          <Link href="/commodities" className="hover:text-primary transition-colors">原物料</Link>
          <Link href="/forex" className="hover:text-primary transition-colors">外匯</Link>
        </nav>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="icon"><User className="h-5 w-5" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-muted-foreground">{session.user?.email}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>登出</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" size="sm"><Link href="/login" className="text-primary-foreground">登入</Link></Button>
          )}
        </div>
      </div>
    </header>
  );
}
