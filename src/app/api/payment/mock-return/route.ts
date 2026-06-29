import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { createTransaction } from "@/lib/wallet";

export async function GET(req: Request) {
  if (process.env.MOCK_PAYMENT_ENABLED !== "true") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  const userId = (session.user as { id: string }).id;

  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");
  if (!orderId) {
    return NextResponse.redirect(new URL("/wallet?payment=fail", req.url));
  }

  const order = await db.paymentOrder.findUnique({ where: { id: orderId } });
  if (!order || order.userId !== userId) {
    return NextResponse.redirect(new URL("/wallet?payment=fail", req.url));
  }

  if (order.status === "pending") {
    const existing = await db.transaction.findFirst({
      where: { paymentTxId: orderId },
    });
    if (!existing) {
      await createTransaction(order.userId, "deposit", order.amount, `金流充值 #${orderId.slice(0, 8)}`);
    }
    await db.paymentOrder.update({
      where: { id: orderId },
      data: { status: "paid", paidAt: new Date() },
    });
  }

  return NextResponse.redirect(new URL("/wallet?payment=success", req.url));
}
