"use client"

import { useState } from "react"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function CalendarView({ tasks, meetings }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth())
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear())

  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }

  // Get day of week for first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay()
  }

  // Navigate to previous month
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  // Navigate to next month
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  // Format date to YYYY-MM-DD
  const formatDate = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  // Get tasks for a specific date
  const getTasksForDate = (year, month, day) => {
    const dateString = formatDate(year, month, day)
    return tasks.filter((task) => task.dueDate === dateString)
  }

  // Get meetings for a specific date
  const getMeetingsForDate = (year, month, day) => {
    const dateString = formatDate(year, month, day)
    return meetings.filter((meeting) => meeting.date === dateString)
  }

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth)
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth)
    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  // Get month name
  const getMonthName = (month) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    return monthNames[month]
  }

  // Check if date is today
  const isToday = (year, month, day) => {
    const today = new Date()
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
  }

  const calendarDays = generateCalendarDays()
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <CalendarIcon className="mr-2 h-5 w-5" />
          <h2 className="text-xl font-semibold">
            {getMonthName(currentMonth)} {currentYear}
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekdays.map((day) => (
          <div key={day} className="text-center text-sm font-medium py-2">
            {day}
          </div>
        ))}

        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="h-24 p-1 bg-muted/20 rounded-md" />
          }

          const tasksForDay = getTasksForDate(currentYear, currentMonth, day)
          const meetingsForDay = getMeetingsForDate(currentYear, currentMonth, day)
          const hasItems = tasksForDay.length > 0 || meetingsForDay.length > 0

          return (
            <motion.div
              key={`day-${day}`}
              className={`h-24 p-1 rounded-md border ${
                isToday(currentYear, currentMonth, day)
                  ? "border-primary bg-primary/5"
                  : hasItems
                    ? "border-muted-foreground/20 bg-card"
                    : "border-transparent bg-muted/20"
              }`}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col h-full">
                <div className="text-right text-sm p-1">{day}</div>

                <ScrollArea className="flex-1">
                  <div className="space-y-1">
                    {tasksForDay.map((task) => (
                      <div
                        key={task.id}
                        className={`text-xs p-1 rounded ${
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

                    {meetingsForDay.map((meeting) => (
                      <div key={meeting.id} className="text-xs p-1 rounded bg-blue-500/10 text-blue-500">
                        {meeting.time} - {meeting.title}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
