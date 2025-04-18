import type { Metadata } from "next"
import ProjectDetail from "@/components/project-detail"

export const metadata: Metadata = {
  title: "Project Details | ProjectMaster",
  description: "View and manage project details",
}

export default function ProjectPage({ params }) {
  return (
    <div className="min-h-screen bg-background">
      <ProjectDetail projectId={params.id} />
    </div>
  )
}
