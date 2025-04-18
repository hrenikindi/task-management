"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
} from "date-fns"
import AddTaskDialog from "@/components/add-task-dialog"
import { useToast } from "@/components/ui/use-toast"

// Sample data
import { initialTasks, initialMeetings } from "@/lib/sample-data"

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [tasks, setTasks] = useState(initialTasks)
  const [meetings, setMeetings] = useState(initialMeetings)
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const { toast } = useToast()

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  // Navigate to today
  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Get days in current month view
  const getDaysInMonth = () => {
    const start = startOfMonth(currentDate)
    const end = endOfMonth(currentDate)
    return eachDayOfInterval({ start, end })
  }

  // Get day of week for first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = () => {
    return startOfMonth(currentDate).getDay()
  }

  // Format date to YYYY-MM-DD
  const formatDateString = (date) => {
    return format(date, "yyyy-MM-dd")
  }

  // Get tasks for a specific date
  const getTasksForDate = (date) => {
    const dateString = formatDateString(date)
    return tasks.filter((task) => task.dueDate === dateString)
  }

  // Get meetings for a specific date
  const getMeetingsForDate = (date) => {
    const dateString = formatDateString(date)
    return meetings.filter((meeting) => meeting.date === dateString)
  }

  // Handle adding a new task
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

  // Handle day click
  const handleDayClick = (date) => {
    setSelectedDate(date)
    setIsAddTaskOpen(true)
  }

  // Generate calendar days
  const days = getDaysInMonth()
  const firstDayOfMonth = getFirstDayOfMonth()
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Create empty cells for days before the first day of the month
  const emptyCells = Array.from({ length: firstDayOfMonth }, (_, i) => (
    <div key={`empty-${i}`} className="h-24 p-1 bg-muted/20 rounded-md" />
  ))

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground mt-1">View your tasks and meetings</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <span className="text-lg font-medium ml-2">{format(currentDate, "MMMM yyyy")}</span>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span>Calendar View</span>
            <Button
              size="sm"
              onClick={() => {
                setSelectedDate(new Date())
                setIsAddTaskOpen(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekdays.map((day) => (
              <div key={day} className="text-center text-sm font-medium py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {emptyCells}

            {days.map((day) => {
              const tasksForDay = getTasksForDate(day)
              const meetingsForDay = getMeetingsForDate(day)
              const hasItems = tasksForDay.length > 0 || meetingsForDay.length > 0
              const isCurrentMonth = isSameMonth(day, currentDate)
              const isCurrentDay = isToday(day)

              return (
                <motion.div
                  key={day.toString()}
                  className={`h-24 p-1 rounded-md border cursor-pointer transition-colors ${
                    isCurrentDay
                      ? "border-primary bg-primary/5"
                      : hasItems
                        ? "border-muted-foreground/20 bg-card hover:border-primary/50"
                        : "border-transparent bg-muted/20 hover:bg-muted/30"
                  } ${!isCurrentMonth ? "opacity-50" : ""}`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => handleDayClick(day)}
                >
                  <div className="flex flex-col h-full">
                    <div className={`text-right text-sm p-1 ${isCurrentDay ? "font-bold text-primary" : ""}`}>
                      {format(day, "d")}
                    </div>

                    <ScrollArea className="flex-1">
                      <div className="space-y-1">
                        {tasksForDay.slice(0, 2).map((task) => (
                          <div
                            key={task.id}
                            className={`text-xs p-1 rounded truncate ${
                              task.priority === "high"
                                ? "bg-destructive/10 text-destructive"
                                : task.priority === "medium"
                                  ? "bg-amber-500/10 text-amber-500"
                                  : "bg-secondary/50"
                            }`}
                          >
                            {task.title}
                          </div>
                        ))}

                        {meetingsForDay.slice(0, 2).map((meeting) => (
                          <div key={meeting.id} className="text-xs p-1 rounded bg-blue-500/10 text-blue-500 truncate">
                            {meeting.time} - {meeting.title}
                          </div>
                        ))}

                        {(tasksForDay.length > 2 || meetingsForDay.length > 2) && (
                          <div className="text-xs text-center text-muted-foreground">
                            +{tasksForDay.length + meetingsForDay.length - 4} more
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Add Task Dialog */}
      <AddTaskDialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen} onAddTask={handleAddTask} />
    </div>
  )
}
