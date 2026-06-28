import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getPaymentGateway } from "@/lib/payment";
import { createTransaction } from "@/lib/wallet";

export async function POST(req: Request) {
  const body = await req.json();
  const headers: Record<string, string> = {};
  req.headers.forEach((value, key) => { headers[key] = value; });

  const gateway = getPaymentGateway();
  const result = await gateway.verifyWebhook({ payload: body, headers });
  if (!result.valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const orderId = (body as Record<string, unknown>).orderId as string | undefined;
  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
  }

  const order = await db.paymentOrder.findUnique({ where: { id: orderId } });
  if (!order || order.status !== "pending") {
    return NextResponse.json({ error: "Order not found or already paid" }, { status: 400 });
  }

  const existing = await db.transaction.findFirst({
    where: { paymentTxId: orderId },
  });
  if (!existing) {
    await createTransaction(order.userId, "deposit", order.amount, `金流充值 #${orderId.slice(0, 8)}`);
  }

  await db.paymentOrder.update({
    where: { id: orderId },
    data: { status: "paid", paidAt: new Date(), tradeNo: result.tradeNo },
  });

  return NextResponse.json({ success: true });
}
