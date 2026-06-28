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
  const items = await db.watchlistItem.findMany({
    where: { userId },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;
  const { symbol, name, type } = await req.json();
  if (!symbol || !name || !type) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const existing = await db.watchlistItem.findUnique({
    where: { userId_symbol: { userId, symbol } },
  });
  if (existing) {
    return NextResponse.json(existing);
  }
  const count = await db.watchlistItem.count({ where: { userId } });
  const item = await db.watchlistItem.create({
    data: { userId, symbol, name, type, order: count },
  });
  return NextResponse.json(item);
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get("symbol");
  if (!symbol) {
    return NextResponse.json({ error: "Missing symbol" }, { status: 400 });
  }
  await db.watchlistItem.deleteMany({
    where: { userId, symbol },
  });
  return NextResponse.json({ success: true });
}
