import type { Metadata } from "next"
import AnalyticsPage from "@/components/analytics-page"

export const metadata: Metadata = {
  title: "Analytics | ProjectMaster",
  description: "Project analytics and performance metrics",
}

export default function Analytics() {
  return (
    <div className="min-h-screen bg-background">
      <AnalyticsPage />
    </div>
  )
}
