"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Video, Users, CalendarIcon, Clock, Link2, MoreHorizontal, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, addDays } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

// Sample data
import { initialMeetings } from "@/lib/sample-data"

// Sample team members for meeting participants
const teamMembers = [
  { id: "user-1", name: "John Doe", avatar: "/placeholder.svg?height=32&width=32", initials: "JD" },
  { id: "user-2", name: "Sarah Johnson", avatar: "/placeholder.svg?height=32&width=32", initials: "SJ" },
  { id: "user-3", name: "Mike Brown", avatar: "/placeholder.svg?height=32&width=32", initials: "MB" },
  { id: "user-4", name: "Emily Clark", avatar: "/placeholder.svg?height=32&width=32", initials: "EC" },
  { id: "user-5", name: "Alex Wong", avatar: "/placeholder.svg?height=32&width=32", initials: "AW" },
]

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState(initialMeetings)
  const [activeTab, setActiveTab] = useState("upcoming")
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddMeetingOpen, setIsAddMeetingOpen] = useState(false)
  const { toast } = useToast()

  // Form state for new meeting
  const [title, setTitle] = useState("")
  const [date, setDate] = useState(new Date())
  const [time, setTime] = useState("09:00")
  const [duration, setDuration] = useState("30")
  const [link, setLink] = useState("")
  const [description, setDescription] = useState("")
  const [participants, setParticipants] = useState(["user-1"])
  const [errors, setErrors] = useState({})

  // Filter meetings based on active tab
  const filteredMeetings = meetings.filter((meeting) => {
    // Apply search filter
    if (searchQuery && !meeting.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    const meetingDate = new Date(meeting.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (activeTab === "upcoming") {
      return meetingDate >= today
    }

    if (activeTab === "past") {
      return meetingDate < today
    }

    if (activeTab === "today") {
      return format(meetingDate, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")
    }

    return true
  })

  // Sort meetings by date and time
  const sortedMeetings = [...filteredMeetings].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`)
    const dateB = new Date(`${b.date}T${b.time}`)
    return dateA - dateB
  })

  const resetForm = () => {
    setTitle("")
    setDate(new Date())
    setTime("09:00")
    setDuration("30")
    setLink("")
    setDescription("")
    setParticipants(["user-1"])
    setErrors({})
  }

  const validateForm = () => {
    const newErrors = {}

    if (!title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!date) {
      newErrors.date = "Date is required"
    }

    if (!time) {
      newErrors.time = "Time is required"
    }

    if (!link.trim()) {
      newErrors.link = "Meeting link is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddMeeting = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Generate a unique ID for the new meeting
    const meetingId = `meeting-${Date.now()}`

    // Format the date
    const formattedDate = format(date, "yyyy-MM-dd")

    // Create the new meeting object
    const newMeeting = {
      id: meetingId,
      title,
      date: formattedDate,
      time,
      participants: participants.length,
      link,
      description,
      duration: Number.parseInt(duration),
    }

    // Add the new meeting to the meetings array
    setMeetings((prevMeetings) => [...prevMeetings, newMeeting])

    // Show success toast
    toast({
      title: "Meeting scheduled!",
      description: `"${title}" has been scheduled for ${format(date, "MMM d")} at ${time}.`,
      variant: "success",
    })

    // Reset the form and close the dialog
    resetForm()
    setIsAddMeetingOpen(false)
  }

  // Format date to readable format
  const formatMeetingDate = (dateString) => {
    const date = new Date(dateString)
    return format(date, "EEEE, MMMM d, yyyy")
  }

  // Check if meeting is happening now
  const isHappeningNow = (meetingDate, meetingTime, duration) => {
    const now = new Date()
    const [hours, minutes] = meetingTime.split(":").map(Number)

    const startTime = new Date(meetingDate)
    startTime.setHours(hours, minutes, 0, 0)

    const endTime = new Date(startTime)
    endTime.setMinutes(endTime.getMinutes() + (duration || 30))

    return now >= startTime && now <= endTime
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meetings</h1>
          <p className="text-muted-foreground mt-1">Schedule and manage your meetings</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search meetings..."
              className="pl-8 w-[200px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button onClick={() => setIsAddMeetingOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Meeting
          </Button>
        </div>
      </div>

      <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>
                {activeTab === "upcoming" && "Upcoming Meetings"}
                {activeTab === "today" && "Today's Meetings"}
                {activeTab === "past" && "Past Meetings"}
                <Badge variant="outline" className="ml-2">
                  {sortedMeetings.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sortedMeetings.length > 0 ? (
                  sortedMeetings.map((meeting) => {
                    const isNow = isHappeningNow(meeting.date, meeting.time, meeting.duration)

                    return (
                      <motion.div
                        key={meeting.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`border rounded-lg p-4 ${isNow ? "border-primary bg-primary/5" : ""}`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-md ${isNow ? "bg-primary/10" : "bg-secondary/10"}`}>
                              <Video className={`h-5 w-5 ${isNow ? "text-primary" : "text-secondary-foreground"}`} />
                            </div>

                            <div>
                              <h3 className="font-medium">{meeting.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{formatMeetingDate(meeting.date)}</p>

                              <div className="flex flex-wrap items-center gap-3 mt-2">
                                <div className="flex items-center text-sm">
                                  <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                                  <span>{meeting.time}</span>
                                  {meeting.duration && (
                                    <span className="text-muted-foreground ml-1">({meeting.duration} min)</span>
                                  )}
                                </div>

                                <div className="flex items-center text-sm">
                                  <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                                  <span>{meeting.participants} participants</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 ml-auto">
                            {isNow ? (
                              <Badge variant="default" className="animate-pulse">
                                Now
                              </Badge>
                            ) : (
                              activeTab === "upcoming" && (
                                <Badge variant="outline">
                                  {format(new Date(meeting.date), "MMM d") === format(new Date(), "MMM d")
                                    ? "Today"
                                    : format(new Date(meeting.date), "MMM d") ===
                                        format(addDays(new Date(), 1), "MMM d")
                                      ? "Tomorrow"
                                      : format(new Date(meeting.date), "MMM d")}
                                </Badge>
                              )
                            )}

                            <Button variant="outline" size="sm" className="gap-1">
                              <Link2 className="h-4 w-4" />
                              <span>Join</span>
                            </Button>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Copy link</DropdownMenuItem>
                                <DropdownMenuItem>Cancel meeting</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No meetings found</h3>
                    <p className="text-muted-foreground mt-1">
                      {activeTab === "upcoming" && "You don't have any upcoming meetings"}
                      {activeTab === "today" && "You don't have any meetings scheduled for today"}
                      {activeTab === "past" && "You don't have any past meetings"}
                    </p>
                    <Button onClick={() => setIsAddMeetingOpen(true)} className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule Meeting
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Meeting Dialog */}
      <Dialog
        open={isAddMeetingOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) resetForm()
          setIsAddMeetingOpen(isOpen)
        }}
      >
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule New Meeting</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddMeeting} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-right">
                Meeting Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter meeting title"
                className={cn(errors.title && "border-destructive")}
              />
              {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">
                  Date <span className="text-destructive">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground",
                        errors.date && "border-destructive",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
                {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">
                  Time <span className="text-destructive">*</span>
                </Label>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className={cn("w-full", errors.time && "border-destructive")}
                  />
                </div>
                {errors.time && <p className="text-xs text-destructive">{errors.time}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="participants">Participants</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={`${participants.length} selected`} />
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
              <Label htmlFor="link" className="text-right">
                Meeting Link <span className="text-destructive">*</span>
              </Label>
              <div className="flex items-center">
                <Link2 className="mr-2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="link"
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://meet.google.com/..."
                  className={cn("w-full", errors.link && "border-destructive")}
                />
              </div>
              {errors.link && <p className="text-xs text-destructive">{errors.link}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter meeting description"
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddMeetingOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Schedule Meeting</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
