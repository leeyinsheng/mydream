import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { NextResponse } from "next/server";
import { db } from "./db";

export function getSessionUserId(session: { user?: { id?: string; email?: string } } | null): string | null {
  return (session?.user as { id?: string } | undefined)?.id || null;
}

export function getSessionRole(session: { user?: { role?: string } } | null): string | null {
  return (session?.user as { role?: string } | undefined)?.role || null;
}

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (getSessionRole(session) !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

export async function getSessionWithRole() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;
  const userId = getSessionUserId(session);
  if (!userId) return null;
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, role: true },
  });
  return user;
}
