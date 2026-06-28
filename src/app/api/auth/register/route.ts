import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createTransaction } from "@/lib/wallet";

function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "FIN-";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export async function POST(req: Request) {
  try {
    const { email, password, name, referralCode } = await req.json();
    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "請輸入有效的 Email" }, { status: 400 });
    }
    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json({ error: "密碼至少 6 個字元" }, { status: 400 });
    }
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    let referredById: string | undefined;
    if (referralCode && typeof referralCode === "string") {
      const inviter = await db.user.findUnique({ where: { referralCode: referralCode.trim().toUpperCase() } });
      if (inviter) referredById = inviter.id;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await db.user.create({
      data: {
        email,
        passwordHash,
        name,
        referralCode: generateReferralCode(),
        referredById,
        referralCount: 0,
      },
    });

    if (referredById && user.id !== referredById) {
      await db.referralReward.create({
        data: { inviterId: referredById, inviteeId: user.id },
      });
      await createTransaction(referredById, "deposit", 50, "邀請獎勵");
      await createTransaction(user.id, "deposit", 50, "註冊獎勵");
      await db.user.update({
        where: { id: referredById },
        data: { referralCount: { increment: 1 } },
      });
    }

    return NextResponse.json({ id: user.id, email: user.email, name: user.name });
  } catch {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
