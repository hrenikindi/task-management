"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Calendar, Clock, Edit, Plus, Users, CheckCircle2, ArrowUpRight, MessageSquare } from "lucide-react"
import { DragDropContext, Droppable } from "@hello-pangea/dnd"
import TaskCard from "@/components/task-card"

// Sample project data
const projectData = {
  marketing: {
    id: "marketing",
    name: "Marketing Campaign",
    description: "Q3 marketing campaign for product launch",
    startDate: "2025-04-01",
    endDate: "2025-04-30",
    status: "in-progress",
    progress: 75,
    team: [
      {
        id: "user-1",
        name: "John Doe",
        role: "Project Manager",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "JD",
      },
      {
        id: "user-2",
        name: "Sarah Johnson",
        role: "Senior Designer",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "SJ",
      },
      {
        id: "user-4",
        name: "Emily Clark",
        role: "Content Strategist",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "EC",
      },
      {
        id: "user-8",
        name: "Rachel Green",
        role: "Marketing Specialist",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "RG",
      },
    ],
    sprints: [
      {
        id: "sprint-1",
        name: "Sprint 1",
        startDate: "2025-04-01",
        endDate: "2025-04-07",
        status: "completed",
        progress: 100,
      },
      {
        id: "sprint-2",
        name: "Sprint 2",
        startDate: "2025-04-08",
        endDate: "2025-04-14",
        status: "completed",
        progress: 100,
      },
      {
        id: "sprint-3",
        name: "Sprint 3",
        startDate: "2025-04-15",
        endDate: "2025-04-21",
        status: "in-progress",
        progress: 60,
      },
      {
        id: "sprint-4",
        name: "Sprint 4",
        startDate: "2025-04-22",
        endDate: "2025-04-30",
        status: "planned",
        progress: 0,
      },
    ],
    tasks: [
      {
        id: "task-1",
        title: "Create marketing strategy",
        description: "Develop comprehensive marketing strategy for Q3 campaign launch",
        status: "done",
        priority: "high",
        dueDate: "2025-04-05",
        assignee: { name: "John Doe", avatar: "/placeholder.svg?height=32&width=32", initials: "JD" },
      },
      {
        id: "task-2",
        title: "Design social media assets",
        description: "Create graphics for Instagram, Facebook, and Twitter for the new campaign",
        status: "in-progress",
        priority: "medium",
        dueDate: "2025-04-18",
        assignee: { name: "Sarah Johnson", avatar: "/placeholder.svg?height=32&width=32", initials: "SJ" },
      },
      {
        id: "task-3",
        title: "Content calendar planning",
        description: "Plan content calendar for the next month including blog posts and social media",
        status: "review",
        priority: "medium",
        dueDate: "2025-04-17",
        assignee: { name: "Emily Clark", avatar: "/placeholder.svg?height=32&width=32", initials: "EC" },
      },
      {
        id: "task-5",
        title: "Email newsletter design",
        description: "Design template for monthly newsletter",
        status: "in-progress",
        priority: "high",
        dueDate: "2025-04-16",
        assignee: { name: "Sarah Johnson", avatar: "/placeholder.svg?height=32&width=32", initials: "SJ" },
      },
      {
        id: "task-7",
        title: "Competitor analysis",
        description: "Research and analyze top 5 competitors' marketing strategies",
        status: "review",
        priority: "high",
        dueDate: "2025-04-19",
        assignee: { name: "Rachel Green", avatar: "/placeholder.svg?height=32&width=32", initials: "RG" },
      },
    ],
    meetings: [
      { id: "meeting-1", title: "Sprint Planning", date: "2025-04-15", time: "09:00", participants: 4 },
      { id: "meeting-2", title: "Daily Standup", date: "2025-04-16", time: "09:30", participants: 4, recurring: true },
      { id: "meeting-3", title: "Sprint Review", date: "2025-04-21", time: "14:00", participants: 4 },
    ],
  },
  website: {
    id: "website",
    name: "Website Redesign",
    description: "Complete overhaul of company website with new branding",
    startDate: "2025-04-10",
    endDate: "2025-05-15",
    status: "at-risk",
    progress: 60,
    team: [
      {
        id: "user-1",
        name: "John Doe",
        role: "Project Manager",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "JD",
      },
      {
        id: "user-3",
        name: "Mike Brown",
        role: "Frontend Developer",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "MB",
      },
      {
        id: "user-5",
        name: "Alex Wong",
        role: "Backend Developer",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "AW",
      },
      {
        id: "user-2",
        name: "Sarah Johnson",
        role: "Senior Designer",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "SJ",
      },
    ],
    sprints: [
      {
        id: "sprint-1",
        name: "Sprint 1",
        startDate: "2025-04-10",
        endDate: "2025-04-17",
        status: "completed",
        progress: 100,
      },
      {
        id: "sprint-2",
        name: "Sprint 2",
        startDate: "2025-04-18",
        endDate: "2025-04-25",
        status: "in-progress",
        progress: 75,
      },
      {
        id: "sprint-3",
        name: "Sprint 3",
        startDate: "2025-04-26",
        endDate: "2025-05-03",
        status: "planned",
        progress: 0,
      },
      {
        id: "sprint-4",
        name: "Sprint 4",
        startDate: "2025-05-04",
        endDate: "2025-05-15",
        status: "planned",
        progress: 0,
      },
    ],
    tasks: [
      {
        id: "task-1",
        title: "Wireframe design",
        description: "Create wireframes for all main pages",
        status: "done",
        priority: "high",
        dueDate: "2025-04-15",
        assignee: { name: "Sarah Johnson", avatar: "/placeholder.svg?height=32&width=32", initials: "SJ" },
      },
      {
        id: "task-2",
        title: "Frontend implementation",
        description: "Implement the new design in React",
        status: "in-progress",
        priority: "high",
        dueDate: "2025-04-25",
        assignee: { name: "Mike Brown", avatar: "/placeholder.svg?height=32&width=32", initials: "MB" },
      },
      {
        id: "task-3",
        title: "Backend API development",
        description: "Create new API endpoints for the website",
        status: "in-progress",
        priority: "medium",
        dueDate: "2025-04-28",
        assignee: { name: "Alex Wong", avatar: "/placeholder.svg?height=32&width=32", initials: "AW" },
      },
      {
        id: "task-4",
        title: "Content migration",
        description: "Migrate content from old website to new CMS",
        status: "todo",
        priority: "medium",
        dueDate: "2025-05-05",
        assignee: { name: "John Doe", avatar: "/placeholder.svg?height=32&width=32", initials: "JD" },
      },
    ],
    meetings: [
      { id: "meeting-1", title: "Sprint Planning", date: "2025-04-18", time: "10:00", participants: 4 },
      { id: "meeting-2", title: "Daily Standup", date: "2025-04-19", time: "09:30", participants: 4, recurring: true },
      { id: "meeting-3", title: "Design Review", date: "2025-04-20", time: "14:00", participants: 3 },
    ],
  },
  mobile: {
    id: "mobile",
    name: "Mobile App Launch",
    description: "Development and launch of new mobile application",
    startDate: "2025-04-15",
    endDate: "2025-06-10",
    status: "on-track",
    progress: 40,
    team: [
      {
        id: "user-1",
        name: "John Doe",
        role: "Project Manager",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "JD",
      },
      {
        id: "user-3",
        name: "Mike Brown",
        role: "Frontend Developer",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "MB",
      },
      {
        id: "user-5",
        name: "Alex Wong",
        role: "Backend Developer",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "AW",
      },
      {
        id: "user-6",
        name: "Lisa Martinez",
        role: "Product Manager",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "LM",
      },
      {
        id: "user-7",
        name: "David Kim",
        role: "QA Engineer",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "DK",
      },
    ],
    sprints: [
      {
        id: "sprint-1",
        name: "Sprint 1",
        startDate: "2025-04-15",
        endDate: "2025-04-28",
        status: "completed",
        progress: 100,
      },
      {
        id: "sprint-2",
        name: "Sprint 2",
        startDate: "2025-04-29",
        endDate: "2025-05-12",
        status: "in-progress",
        progress: 30,
      },
      {
        id: "sprint-3",
        name: "Sprint 3",
        startDate: "2025-05-13",
        endDate: "2025-05-26",
        status: "planned",
        progress: 0,
      },
      {
        id: "sprint-4",
        name: "Sprint 4",
        startDate: "2025-05-27",
        endDate: "2025-06-10",
        status: "planned",
        progress: 0,
      },
    ],
    tasks: [
      {
        id: "task-1",
        title: "App architecture design",
        description: "Design the overall architecture of the mobile app",
        status: "done",
        priority: "high",
        dueDate: "2025-04-20",
        assignee: { name: "Alex Wong", avatar: "/placeholder.svg?height=32&width=32", initials: "AW" },
      },
      {
        id: "task-2",
        title: "UI/UX design",
        description: "Create UI/UX design for all app screens",
        status: "done",
        priority: "high",
        dueDate: "2025-04-25",
        assignee: { name: "Lisa Martinez", avatar: "/placeholder.svg?height=32&width=32", initials: "LM" },
      },
      {
        id: "task-3",
        title: "Frontend implementation",
        description: "Implement the UI in React Native",
        status: "in-progress",
        priority: "high",
        dueDate: "2025-05-10",
        assignee: { name: "Mike Brown", avatar: "/placeholder.svg?height=32&width=32", initials: "MB" },
      },
      {
        id: "task-4",
        title: "Backend API development",
        description: "Create API endpoints for the mobile app",
        status: "in-progress",
        priority: "medium",
        dueDate: "2025-05-15",
        assignee: { name: "Alex Wong", avatar: "/placeholder.svg?height=32&width=32", initials: "AW" },
      },
      {
        id: "task-5",
        title: "QA Testing",
        description: "Test the app on different devices",
        status: "todo",
        priority: "medium",
        dueDate: "2025-05-25",
        assignee: { name: "David Kim", avatar: "/placeholder.svg?height=32&width=32", initials: "DK" },
      },
    ],
    meetings: [
      { id: "meeting-1", title: "Sprint Planning", date: "2025-04-29", time: "10:00", participants: 5 },
      { id: "meeting-2", title: "Daily Standup", date: "2025-04-30", time: "09:30", participants: 5, recurring: true },
      { id: "meeting-3", title: "App Demo", date: "2025-05-10", time: "14:00", participants: 5 },
    ],
  },
  branding: {
    id: "branding",
    name: "Brand Refresh",
    description: "Refresh company branding including logo, colors, and style guide",
    startDate: "2025-04-01",
    endDate: "2025-04-10",
    status: "completed",
    progress: 100,
    team: [
      {
        id: "user-1",
        name: "John Doe",
        role: "Project Manager",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "JD",
      },
      {
        id: "user-2",
        name: "Sarah Johnson",
        role: "Senior Designer",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "SJ",
      },
      {
        id: "user-8",
        name: "Rachel Green",
        role: "Marketing Specialist",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "RG",
      },
    ],
    sprints: [
      {
        id: "sprint-1",
        name: "Sprint 1",
        startDate: "2025-04-01",
        endDate: "2025-04-05",
        status: "completed",
        progress: 100,
      },
      {
        id: "sprint-2",
        name: "Sprint 2",
        startDate: "2025-04-06",
        endDate: "2025-04-10",
        status: "completed",
        progress: 100,
      },
    ],
    tasks: [
      {
        id: "task-1",
        title: "Logo redesign",
        description: "Create new company logo",
        status: "done",
        priority: "high",
        dueDate: "2025-04-03",
        assignee: { name: "Sarah Johnson", avatar: "/placeholder.svg?height=32&width=32", initials: "SJ" },
      },
      {
        id: "task-2",
        title: "Color palette selection",
        description: "Select new brand color palette",
        status: "done",
        priority: "medium",
        dueDate: "2025-04-05",
        assignee: { name: "Sarah Johnson", avatar: "/placeholder.svg?height=32&width=32", initials: "SJ" },
      },
      {
        id: "task-3",
        title: "Typography selection",
        description: "Select new brand typography",
        status: "done",
        priority: "medium",
        dueDate: "2025-04-07",
        assignee: { name: "Sarah Johnson", avatar: "/placeholder.svg?height=32&width=32", initials: "SJ" },
      },
      {
        id: "task-4",
        title: "Style guide creation",
        description: "Create comprehensive brand style guide",
        status: "done",
        priority: "high",
        dueDate: "2025-04-10",
        assignee: { name: "Rachel Green", avatar: "/placeholder.svg?height=32&width=32", initials: "RG" },
      },
    ],
    meetings: [
      { id: "meeting-1", title: "Kickoff Meeting", date: "2025-04-01", time: "10:00", participants: 3 },
      { id: "meeting-2", title: "Design Review", date: "2025-04-05", time: "14:00", participants: 3 },
      { id: "meeting-3", title: "Final Presentation", date: "2025-04-10", time: "15:00", participants: 3 },
    ],
  },
}

