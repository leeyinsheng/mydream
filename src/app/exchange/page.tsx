"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

interface Product {
  id: string; name: string; description: string | null; pointsCost: number;
  imageIcon: string | null; stock: number; partner: { name: string };
}

export default function ExchangePage() {
  const { data: session, status } = useSession();
  const [walletBalance, setWalletBalance] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [modal, setModal] = useState<string | null>(null);
  const [result, setResult] = useState<{ success: boolean; code?: string; error?: string } | null>(null);

  useEffect(() => {
    fetch("/api/exchange/products").then((r) => r.json()).then(setProducts).catch((e) => console.error("兌換商品讀取失敗:", e));
    if (session) {
      fetch("/api/wallet").then((r) => r.json()).then((d) => d.wallet && setWalletBalance(d.wallet.balance)).catch((e) => console.error("錢包餘額讀取失敗:", e));
    }
  }, [session]);

  function handleRedeem(productId: string) {
    setModal(productId);
    setResult(null);
  }

  function confirmRedeem() {
    if (!modal) return;
    fetch("/api/exchange/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: modal }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setResult({ success: false, error: data.error });
        } else {
          setResult({ success: true, code: data.order.redemptionCode });
          const prod = products.find((p) => p.id === modal);
          if (prod) setWalletBalance((b) => b - prod.pointsCost);
        }
      })
      .catch(() => setResult({ success: false, error: "網路錯誤，請稍後再試" }));
  }

  const modalProduct = modal ? products.find((p) => p.id === modal) : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">兌換商城</h1>
          <p className="text-muted-foreground text-sm">使用點數兌換合作平台商品</p>
        </div>
        {session && (
          <Link href="/wallet">
            <Button variant="outline">
              <Wallet className="h-4 w-4 mr-1" /> 可用點數：{walletBalance.toLocaleString()} 點
            </Button>
          </Link>
        )}
      </div>

      {status === "authenticated" && (
        <div className="flex gap-2 text-sm">
          <Link href="/exchange/orders" className="text-primary hover:underline">查看兌換紀錄 →</Link>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {products.map((p) => (
          <Card key={p.id} className="overflow-hidden flex flex-col">
            <div className="h-32 bg-muted flex items-center justify-center text-3xl">{p.imageIcon || "🎁"}</div>
            <CardContent className="p-4 flex-1 flex flex-col">
              <p className="text-xs text-muted-foreground">{p.partner.name}</p>
              <h3 className="font-semibold text-sm mt-1">{p.name}</h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.description || ""}</p>
              <div className="mt-auto pt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-primary font-bold font-mono">{p.pointsCost.toLocaleString()} 點</span>
                  {p.stock > 0 && p.stock <= 5 && <span className="text-xs text-amber-500">僅剩 {p.stock} 件</span>}
                  {p.stock === 0 && <span className="text-xs text-red-500">已售罄</span>}
                </div>
                <Button
                  className="w-full"
                  onClick={() => handleRedeem(p.id)}
                  disabled={!session || walletBalance < p.pointsCost || p.stock === 0}
                >
                  {!session ? "請先登入" : p.stock === 0 ? "已售罄" : walletBalance < p.pointsCost ? "點數不足" : "立即兌換"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Redeem Modal */}
      {modal && modalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setModal(null)}>
          <div className="bg-background border rounded-lg w-full max-w-md p-6 shadow-lg mx-4" onClick={(e) => e.stopPropagation()}>
            {!result ? (
              <>
                <h3 className="font-bold text-lg mb-4">確認兌換</h3>
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between"><span className="text-muted-foreground">商品</span><span>{modalProduct.name}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">平台</span><span>{modalProduct.partner.name}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">所需點數</span><span className="text-primary font-bold">{modalProduct.pointsCost.toLocaleString()} 點</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">兌換後餘額</span><span>{(walletBalance - modalProduct.pointsCost).toLocaleString()} 點</span></div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setModal(null)}>取消</Button>
                  <Button className="flex-1" onClick={confirmRedeem}>確認兌換</Button>
                </div>
              </>
            ) : result.success ? (
              <>
                <h3 className="font-bold text-lg mb-2 text-green-500">✅ 兌換成功</h3>
                <p className="text-sm text-muted-foreground mb-4">您的兌換碼已產生：</p>
                <div className="bg-muted rounded p-3 text-center font-mono font-bold tracking-wider text-lg mb-4">{result.code}</div>
                <p className="text-xs text-muted-foreground mb-4">請於合作平台輸入此兌換碼使用商品</p>
                <Button className="w-full" onClick={() => setModal(null)}>完成</Button>
              </>
            ) : (
              <>
                <h3 className="font-bold text-lg mb-2 text-red-500">兌換失敗</h3>
                <p className="text-sm text-muted-foreground mb-4">{result.error}</p>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setModal(null)}>取消</Button>
                  <Button className="flex-1" onClick={() => setResult(null)}>重試</Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
