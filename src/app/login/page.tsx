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
    <div className="py-20">
      <Card>
        <CardHeader><CardTitle className="text-center">登入</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input type="email" placeholder="電子信箱" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input type="password" placeholder="密碼" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full">登入</Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">或</span></div>
          </div>

          <div className="space-y-2">
            <Button variant="outline" className="w-full" onClick={() => signIn("google", { callbackUrl: "/" })}>
              Google 登入
            </Button>
            <Button variant="outline" className="w-full" onClick={() => signIn("line", { callbackUrl: "/" })}>
              LINE 登入
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-4">
            還沒有帳號？ <Link href="/register" className="text-primary hover:underline">註冊</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
