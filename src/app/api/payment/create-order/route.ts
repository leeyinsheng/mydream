import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getPaymentGateway } from "@/lib/payment";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;

  const body = await req.json();
  const amount = Number(body.amount);
  if (!Number.isInteger(amount) || amount <= 0 || amount > 100000) {
    return NextResponse.json({ error: "金額必須為 1~100,000 的正整數" }, { status: 400 });
  }

  const gateway = getPaymentGateway();
  const order = await db.paymentOrder.create({
    data: { userId, amount, gateway: gateway.name },
  });

  const result = await gateway.createPayment({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
  });

  await db.paymentOrder.update({
    where: { id: order.id },
    data: { gatewayOrderId: result.gatewayOrderId },
  });

  return NextResponse.json({ paymentUrl: result.paymentUrl, orderId: order.id });
}
