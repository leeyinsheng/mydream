import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth-utils"
import { generateIndustryAnalysis } from "@/lib/industry/generator"

export async function POST() {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  generateIndustryAnalysis().catch((err) =>
    console.error("[Industry Refresh] Background error:", err)
  )

  return NextResponse.json({ ok: true })
}
