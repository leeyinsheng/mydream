"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("密碼至少需要 6 個字元"); return; }
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });
    if (res.ok) router.push("/login");
    else { const data = await res.json(); setError(data.error || "註冊失敗"); }
  }

  return (
    <div className="py-20">
      <Card>
        <CardHeader><CardTitle className="text-center">註冊</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input placeholder="暱稱（選填）" value={name} onChange={(e) => setName(e.target.value)} />
            <Input type="email" placeholder="電子信箱" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input type="password" placeholder="密碼（至少 6 碼）" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full">註冊</Button>
            <p className="text-center text-sm text-muted-foreground">
              已有帳號？ <Link href="/login" className="text-primary hover:underline">登入</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
