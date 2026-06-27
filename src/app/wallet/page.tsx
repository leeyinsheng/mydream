"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet as WalletIcon, ArrowUpCircle, ArrowDownCircle, Plus, AlertCircle } from "lucide-react";

export default function WalletPage() {
  const { status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<{ wallet: { balance: number }; transactions: { id: string; type: string; amount: number; description: string; createdAt: string }[] } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      const t = setTimeout(() => router.push("/login"), 1500);
      return () => clearTimeout(t);
    }
    if (status === "authenticated") {
      fetch("/api/wallet")
        .then((r) => { if (!r.ok) throw new Error("Failed"); return r.json(); })
        .then(setData)
        .catch(() => setError("無法載入錢包資料"));
    }
  }, [status, router]);

  if (status === "unauthenticated") {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">請先登入以查看錢包</p>
        <p className="text-xs text-muted-foreground mt-1">即將為您導向登入頁面…</p>
      </div>
    );
  }

  if (status === "loading") {
    return <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">載入中…</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <AlertCircle className="h-10 w-10 mx-auto mb-3 text-red-500" />
        <p className="text-muted-foreground">{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => { setError(""); setData(null); }}>重試</Button>
      </div>
    );
  }

  if (!data) {
    return <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">載入中…</div>;
  }

  const isPositive = (type: string) => type === "deposit";

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold">錢包</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">可用餘額</p>
              <p className="text-4xl font-bold mt-1">
                {data.wallet.balance.toLocaleString()} <span className="text-lg text-muted-foreground">點</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">1 TWD = 1 點</p>
            </div>
            <Link href="/recharge"><Button><Plus className="h-4 w-4 mr-1" /> 充值</Button></Link>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <WalletIcon className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="text-sm text-muted-foreground">點數永久有效</p>
            <p className="text-xs text-muted-foreground mt-1">可於兌換商城使用</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">交易紀錄</CardTitle></CardHeader>
        <CardContent>
          {data.transactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">尚無交易紀錄</p>
          ) : (
            <div className="divide-y">
              {data.transactions.map((tx) => (
                <div key={tx.id} className="flex justify-between items-center py-3">
                  <div className="flex items-center gap-3">
                    {isPositive(tx.type) ? (
                      <ArrowUpCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <ArrowDownCircle className="h-5 w-5 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium text-sm">
                        {tx.type === "deposit" ? "充值" : tx.type === "withdraw" ? "提領" : "兌換"}
                        <span className="text-muted-foreground ml-2 text-xs">{tx.description}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{new Date(tx.createdAt).toLocaleDateString("zh-TW")}</p>
                    </div>
                  </div>
                  <span className={`font-mono font-semibold ${isPositive(tx.type) ? "text-green-500" : "text-red-500"}`}>
                    {isPositive(tx.type) ? "+" : "-"}{tx.amount.toLocaleString()} 點
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
