import type { Metadata } from "next"
import SettingsPage from "@/components/settings-page"

export const metadata: Metadata = {
  title: "Settings | ProjectMaster",
  description: "Manage your account and application settings",
}

export default function Settings() {
  return (
    <div className="min-h-screen bg-background">
      <SettingsPage />
    </div>
  )
}
