import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { INDUSTRIES } from "@/lib/industry/config"

const FALLBACK = Object.fromEntries(
  INDUSTRIES.map((ind) => [ind.key, null])
)

export async function GET() {
  try {
    const records = await db.industryAnalysis.findMany()

    if (records.length === 0) {
      return NextResponse.json({
        data: FALLBACK,
        updatedAt: null,
      })
    }

    const data: Record<string, unknown> = {}
    let latestTimestamp: string | null = null

    for (const r of records) {
      data[r.industry] = r.content
      const ts = (r.content as { updatedAt?: string })?.updatedAt
      if (ts && (!latestTimestamp || ts > latestTimestamp)) {
        latestTimestamp = ts
      }
    }

    return NextResponse.json({
      data,
      updatedAt: latestTimestamp,
    })
  } catch (err) {
    console.error("[Industry API] Error:", err)
    return NextResponse.json({ data: FALLBACK, updatedAt: null }, { status: 500 })
  }
}
