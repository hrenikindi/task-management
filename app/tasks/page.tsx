import type { Metadata } from "next"
import TasksView from "@/components/tasks-view"

export const metadata: Metadata = {
  title: "My Tasks | ProjectMaster",
  description: "Manage your assigned tasks",
}

export default function TasksPage() {
  return (
    <div className="min-h-screen bg-background">
      <TasksView />
    </div>
  )
}
