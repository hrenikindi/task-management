"use client"

import { useState, useEffect } from "react"
import { DragDropContext } from "@hello-pangea/dnd"
import { useTheme } from "next-themes"
import { Calendar, LayoutGrid, Plus, Moon, Sun, Bell, Filter } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import TaskColumn from "@/components/task-column"
import CalendarView from "@/components/calendar-view"
import MeetingsPanel from "@/components/meetings-panel"
import ReminderToast from "@/components/reminder-toast"
import AddTaskDialog from "@/components/add-task-dialog"
import TaskDetailDialog from "@/components/task-detail-dialog"

// Sample data
import { initialTasks, initialMeetings } from "@/lib/sample-data"

export default function ProjectManagementBoard() {
  const [tasks, setTasks] = useState(initialTasks)
  const [meetings, setMeetings] = useState(initialMeetings)
  const [activeView, setActiveView] = useState("board")
  const [showReminder, setShowReminder] = useState(false)
  const [reminderMessage, setReminderMessage] = useState("")
  const [progress, setProgress] = useState(0)
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  // Handle hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Calculate progress based on completed tasks
  useEffect(() => {
    const totalTasks = tasks.length
    const completedTasks = tasks.filter((task) => task.status === "done").length
    setProgress(totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0)

    // Show reminder for tasks with approaching deadlines
    const today = new Date()
    const approachingDeadlines = tasks.filter((task) => {
      if (task.status === "done") return false
      const deadline = new Date(task.dueDate)
      const diffTime = deadline.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays <= 2 && diffDays >= 0
    })

    if (approachingDeadlines.length > 0 && !showReminder && !reminderMessage) {
      setReminderMessage(`⚠️ Uh-oh! Deadline's close for "${approachingDeadlines[0].title}". Let's crush it!`)
      setShowReminder(true)

      // Auto-hide reminder after 5 seconds
      setTimeout(() => {
        setShowReminder(false)
      }, 5000)
    }
  }, [tasks, showReminder, reminderMessage])

  // Handle drag and drop
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result

    // If there's no destination or the item is dropped in the same place
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    // Update task status
    const updatedTasks = tasks.map((task) => {
      if (task.id === draggableId) {
        return { ...task, status: destination.droppableId }
      }
      return task
    })

    setTasks(updatedTasks)

    // Show completion message if moved to done
    if (destination.droppableId === "done" && source.droppableId !== "done") {
      toast({
        title: "Task completed! 🎉",
        description: "Great job on finishing this task!",
        variant: "success",
      })
    }
  }

  const dismissReminder = () => {
    setShowReminder(false)
    setReminderMessage("")
  }

  const acknowledgeReminder = () => {
    setShowReminder(false)
    // Additional logic for acknowledged reminders could go here
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")

    // Show toast notification for theme change
    toast({
      title: `Switched to ${theme === "dark" ? "light" : "dark"} mode`,
      description: `Your preference has been saved.`,
      duration: 2000,
    })
  }

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

  const handleTaskClick = (task) => {
    setSelectedTask(task)
    setIsTaskDetailOpen(true)
  }

  const handleTaskUpdate = (updatedTask) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))

    toast({
      title: "Task updated",
      description: "The task has been successfully updated.",
      variant: "success",
    })
  }

  const handleTaskDelete = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
    setIsTaskDetailOpen(false)

    toast({
      title: "Task deleted",
      description: "The task has been permanently removed.",
      variant: "destructive",
    })
  }

  if (!mounted) {
    return null // Avoid rendering with incorrect theme
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="border-b bg-card p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Project Dashboard</h1>
            <Badge variant="outline" className="ml-2">
              Marketing Campaign
            </Badge>
          </div>
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    3
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between p-2 border-b">
                  <span className="font-medium">Notifications</span>
                  <Button variant="ghost" size="sm">
                    Mark all as read
                  </Button>
                </div>
                <div className="max-h-80 overflow-auto">
                  <div className="p-2 border-b hover:bg-muted/50 cursor-pointer">
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 mt-1.5 rounded-full bg-primary"></div>
                      <div>
                        <p className="text-sm font-medium">New comment on "Website Redesign"</p>
                        <p className="text-xs text-muted-foreground">Sarah Johnson • 10 minutes ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 border-b hover:bg-muted/50 cursor-pointer">
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 mt-1.5 rounded-full bg-primary"></div>
                      <div>
                        <p className="text-sm font-medium">Task assigned to you: "Create social media assets"</p>
                        <p className="text-xs text-muted-foreground">Mike Brown • 1 hour ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 hover:bg-muted/50 cursor-pointer">
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 mt-1.5 rounded-full bg-primary"></div>
                      <div>
                        <p className="text-sm font-medium">Meeting reminder: "Design Review"</p>
                        <p className="text-xs text-muted-foreground">Today at 2:30 PM</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-2 border-t text-center">
                  <Button variant="ghost" size="sm" className="w-full">
                    View all notifications
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center space-x-2">
              <Switch id="theme-toggle" checked={theme === "dark"} onCheckedChange={toggleTheme} />
              <Label htmlFor="theme-toggle" className="sr-only">
                Toggle theme
              </Label>
              {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </div>

            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-sm">
              Team: Marketing
            </Badge>
            <Badge variant="secondary" className="text-sm">
              Due: Apr 30, 2025
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Progress:</span>
            <Progress value={progress} className="w-40 h-2" />
            <span className="text-sm font-medium">{Math.round(progress)}%</span>
          </div>
        </div>
      </header>

      {/* View toggle */}
      <div className="bg-card p-4 border-b sticky top-[137px] z-10">
        <Tabs defaultValue="board" value={activeView} onValueChange={setActiveView}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="board" className="flex items-center gap-1">
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">Board</span>
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Calendar</span>
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">Filter</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      setTasks(initialTasks)
                      toast({
                        title: "Filter applied",
                        description: "Showing all tasks",
                      })
                    }}
                  >
                    All Tasks
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      const filtered = initialTasks.filter((task) => task.assignee.name === "John Doe")
                      setTasks(filtered)
                      toast({
                        title: "Filter applied",
                        description: "Showing my tasks only",
                      })
                    }}
                  >
                    My Tasks
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      const filtered = initialTasks.filter((task) => task.priority === "high")
                      setTasks(filtered)
                      toast({
                        title: "Filter applied",
                        description: "Showing high priority tasks only",
                      })
                    }}
                  >
                    High Priority
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      const today = new Date()
                      const nextWeek = new Date()
                      nextWeek.setDate(today.getDate() + 7)

                      const filtered = initialTasks.filter((task) => {
                        const dueDate = new Date(task.dueDate)
                        return dueDate >= today && dueDate <= nextWeek
                      })

                      setTasks(filtered)
                      toast({
                        title: "Filter applied",
                        description: "Showing tasks due this week",
                      })
                    }}
                  >
                    Due This Week
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="default" size="sm" className="gap-1" onClick={() => setIsAddTaskOpen(true)}>
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Task</span>
              </Button>
            </div>
          </div>

          {/* Main content area */}
          <TabsContent value="board" className="m-0 p-0">
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 h-[calc(100vh-13rem)] overflow-auto">
                <TaskColumn
                  title="To Do"
                  tasks={tasks.filter((task) => task.status === "todo")}
                  id="todo"
                  onTaskClick={handleTaskClick}
                />
                <TaskColumn
                  title="In Progress"
                  tasks={tasks.filter((task) => task.status === "in-progress")}
                  id="in-progress"
                  onTaskClick={handleTaskClick}
                />
                <TaskColumn
                  title="Review"
                  tasks={tasks.filter((task) => task.status === "review")}
                  id="review"
                  onTaskClick={handleTaskClick}
                />
                <TaskColumn
                  title="Done"
                  tasks={tasks.filter((task) => task.status === "done")}
                  id="done"
                  onTaskClick={handleTaskClick}
                />
              </div>
            </DragDropContext>
          </TabsContent>

          <TabsContent value="calendar" className="m-0 p-0">
            <div className="p-4 h-[calc(100vh-13rem)] overflow-auto">
              <CalendarView tasks={tasks} meetings={meetings} onTaskClick={handleTaskClick} />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Meetings panel - fixed at bottom */}
      <div className="border-t bg-card mt-auto">
        <MeetingsPanel meetings={meetings} />
      </div>

      {/* Add Task Dialog */}
      <AddTaskDialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen} onAddTask={handleAddTask} />

      {/* Task Detail Dialog */}
      <TaskDetailDialog
        open={isTaskDetailOpen}
        onOpenChange={setIsTaskDetailOpen}
        task={selectedTask}
        onUpdate={handleTaskUpdate}
        onDelete={handleTaskDelete}
      />

      {/* Floating action button for mobile */}
      <div className="md:hidden fixed bottom-20 right-4 z-20">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <Button size="icon" className="h-14 w-14 rounded-full shadow-lg" onClick={() => setIsAddTaskOpen(true)}>
            <Plus className="h-6 w-6" />
          </Button>
        </motion.div>
      </div>

      {/* Reminders */}
      <AnimatePresence>
        {showReminder && (
          <ReminderToast message={reminderMessage} onDismiss={dismissReminder} onAcknowledge={acknowledgeReminder} />
        )}
      </AnimatePresence>
    </div>
  )
}
