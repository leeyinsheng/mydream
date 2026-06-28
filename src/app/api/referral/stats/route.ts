import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { referralCode: true, referralCount: true },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const rewards = await db.referralReward.aggregate({
    where: { inviterId: userId },
    _sum: { pointsAwarded: true },
  });

  return NextResponse.json({
    referralCode: user.referralCode,
    referralCount: user.referralCount,
    totalRewards: rewards._sum.pointsAwarded || 0,
  });
}
