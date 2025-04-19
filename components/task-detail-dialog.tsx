"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Clock, Link, CheckCircle2, AlertCircle } from "lucide-react"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Switch } from "@/components/ui/switch"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample team members for assignee selection
const teamMembers = [
  { id: "user-1", name: "John Doe", avatar: "/placeholder.svg?height=32&width=32", initials: "JD" },
  { id: "user-2", name: "Sarah Johnson", avatar: "/placeholder.svg?height=32&width=32", initials: "SJ" },
  { id: "user-3", name: "Mike Brown", avatar: "/placeholder.svg?height=32&width=32", initials: "MB" },
  { id: "user-4", name: "Emily Clark", avatar: "/placeholder.svg?height=32&width=32", initials: "EC" },
  { id: "user-5", name: "Alex Wong", avatar: "/placeholder.svg?height=32&width=32", initials: "AW" },
]

export default function TaskDetailDialog({ open, onOpenChange, task, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("")
  const [priority, setPriority] = useState("")
  const [dueDate, setDueDate] = useState(new Date())
  const [assigneeId, setAssigneeId] = useState("")
  const [hasMeeting, setHasMeeting] = useState(false)
  const [meetingTime, setMeetingTime] = useState("")
  const [meetingLink, setMeetingLink] = useState("")
  const [activeTab, setActiveTab] = useState("details")
  const [confirmDelete, setConfirmDelete] = useState(false)

  // Initialize form with task data when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title || "")
      setDescription(task.description || "")
      setStatus(task.status || "todo")
      setPriority(task.priority || "medium")
      setDueDate(task.dueDate ? new Date(task.dueDate) : new Date())
      setAssigneeId(task.assignee?.id || "user-1")
      setHasMeeting(!!task.meeting)
      setMeetingTime(task.meeting?.time || "09:00")
      setMeetingLink(task.meeting?.link || "")
      setIsEditing(false)
      setConfirmDelete(false)
    }
  }, [task])

  const handleSave = () => {
    if (!task) return

    // Find the selected assignee
    const assignee = teamMembers.find((member) => member.id === assigneeId)

    // Format the due date
    const formattedDueDate = format(dueDate, "yyyy-MM-dd")

    // Create the updated task object
    const updatedTask = {
      ...task,
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

    // Call the onUpdate callback
    onUpdate(updatedTask)
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (confirmDelete && task) {
      onDelete(task.id)
    } else {
      setConfirmDelete(true)
    }
  }

  const handleStatusChange = (newStatus) => {
    if (!isEditing) {
      const updatedTask = {
        ...task,
        status: newStatus,
      }
      onUpdate(updatedTask)
    } else {
      setStatus(newStatus)
    }
  }

  // Get priority badge variant
  const getPriorityVariant = (priorityValue) => {
    switch (priorityValue) {
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

  // Format date to readable format
  const formatDateReadable = (dateString) => {
    const date = new Date(dateString)
    return format(date, "MMMM d, yyyy")
  }

  if (!task) return null

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setIsEditing(false)
          setConfirmDelete(false)
        }
        onOpenChange(isOpen)
      }}
    >
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto" style={{ zIndex: 50 }}>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{isEditing ? "Edit Task" : "Task Details"}</span>
            <div className="flex items-center gap-2">
              {!isEditing && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
              )}
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                className={confirmDelete ? "animate-pulse" : ""}
              >
                {confirmDelete ? "Confirm Delete" : "Delete"}
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="activity">Activity & Comments</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 py-4">
            {isEditing ? (
              // Edit mode
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter task title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter task description"
                    rows={4}
                  />
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
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start" side="bottom" sideOffset={4}>
                        <CalendarComponent mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                      </PopoverContent>
                    </Popover>
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

                <AnimatePresence>
                  {hasMeeting && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 border-t pt-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="meeting-time">Meeting Time</Label>
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="meeting-time"
                            type="time"
                            value={meetingTime}
                            onChange={(e) => setMeetingTime(e.target.value)}
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="meeting-link">Meeting Link</Label>
                        <div className="flex items-center">
                          <Link className="mr-2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="meeting-link"
                            type="url"
                            value={meetingLink}
                            onChange={(e) => setMeetingLink(e.target.value)}
                            placeholder="https://meet.google.com/..."
                            className="w-full"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              // View mode
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold">{task.title}</h2>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge variant={getPriorityVariant(task.priority)}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                    </Badge>

                    <Badge variant="outline" className="flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      {formatDateReadable(task.dueDate)}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} alt={task.assignee.name} />
                      <AvatarFallback>{task.assignee.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{task.assignee.name}</p>
                      <p className="text-xs text-muted-foreground">Assignee</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <p className="text-sm font-medium">Current Status</p>
                    <Select value={task.status} onValueChange={handleStatusChange}>
                      <SelectTrigger className="w-[140px] h-8 mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium mb-2">Description</h3>
                  <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                    {task.description || "No description provided."}
                  </div>
                </div>

                {task.meeting && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium mb-2">Meeting Details</h3>
                      <div className="bg-muted/50 p-3 rounded-md">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{task.meeting.time}</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1"
                            onClick={() => window.open(task.meeting.link, "_blank")}
                          >
                            <Link className="h-3 w-3" />
                            Join Meeting
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Created 3 days ago
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Updated yesterday
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="activity" className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Activity & Comments</h3>
                <Button variant="outline" size="sm">
                  Add Comment
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Sarah Johnson" />
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-muted/50 p-3 rounded-md">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium">Sarah Johnson</p>
                        <span className="text-xs text-muted-foreground">Yesterday at 2:30 PM</span>
                      </div>
                      <p className="text-sm">
                        I've started working on this. Will update the design assets by tomorrow.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Mike Brown changed status from "To Do" to "In Progress" - 2 days ago</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <AlertCircle className="h-3 w-3" />
                  <span>John Doe changed priority from "Medium" to "High" - 3 days ago</span>
                </div>

                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="John Doe" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-muted/50 p-3 rounded-md">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium">John Doe</p>
                        <span className="text-xs text-muted-foreground">3 days ago</span>
                      </div>
                      <p className="text-sm">Created this task and assigned to Sarah Johnson.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </>
          ) : (
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
