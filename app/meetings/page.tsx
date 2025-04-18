import type { Metadata } from "next"
import MeetingsPage from "@/components/meetings-page"

export const metadata: Metadata = {
  title: "Meetings | ProjectMaster",
  description: "Manage your scheduled meetings",
}

export default function Meetings() {
  return (
    <div className="min-h-screen bg-background">
      <MeetingsPage />
    </div>
  )
}
