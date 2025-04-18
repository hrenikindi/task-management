import type { Metadata } from "next"
import CalendarPage from "@/components/calendar-page"

export const metadata: Metadata = {
  title: "Calendar | ProjectMaster",
  description: "View your tasks and meetings in calendar format",
}

export default function Calendar() {
  return (
    <div className="min-h-screen bg-background">
      <CalendarPage />
    </div>
  )
}
