import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createTransaction } from "@/lib/wallet";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "金流功能尚未串接，敬請期待" }, { status: 503 });
  }
  const userId = (session.user as { id: string }).id;
  const body = await req.json();
  const amount = Number(body.amount);
  const description = typeof body.description === "string" ? body.description : "";
  if (!Number.isInteger(amount) || amount <= 0 || amount > 100000) {
    return NextResponse.json({ error: "金額必須為 1~100,000 的正整數" }, { status: 400 });
  }
  const tx = await createTransaction(userId, "deposit", amount, description || "點數充值");
  return NextResponse.json({ success: true, transaction: tx });
}
