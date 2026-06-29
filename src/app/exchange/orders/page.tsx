"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingBag } from "lucide-react";

interface Order {
  id: string; pointsSpent: number; redemptionCode: string; status: string;
  createdAt: string; product: { name: string; imageIcon: string | null; partner: { name: string } };
}

export default function ExchangeOrdersPage() {
  const { status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/exchange/orders")
        .then((r) => r.json())
        .then(setOrders)
        .catch(() => setOrders([]))
        .finally(() => setLoading(false));
    } else if (status !== "loading") {
      setLoading(false);
    }
  }, [status]);

  if (status === "unauthenticated") {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground">請先登入以查看兌換紀錄</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/login")}>前往登入</Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.push("/exchange")}>
          <ArrowLeft className="h-4 w-4 mr-1" /> 返回兌換商城
        </Button>
        <h1 className="text-2xl font-bold">兌換紀錄</h1>
        <p className="text-muted-foreground">載入中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={() => router.push("/exchange")}>
        <ArrowLeft className="h-4 w-4 mr-1" /> 返回兌換商城
      </Button>
      <h1 className="text-2xl font-bold">兌換紀錄</h1>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <ShoppingBag className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p>尚無兌換紀錄</p>
            <Link href="/exchange"><Button variant="outline" className="mt-4">前往兌換商城</Button></Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <Card key={o.id}>
              <CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{o.product.imageIcon || "🎁"}</span>
                  <div>
                    <p className="font-semibold text-sm">{o.product.name}</p>
                    <p className="text-xs text-muted-foreground">{o.product.partner.name} · {o.pointsSpent.toLocaleString()} 點</p>
                    <p className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleDateString("zh-TW")}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-muted rounded px-3 py-1 font-mono text-xs font-bold tracking-wider">{o.redemptionCode}</div>
                  <p className="text-xs text-muted-foreground mt-1">{o.status === "completed" ? "✅ 已兌換" : o.status}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
