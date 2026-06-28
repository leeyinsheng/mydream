"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Gift, Users, Copy, Check } from "lucide-react";

export function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<{ referralCode: string; referralCount: number; totalRewards: number } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/referral/stats")
      .then((r) => r.json())
      .then(setStats);
  }, []);

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const referralLink = stats?.referralCode
    ? `${window.location.origin}/register?code=${stats.referralCode}`
    : "";

  const handleCopy = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push("/")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-bold">個人中心</h1>
      </div>

      <Card>
        <CardContent className="p-4 space-y-3">
          <p className="text-sm text-muted-foreground">帳戶</p>
          <p className="font-semibold">{session?.user?.name || "未設定名稱"}</p>
          <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
        </CardContent>
      </Card>

      {stats && (
        <>
          <Card>
            <CardContent className="p-4 space-y-3">
              <p className="text-sm text-muted-foreground">我的推薦碼</p>
              <p className="text-lg font-bold tracking-wider">{stats.referralCode}</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={referralLink}
                  className="flex-1 h-9 rounded border px-3 text-xs bg-muted"
                />
                <Button variant="outline" size="sm" onClick={handleCopy} className="shrink-0">
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">分享此連結，朋友註冊後雙方各得 50 點</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="p-4 text-center space-y-1">
                <Users className="h-6 w-6 mx-auto text-primary" />
                <p className="text-2xl font-bold">{stats.referralCount}</p>
                <p className="text-xs text-muted-foreground">已邀請</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center space-y-1">
                <Gift className="h-6 w-6 mx-auto text-yellow-500" />
                <p className="text-2xl font-bold">{stats.totalRewards.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">獎勵點數</p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
