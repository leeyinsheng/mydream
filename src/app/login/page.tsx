"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) setError("信箱或密碼錯誤");
    else { router.push("/"); router.refresh(); }
  }

  return (
    <div className="container mx-auto max-w-md px-4 py-20">
      <Card>
        <CardHeader><CardTitle className="text-center">登入</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input type="email" placeholder="電子信箱" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input type="password" placeholder="密碼" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full">登入</Button>
            <p className="text-center text-sm text-muted-foreground">
              還沒有帳號？ <Link href="/register" className="text-primary hover:underline">註冊</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
