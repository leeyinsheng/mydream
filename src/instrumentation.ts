import { startIndustryCron } from "@/lib/industry/cron"

export function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    startIndustryCron()
  }
}
