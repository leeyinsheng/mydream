import cron from "node-cron"
import { generateIndustryAnalysis } from "./generator"

let started = false

export function startIndustryCron() {
  if (started) return
  started = true

  // Run daily at 08:00 AM server time
  cron.schedule("0 8 * * *", async () => {
    console.log("[Industry Cron] Starting daily refresh...")
    await generateIndustryAnalysis()
    console.log("[Industry Cron] Done.")
  })

  console.log("[Industry Cron] Scheduled daily at 08:00")
}
