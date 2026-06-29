"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, Banknote, Smartphone, AlertCircle } from "lucide-react";

const PRESET_AMOUNTS = [500, 1000, 2000, 5000, 10000];
const METHODS = [
  { id: "credit", name: "信用卡", icon: CreditCard, desc: "Visa / Mastercard / JCB" },
  { id: "atm", name: "ATM 轉帳", icon: Banknote, desc: "產生虛擬帳號轉帳" },
  { id: "convenience", name: "超商繳費", icon: Smartphone, desc: "7-Eleven / 全家 / 萊爾富" },
];

export default function RechargePage() {
  const { status } = useSession();
  const router = useRouter();
  const [step, setStep] = useState<"amount" | "method" | "confirm" | "error">("amount");
  const [amount, setAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState("");
  const [method, setMethod] = useState("credit");

  if (status === "unauthenticated") { router.push("/login"); return null; }

  async function handleRecharge() {
    try {
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      if (!data.paymentUrl) throw new Error("No payment URL");
      window.location.href = data.paymentUrl;
    } catch {
      setStep("error");
    }
  }

  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={() => router.push("/wallet")}>
        <ArrowLeft className="h-4 w-4 mr-1" /> 返回錢包
      </Button>

      <h1 className="text-2xl font-bold">充值點數</h1>

      {step === "amount" && (
        <Card>
          <CardHeader><CardTitle className="text-base">選擇充值金額</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {PRESET_AMOUNTS.map((a) => (
                <button
                  key={a}
                  onClick={() => { setAmount(a); setCustomAmount(""); }}
                  className={`py-3 rounded border text-sm font-semibold transition-colors ${amount === a ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50"}`}
                >
                  NT$ {a.toLocaleString()}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">自訂金額：</span>
              <input
                type="number"
                min={100}
                max={50000}
                placeholder="輸入金額"
                value={customAmount}
                onChange={(e) => { setCustomAmount(e.target.value); const v = Number(e.target.value); setAmount(v > 0 ? v : 1000); }}
                className="flex-1 h-9 rounded border px-3 text-sm bg-background"
              />
            </div>
            <Button className="w-full" onClick={() => setStep("method")}>下一步</Button>
          </CardContent>
        </Card>
      )}

      {step === "method" && (
        <Card>
          <CardHeader><CardTitle className="text-base">選擇付款方式</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">充值金額：NT$ {amount.toLocaleString()} = {amount.toLocaleString()} 點</p>
            {METHODS.map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`w-full flex items-center gap-4 p-4 rounded border text-left transition-colors ${method === m.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}
              >
                <m.icon className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-semibold text-sm">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.desc}</p>
                </div>
              </button>
            ))}
            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setStep("amount")}>上一步</Button>
              <Button className="flex-1" onClick={() => setStep("confirm")}>確認</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "confirm" && (
        <Card>
          <CardHeader><CardTitle className="text-base">確認儲值</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted rounded p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">儲值金額</span><span className="font-semibold">NT$ {amount.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">獲得點數</span><span className="font-semibold text-primary">{amount.toLocaleString()} 點</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">付款方式</span><span>{METHODS.find((m) => m.id === method)?.name}</span></div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep("method")}>上一步</Button>
              <Button className="flex-1" onClick={handleRecharge}>確認付款</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "error" && (
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <AlertCircle className="h-12 w-12 mx-auto text-red-500" />
            <h2 className="text-xl font-bold">儲值失敗</h2>
            <p className="text-muted-foreground">請稍後再試或聯絡客服</p>
            <Button variant="outline" onClick={() => setStep("confirm")}>重新嘗試</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
