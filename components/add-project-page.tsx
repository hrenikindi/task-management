"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import AddProjectDialog from "@/components/add-project-dialog"

export default function AddProjectPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(true)

  const handleAddProject = (project) => {
    // In a real app, this would save the project to a database
    console.log("New project:", project)

    toast({
      title: "Project created!",
      description: `"${project.name}" has been created successfully.`,
      variant: "success",
    })

    // Navigate to the dashboard
    router.push("/")
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" className="mr-4" onClick={() => router.push("/")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Project</h1>
          <p className="text-muted-foreground mt-1">Add a new project to your workspace</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Creation</CardTitle>
          <CardDescription>
            Use the form to create a new project. You'll be able to add tasks and team members later.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-10">
          <Button size="lg" onClick={() => setIsDialogOpen(true)}>
            Open Project Form
          </Button>
        </CardContent>
      </Card>

      <AddProjectDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onAddProject={handleAddProject} />
    </div>
  )
}
