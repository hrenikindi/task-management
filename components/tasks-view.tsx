"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Filter, SortAsc, SortDesc, CheckCircle2, Circle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import AddTaskDialog from "@/components/add-task-dialog"
import { useToast } from "@/components/ui/use-toast"

// Sample data
import { initialTasks } from "@/lib/sample-data"

export default function TasksView() {
  const [tasks, setTasks] = useState(initialTasks)
  const [activeTab, setActiveTab] = useState("all")
  const [sortOrder, setSortOrder] = useState("dueDate-asc")
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const { toast } = useToast()

  // Filter tasks based on active tab
  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "all") return true
    if (activeTab === "completed") return task.status === "done"
    if (activeTab === "pending") return task.status !== "done"
    if (activeTab === "overdue") {
      const today = new Date()
      const dueDate = new Date(task.dueDate)
      return dueDate < today && task.status !== "done"
    }
    return true
  })

  // Sort tasks based on sort order
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const [field, direction] = sortOrder.split("-")

    if (field === "dueDate") {
      const dateA = new Date(a.dueDate)
      const dateB = new Date(b.dueDate)
      return direction === "asc" ? dateA - dateB : dateB - dateA
    }

    if (field === "priority") {
      const priorityOrder = { low: 1, medium: 2, high: 3 }
      return direction === "asc"
        ? priorityOrder[a.priority] - priorityOrder[b.priority]
        : priorityOrder[b.priority] - priorityOrder[a.priority]
    }

    return 0
  })

  const handleAddTask = (newTask) => {
    // Generate a unique ID for the new task
    const taskId = `task-${Date.now()}`

    // Create the new task object
    const task = {
      id: taskId,
      title: newTask.title,
      description: newTask.description,
      status: newTask.status,
      priority: newTask.priority,
      dueDate: newTask.dueDate,
      assignee: newTask.assignee,
      meeting: newTask.meeting,
    }

    // Add the new task to the tasks array
    setTasks((prevTasks) => [...prevTasks, task])

    // Show success toast
    toast({
      title: "Task added successfully!",
      description: `"${newTask.title}" has been added to ${newTask.status}.`,
      variant: "success",
    })
  }

  const toggleTaskStatus = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          const newStatus = task.status === "done" ? "todo" : "done"

          // Show toast notification
          toast({
            title: newStatus === "done" ? "Task completed! 🎉" : "Task reopened",
            description:
              newStatus === "done"
                ? "Great job on finishing this task!"
                : "The task has been moved back to your to-do list.",
            variant: newStatus === "done" ? "success" : "default",
          })

          return { ...task, status: newStatus }
        }
        return task
      }),
    )
  }

  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return format(date, "MMM d, yyyy")
  }

  // Check if date is overdue
  const isOverdue = (dateString) => {
    const today = new Date()
    const dueDate = new Date(dateString)
    return dueDate < today
  }

  // Get priority badge variant
  const getPriorityVariant = (priority) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "warning"
      case "low":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
          <p className="text-muted-foreground mt-1">Manage and organize your tasks</p>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortOrder("dueDate-asc")}>
                <SortAsc className="h-4 w-4 mr-2" />
                Date (Earliest first)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("dueDate-desc")}>
                <SortDesc className="h-4 w-4 mr-2" />
                Date (Latest first)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("priority-desc")}>
                <SortAsc className="h-4 w-4 mr-2" />
                Priority (High to Low)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("priority-asc")}>
                <SortDesc className="h-4 w-4 mr-2" />
                Priority (Low to High)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button onClick={() => setIsAddTaskOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>
                {activeTab === "all" && "All Tasks"}
                {activeTab === "pending" && "Pending Tasks"}
                {activeTab === "completed" && "Completed Tasks"}
                {activeTab === "overdue" && "Overdue Tasks"}
                <Badge variant="outline" className="ml-2">
                  {sortedTasks.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-16rem)]">
                <div className="space-y-4">
                  {sortedTasks.length > 0 ? (
                    sortedTasks.map((task) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`p-4 border rounded-lg ${task.status === "done" ? "bg-muted/50" : "bg-card"}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="pt-1">
                            <Checkbox
                              checked={task.status === "done"}
                              onCheckedChange={() => toggleTaskStatus(task.id)}
                              className="h-5 w-5"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <h3
                                className={`font-medium ${task.status === "done" ? "line-through text-muted-foreground" : ""}`}
                              >
                                {task.title}
                              </h3>

                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant={getPriorityVariant(task.priority)}>{task.priority}</Badge>

                                <div
                                  className={`flex items-center text-xs ${
                                    isOverdue(task.dueDate) && task.status !== "done"
                                      ? "text-destructive"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  <Clock className="h-3 w-3 mr-1" />
                                  {formatDate(task.dueDate)}
                                </div>
                              </div>
                            </div>

                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{task.description}</p>

                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage
                                    src={task.assignee.avatar || "/placeholder.svg"}
                                    alt={task.assignee.name}
                                  />
                                  <AvatarFallback>{task.assignee.initials}</AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-muted-foreground ml-2">{task.assignee.name}</span>
                              </div>

                              <div className="flex items-center">
                                <Badge variant="outline" className="text-xs">
                                  {task.status === "todo" && "To Do"}
                                  {task.status === "in-progress" && "In Progress"}
                                  {task.status === "review" && "Review"}
                                  {task.status === "done" && "Done"}
                                </Badge>
                              </div>
                            </div>

                            {task.meeting && (
                              <div className="mt-3 pt-3 border-t flex items-center justify-between">
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  <span>{task.meeting.time}</span>
                                </div>

                                <Button variant="outline" size="sm" className="h-7 text-xs">
                                  Join Meeting
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      {activeTab === "all" && (
                        <>
                          <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium">No tasks yet</h3>
                          <p className="text-muted-foreground mt-1">Add your first task to get started</p>
                          <Button onClick={() => setIsAddTaskOpen(true)} className="mt-4">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Task
                          </Button>
                        </>
                      )}

                      {activeTab === "pending" && (
                        <>
                          <Circle className="h-12 w-12 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium">No pending tasks</h3>
                          <p className="text-muted-foreground mt-1">You've completed all your tasks!</p>
                        </>
                      )}

                      {activeTab === "completed" && (
                        <>
                          <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium">No completed tasks</h3>
                          <p className="text-muted-foreground mt-1">Complete a task to see it here</p>
                        </>
                      )}

                      {activeTab === "overdue" && (
                        <>
                          <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium">No overdue tasks</h3>
                          <p className="text-muted-foreground mt-1">You're on top of your deadlines!</p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Task Dialog */}
      <AddTaskDialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen} onAddTask={handleAddTask} />
    </div>
  )
}
