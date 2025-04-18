import type { Metadata } from "next"
import AddProjectPage from "@/components/add-project-page"

export const metadata: Metadata = {
  title: "Add Project | ProjectMaster",
  description: "Create a new project",
}

export default function AddProject() {
  return (
    <div className="min-h-screen bg-background">
      <AddProjectPage />
    </div>
  )
}
