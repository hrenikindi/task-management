import type { Metadata } from "next"
import HelpPage from "@/components/help-page"

export const metadata: Metadata = {
  title: "Help & Support | ProjectMaster",
  description: "Get help and support for ProjectMaster",
}

export default function Help() {
  return (
    <div className="min-h-screen bg-background">
      <HelpPage />
    </div>
  )
}
