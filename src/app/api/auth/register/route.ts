import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { db } from "@/lib/db";

async function generateReferralCode(): Promise<string> {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  for (let attempt = 0; attempt < 10; attempt++) {
    let code = "FIN-";
    const bytes = randomBytes(6);
    for (let i = 0; i < 6; i++) code += chars[bytes[i] % chars.length];
    const existing = await db.user.findUnique({ where: { referralCode: code } });
    if (!existing) return code;
  }
  return `FIN-${Date.now().toString(36).toUpperCase()}`;
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
    let user;
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        user = await db.user.create({
          data: {
            email,
            passwordHash,
            name,
            referralCode: await generateReferralCode(),
            referredById,
            referralCount: 0,
          },
        });
        break;
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError && e.code === "P2002" && attempt < 4) continue;
        throw e;
      }
    }
    if (!user) throw new Error("Failed to create user");

    if (referredById && user.id !== referredById) {
      await db.$transaction(async (tx: Prisma.TransactionClient) => {
        await tx.referralReward.create({
          data: { inviterId: referredById, inviteeId: user.id, pointsAwarded: 50 },
        });

        const inviterWallet = await tx.wallet.upsert({
          where: { userId: referredById },
          create: { userId: referredById, balance: 0 },
          update: {},
        });
        await tx.transaction.create({
          data: {
            userId: referredById,
            type: "deposit",
            amount: 50,
            description: "邀請獎勵",
            walletId: inviterWallet.id,
          },
        });
        await tx.wallet.update({
          where: { id: inviterWallet.id },
          data: { balance: { increment: 50 } },
        });

        const userWallet = await tx.wallet.upsert({
          where: { userId: user.id },
          create: { userId: user.id, balance: 0 },
          update: {},
        });
        await tx.transaction.create({
          data: {
            userId: user.id,
            type: "deposit",
            amount: 50,
            description: "註冊獎勵",
            walletId: userWallet.id,
          },
        });
        await tx.wallet.update({
          where: { id: userWallet.id },
          data: { balance: { increment: 50 } },
        });

        await tx.user.update({
          where: { id: referredById },
          data: { referralCount: { increment: 1 } },
        });
      });
    }

    return NextResponse.json({ id: user.id, email: user.email, name: user.name });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json({ error: "Email 或推薦碼重複" }, { status: 409 });
    }
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
