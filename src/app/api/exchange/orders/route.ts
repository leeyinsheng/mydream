import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createExchangeOrder, getUserOrders } from "@/lib/exchange";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;
  const orders = await getUserOrders(userId);
  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;
  const { productId } = await req.json();
  if (!productId) {
    return NextResponse.json({ error: "Product ID required" }, { status: 400 });
  }

  const { getProductById } = await import("@/lib/exchange");
  const product = await getProductById(productId);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  try {
    const order = await createExchangeOrder(userId, productId, product.pointsCost);
    return NextResponse.json({ success: true, order });
  } catch (e) {
    if (e instanceof Error && e.message === "Insufficient balance") {
      return NextResponse.json({ error: "點數不足" }, { status: 400 });
    }
    return NextResponse.json({ error: "兌換失敗" }, { status: 500 });
  }
}
