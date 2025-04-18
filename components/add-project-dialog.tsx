"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Users } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"

// Sample team members for project assignment
const teamMembers = [
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
    id: "user-3",
    name: "Mike Brown",
    role: "Frontend Developer",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "MB",
  },
  {
    id: "user-4",
    name: "Emily Clark",
    role: "Content Strategist",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "EC",
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
  {
    id: "user-8",
    name: "Rachel Green",
    role: "Marketing Specialist",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "RG",
  },
]

export default function AddProjectDialog({ open, onOpenChange, onAddProject }) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [status, setStatus] = useState("planning")
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([teamMembers[0].id])
  const [projectType, setProjectType] = useState("scrum")
  const [sprintDuration, setSprintDuration] = useState("2")
  const [errors, setErrors] = useState({})

  const resetForm = () => {
    setName("")
    setDescription("")
    setStartDate(new Date())
    setEndDate(new Date())
    setStatus("planning")
    setSelectedTeamMembers([teamMembers[0].id])
    setProjectType("scrum")
    setSprintDuration("2")
    setErrors({})
  }

  const validateForm = () => {
    const newErrors = {}

    if (!name.trim()) {
      newErrors.name = "Project name is required"
    }

    if (!description.trim()) {
      newErrors.description = "Project description is required"
    }

    if (!startDate) {
      newErrors.startDate = "Start date is required"
    }

    if (!endDate) {
      newErrors.endDate = "End date is required"
    } else if (endDate < startDate) {
      newErrors.endDate = "End date must be after start date"
    }

    if (selectedTeamMembers.length === 0) {
      newErrors.team = "At least one team member is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Create the new project object
    const newProject = {
      id: `project-${Date.now()}`,
      name,
      description,
      startDate: format(startDate, "yyyy-MM-dd"),
      endDate: format(endDate, "yyyy-MM-dd"),
      status,
      team: selectedTeamMembers.map((id) => teamMembers.find((member) => member.id === id)),
      projectType,
      sprintDuration: Number.parseInt(sprintDuration),
    }

    // Call the onAddProject callback
    onAddProject(newProject)

    // Reset the form and close the dialog
    resetForm()
    onOpenChange(false)
  }

  const toggleTeamMember = (memberId) => {
    setSelectedTeamMembers((prev) => {
      if (prev.includes(memberId)) {
        return prev.filter((id) => id !== memberId)
      } else {
        return [...prev, memberId]
      }
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) resetForm()
        onOpenChange(isOpen)
      }}
    >
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-right">
              Project Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
              className={cn(errors.name && "border-destructive")}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-right">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter project description"
              className={cn(errors.description && "border-destructive")}
              rows={3}
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">
                Start Date <span className="text-destructive">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground",
                      errors.startDate && "border-destructive",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                </PopoverContent>
              </Popover>
              {errors.startDate && <p className="text-xs text-destructive">{errors.startDate}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">
                End Date <span className="text-destructive">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground",
                      errors.endDate && "border-destructive",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                </PopoverContent>
              </Popover>
              {errors.endDate && <p className="text-xs text-destructive">{errors.endDate}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Initial Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="on-track">On Track</SelectItem>
                  <SelectItem value="at-risk">At Risk</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectType">Project Type</Label>
              <Select value={projectType} onValueChange={setProjectType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scrum">Scrum</SelectItem>
                  <SelectItem value="kanban">Kanban</SelectItem>
                  <SelectItem value="waterfall">Waterfall</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {projectType === "scrum" && (
            <div className="space-y-2">
              <Label htmlFor="sprintDuration">Sprint Duration (weeks)</Label>
              <Select value={sprintDuration} onValueChange={setSprintDuration}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sprint duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 week</SelectItem>
                  <SelectItem value="2">2 weeks</SelectItem>
                  <SelectItem value="3">3 weeks</SelectItem>
                  <SelectItem value="4">4 weeks</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="team" className={cn(errors.team && "text-destructive")}>
              Team Members <span className="text-destructive">*</span>
            </Label>
            <div className="border rounded-md p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Select team members</span>
                </div>
                <Badge variant="outline">{selectedTeamMembers.length} selected</Badge>
              </div>

              <ScrollArea className="h-[200px] pr-4">
                <div className="space-y-2">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`member-${member.id}`}
                        checked={selectedTeamMembers.includes(member.id)}
                        onCheckedChange={() => toggleTeamMember(member.id)}
                      />
                      <div className="flex items-center gap-2 flex-1">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback>{member.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <Label htmlFor={`member-${member.id}`} className="font-normal cursor-pointer">
                            {member.name}
                          </Label>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            {errors.team && <p className="text-xs text-destructive">{errors.team}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Project</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
