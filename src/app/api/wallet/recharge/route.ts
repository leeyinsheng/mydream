import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "此端點已棄用，請使用 /api/payment/create-order", goto: "/api/payment/create-order" },
    { status: 410 }
  );
}
