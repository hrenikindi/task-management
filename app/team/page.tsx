import type { Metadata } from "next"
import TeamView from "@/components/team-view"

export const metadata: Metadata = {
  title: "Team | ProjectMaster",
  description: "View and manage your team members",
}

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-background">
      <TeamView />
    </div>
  )
}
