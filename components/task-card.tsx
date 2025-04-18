"use client"

import { useState } from "react"
import { Draggable } from "@hello-pangea/dnd"
import { motion } from "framer-motion"
import { Calendar, Clock, Link2, Edit, CheckCircle } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function TaskCard({ task, index, onClick }) {
  const [isHovered, setIsHovered] = useState(false)

  // Calculate if deadline is approaching (within 2 days)
  const isDeadlineApproaching = () => {
    const today = new Date()
    const deadline = new Date(task.dueDate)
    const diffTime = deadline.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 2 && diffDays >= 0
  }

  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
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
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="group"
        >
          <motion.div
            animate={
              snapshot.isDragging
                ? { scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }
                : isHovered
                  ? { scale: 1.01, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }
                  : { scale: 1, boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)" }
            }
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            onClick={onClick}
            className="cursor-pointer"
          >
            <Card
              className={`
                border transition-all duration-200
                ${isDeadlineApproaching() && task.status !== "done" ? "border-destructive/50" : ""}
                ${isHovered ? "bg-card/80" : ""}
                ${task.status === "done" ? "opacity-80" : ""}
              `}
            >
              <CardContent className="p-3 relative">
                {/* Quick action buttons that appear on hover */}
                <div
                  className={`
                  absolute right-2 top-2 flex items-center gap-1 transition-opacity duration-200
                  ${isHovered ? "opacity-100" : "opacity-0"}
                `}
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 bg-background/80 backdrop-blur-sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            // Handle edit logic
                          }}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit Task</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 bg-background/80 backdrop-blur-sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            // Handle complete logic
                          }}
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Mark as Complete</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="flex justify-between items-start mb-2">
                  <h4
                    className={`font-medium text-sm line-clamp-1 ${task.status === "done" ? "line-through text-muted-foreground" : ""}`}
                  >
                    {task.title}
                  </h4>
                </div>

                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{task.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} alt={task.assignee.name} />
                      <AvatarFallback>{task.assignee.initials}</AvatarFallback>
                    </Avatar>

                    <Badge variant={getPriorityVariant(task.priority)} className="text-[10px] h-5">
                      {task.priority}
                    </Badge>
                  </div>

                  <div
                    className={`flex items-center text-xs ${isDeadlineApproaching() && task.status !== "done" ? "text-destructive animate-pulse" : "text-muted-foreground"}`}
                  >
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(task.dueDate)}
                  </div>
                </div>

                {task.meeting && (
                  <div className="mt-2 pt-2 border-t flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{task.meeting.time}</span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 text-xs gap-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        window.open(task.meeting.link, "_blank")
                      }}
                    >
                      <Link2 className="h-3 w-3" />
                      Join
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </Draggable>
  )
}