export default function ProjectDetail({ projectId }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [activeSprint, setActiveSprint] = useState(null)

  // Get project data based on projectId
  const project = projectData[projectId] || null

  if (!project) {
    return (
      <div className="container mx-auto py-6 px-4 md:px-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Project Not Found</h1>
        <p className="text-muted-foreground mt-2">The project you're looking for doesn't exist.</p>
        <Button className="mt-4" onClick={() => router.push("/")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    )
  }

  // Find current sprint
  const currentSprint = project.sprints.find((sprint) => sprint.status === "in-progress") || project.sprints[0]

  // Set active sprint if not set
  if (!activeSprint && currentSprint) {
    setActiveSprint(currentSprint.id)
  }

  // Get tasks for current sprint
  const sprintTasks = {
    todo: project.tasks.filter((task) => task.status === "todo"),
    "in-progress": project.tasks.filter((task) => task.status === "in-progress"),
    review: project.tasks.filter((task) => task.status === "review"),
    done: project.tasks.filter((task) => task.status === "done"),
  }

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "on-track":
        return <Badge className="bg-green-500">On Track</Badge>
      case "at-risk":
        return <Badge className="bg-amber-500">At Risk</Badge>
      case "delayed":
        return <Badge className="bg-red-500">Delayed</Badge>
      case "completed":
        return <Badge className="bg-blue-500">Completed</Badge>
      case "in-progress":
        return <Badge className="bg-blue-500">In Progress</Badge>
      case "planned":
        return <Badge variant="outline">Planned</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  // Handle drag and drop
  const onDragEnd = (result) => {
    // Implementation would go here
    console.log("Drag ended", result)
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" className="mr-4" onClick={() => router.push("/")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
          <p className="text-muted-foreground mt-1">{project.description}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="text-sm flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(project.startDate)} - {formatDate(project.endDate)}
          </Badge>
          {getStatusBadge(project.status)}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Edit className="h-4 w-4" />
            <span>Edit Project</span>
          </Button>
          <Button size="sm" className="gap-1">
            <Plus className="h-4 w-4" />
            <span>Add Task</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Progress</h3>
              <span className="text-sm font-medium">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Team</h3>
              <Badge variant="outline">{project.team.length}</Badge>
            </div>
            <div className="flex -space-x-2 mt-2">
              {project.team.map((member, index) => (
                <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                  <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                  <AvatarFallback>{member.initials}</AvatarFallback>
                </Avatar>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Upcoming</h3>
              <Badge variant="outline">{project.meetings.length}</Badge>
            </div>
            <div className="mt-2 text-sm">
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                <span>
                  Next: {project.meetings[0]?.title} - {formatDate(project.meetings[0]?.date)} at{" "}
                  {project.meetings[0]?.time}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="board">Board</TabsTrigger>
          <TabsTrigger value="sprints">Sprints</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Project Overview</CardTitle>
                  <CardDescription>Key information about the project</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">DESCRIPTION</h3>
                      <p className="mt-1">{project.description}</p>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">START DATE</h3>
                        <p className="mt-1">{formatDate(project.startDate)}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">END DATE</h3>
                        <p className="mt-1">{formatDate(project.endDate)}</p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">STATUS</h3>
                      <div className="mt-1 flex items-center gap-2">
                        {getStatusBadge(project.status)}
                        <span>{project.progress}% Complete</span>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">CURRENT SPRINT</h3>
                      <div className="mt-1">
                        <p className="font-medium">{currentSprint?.name}</p>
                        <div className="flex items-center gap-2 mt-1 text-sm">
                          <span>
                            {formatDate(currentSprint?.startDate)} - {formatDate(currentSprint?.endDate)}
                          </span>
                          {getStatusBadge(currentSprint?.status)}
                        </div>
                        <Progress value={currentSprint?.progress} className="h-2 mt-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest updates and changes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Sarah Johnson" />
                        <AvatarFallback>SJ</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">Sarah Johnson</span> completed task{" "}
                          <span className="font-medium">Design social media assets</span>
                        </p>
                        <p className="text-xs text-muted-foreground">Today at 2:30 PM</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="John Doe" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">John Doe</span> added a comment to{" "}
                          <span className="font-medium">Content calendar planning</span>
                        </p>
                        <p className="text-xs text-muted-foreground">Yesterday at 11:45 AM</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Emily Clark" />
                        <AvatarFallback>EC</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">Emily Clark</span> started working on{" "}
                          <span className="font-medium">Email newsletter design</span>
                        </p>
                        <p className="text-xs text-muted-foreground">Yesterday at 9:15 AM</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>People working on this project</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.team.map((member) => (
                      <div key={member.id} className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback>{member.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Upcoming Meetings</CardTitle>
                  <CardDescription>Scheduled meetings for this project</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.meetings.map((meeting) => (
                      <div key={meeting.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{meeting.title}</h4>
                          {meeting.recurring && (
                            <Badge variant="outline" className="text-xs">
                              Recurring
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span>{formatDate(meeting.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span>{meeting.time}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span>{meeting.participants} participants</span>
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-3 gap-1">
                          <ArrowUpRight className="h-3 w-3" />
                          Join Meeting
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="board" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Task Board</span>
                <Button size="sm" className="gap-1">
                  <Plus className="h-4 w-4" />
                  <span>Add Task</span>
                </Button>
              </CardTitle>
              <CardDescription>Manage tasks for this project</CardDescription>
            </CardHeader>
            <CardContent>
              <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {Object.entries(sprintTasks).map(([status, tasks]) => (
                    <div key={status} className="flex flex-col bg-muted/40 rounded-lg overflow-hidden border shadow-sm">
                      <div className="p-3 font-medium bg-muted/60 border-b flex items-center justify-between sticky top-0 z-10">
                        <h3 className="capitalize">{status.replace("-", " ")}</h3>
                        <span className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          {tasks.length}
                        </span>
                      </div>

                      <Droppable droppableId={status}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`flex-1 p-2 ${snapshot.isDraggingOver ? "bg-muted/80" : ""}`}
                          >
                            <ScrollArea className="h-[calc(100vh-24rem)]">
                              <div className="space-y-2 p-1">
                                {tasks.map((task, index) => (
                                  <TaskCard key={task.id} task={task} index={index} onClick={() => {}} />
                                ))}
                                {provided.placeholder}

                                {tasks.length === 0 && (
                                  <div className="flex flex-col items-center justify-center h-24 text-center p-4 border border-dashed rounded-lg">
                                    <p className="text-sm text-muted-foreground">
                                      {status === "done"
                                        ? "All clear! You're a productivity wizard 🧙‍♂️"
                                        : "No tasks here yet"}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </ScrollArea>
                          </div>
                        )}
                      </Droppable>
                    </div>
                  ))}
                </div>
              </DragDropContext>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sprints" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Sprint Planning</CardTitle>
              <CardDescription>Manage project sprints and milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {project.sprints.map((sprint) => (
                  <div key={sprint.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{sprint.name}</h3>
                      {getStatusBadge(sprint.status)}
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>
                          {formatDate(sprint.startDate)} - {formatDate(sprint.endDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-muted-foreground" />
                        <span>{sprint.progress}% Complete</span>
                      </div>
                    </div>

                    <Progress value={sprint.progress} className="h-2 mt-3" />

                    <div className="flex items-center justify-between mt-4">
                      <Button variant="outline" size="sm" className="gap-1">
                        <MessageSquare className="h-3 w-3" />
                        Sprint Notes
                      </Button>

                      <Button variant="outline" size="sm" className="gap-1">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>People working on this project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.team.map((member) => (
                  <Card key={member.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                            <AvatarFallback>{member.initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{member.name}</h4>
                            <p className="text-xs text-muted-foreground">{member.role}</p>
                          </div>
                        </div>

                        <div className="mt-4 space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Tasks Assigned</span>
                            <Badge variant="outline">
                              {project.tasks.filter((task) => task.assignee.name === member.name).length}
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Completion Rate</span>
                            <span>
                              {Math.round(
                                (project.tasks.filter(
                                  (task) => task.assignee.name === member.name && task.status === "done",
                                ).length /
                                  Math.max(
                                    1,
                                    project.tasks.filter((task) => task.assignee.name === member.name).length,
                                  )) *
                                  100,
                              )}
                              %
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <Button variant="outline" size="sm" className="w-full gap-1">
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
