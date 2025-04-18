"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Clock, Link } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import { motion } from "framer-motion"

// Sample team members for assignee selection
const teamMembers = [
  { id: "user-1", name: "John Doe", avatar: "/placeholder.svg?height=32&width=32", initials: "JD" },
  { id: "user-2", name: "Sarah Johnson", avatar: "/placeholder.svg?height=32&width=32", initials: "SJ" },
  { id: "user-3", name: "Mike Brown", avatar: "/placeholder.svg?height=32&width=32", initials: "MB" },
  { id: "user-4", name: "Emily Clark", avatar: "/placeholder.svg?height=32&width=32", initials: "EC" },
  { id: "user-5", name: "Alex Wong", avatar: "/placeholder.svg?height=32&width=32", initials: "AW" },
]

export default function AddTaskDialog({ open, onOpenChange, onAddTask }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("todo")
  const [priority, setPriority] = useState("medium")
  const [dueDate, setDueDate] = useState(new Date())
  const [assigneeId, setAssigneeId] = useState("user-1")
  const [hasMeeting, setHasMeeting] = useState(false)
  const [meetingTime, setMeetingTime] = useState("09:00")
  const [meetingLink, setMeetingLink] = useState("")

  const [errors, setErrors] = useState({})

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setStatus("todo")
    setPriority("medium")
    setDueDate(new Date())
    setAssigneeId("user-1")
    setHasMeeting(false)
    setMeetingTime("09:00")
    setMeetingLink("")
    setErrors({})
  }

  const validateForm = () => {
    const newErrors = {}

    if (!title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!description.trim()) {
      newErrors.description = "Description is required"
    }

    if (!dueDate) {
      newErrors.dueDate = "Due date is required"
    }

    if (hasMeeting && !meetingTime) {
      newErrors.meetingTime = "Meeting time is required"
    }

    if (hasMeeting && !meetingLink.trim()) {
      newErrors.meetingLink = "Meeting link is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Find the selected assignee
    const assignee = teamMembers.find((member) => member.id === assigneeId)

    // Format the due date
    const formattedDueDate = format(dueDate, "yyyy-MM-dd")

    // Create the new task object
    const newTask = {
      title,
      description,
      status,
      priority,
      dueDate: formattedDueDate,
      assignee,
      meeting: hasMeeting
        ? {
            title: `Meeting for ${title}`,
            time: meetingTime,
            link: meetingLink,
          }
        : null,
    }

    // Call the onAddTask callback
    onAddTask(newTask)

    // Reset the form and close the dialog
    resetForm()
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) resetForm()
        onOpenChange(isOpen)
      }}
    >
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-right">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              className={cn(errors.title && "border-destructive")}
            />
            {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-right">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              className={cn(errors.description && "border-destructive")}
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">
                Due Date <span className="text-destructive">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground",
                      errors.dueDate && "border-destructive",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                </PopoverContent>
              </Popover>
              {errors.dueDate && <p className="text-xs text-destructive">{errors.dueDate}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignee">Assignee</Label>
              <Select value={assigneeId} onValueChange={setAssigneeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="meeting-toggle">Include Meeting</Label>
              <Switch id="meeting-toggle" checked={hasMeeting} onCheckedChange={setHasMeeting} />
            </div>
          </div>

          {hasMeeting && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 border-t pt-4"
            >
              <div className="space-y-2">
                <Label htmlFor="meeting-time">
                  Meeting Time <span className="text-destructive">*</span>
                </Label>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="meeting-time"
                    type="time"
                    value={meetingTime}
                    onChange={(e) => setMeetingTime(e.target.value)}
                    className={cn("w-full", errors.meetingTime && "border-destructive")}
                  />
                </div>
                {errors.meetingTime && <p className="text-xs text-destructive">{errors.meetingTime}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="meeting-link">
                  Meeting Link <span className="text-destructive">*</span>
                </Label>
                <div className="flex items-center">
                  <Link className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="meeting-link"
                    type="url"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    placeholder="https://meet.google.com/..."
                    className={cn("w-full", errors.meetingLink && "border-destructive")}
                  />
                </div>
                {errors.meetingLink && <p className="text-xs text-destructive">{errors.meetingLink}</p>}
              </div>
            </motion.div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
