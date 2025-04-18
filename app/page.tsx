import type { Metadata } from "next"
import ProjectManagementBoard from "@/components/project-management-board"

export const metadata: Metadata = {
  title: "Dashboard | ProjectMaster",
  description: "Project management dashboard with drag-and-drop tasks",
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <ProjectManagementBoard />
    </div>
  )
}
