"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronUp, ChevronDown, Video, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

export default function MeetingsPanel({ meetings }) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Get today's meetings
  const todayMeetings = meetings.filter((meeting) => {
    const today = new Date()
    const meetingDate = new Date(meeting.date)
    return (
      meetingDate.getDate() === today.getDate() &&
      meetingDate.getMonth() === today.getMonth() &&
      meetingDate.getFullYear() === today.getFullYear()
    )
  })

  // Sort meetings by time
  const sortedMeetings = [...todayMeetings].sort((a, b) => {
    const timeA = a.time.split(":").map(Number)
    const timeB = b.time.split(":").map(Number)

    if (timeA[0] !== timeB[0]) {
      return timeA[0] - timeB[0]
    }
    return timeA[1] - timeB[1]
  })

  // Check if a meeting is happening now
  const isHappeningNow = (meetingTime) => {
    const now = new Date()
    const [hours, minutes] = meetingTime.split(":").map(Number)

    return now.getHours() === hours && Math.abs(now.getMinutes() - minutes) < 15
  }

  return (
    <div>
      <div className="flex items-center justify-between p-3 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center">
          <Video className="h-4 w-4 mr-2" />
          <h3 className="font-medium">Today's Meetings</h3>
          <Badge variant="outline" className="ml-2">
            {todayMeetings.length}
          </Badge>
        </div>

        <Button variant="ghost" size="sm">
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </Button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <ScrollArea className="max-h-48">
              <div className="p-3 space-y-2">
                {sortedMeetings.length > 0 ? (
                  sortedMeetings.map((meeting) => (
                    <Card key={meeting.id} className={`${isHappeningNow(meeting.time) ? "border-primary" : ""}`}>
                      <CardContent className="p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium text-sm">{meeting.title}</h4>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <Users className="h-3 w-3 mr-1" />
                              <span>{meeting.participants} participants</span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end">
                            <span
                              className={`text-sm font-medium ${isHappeningNow(meeting.time) ? "text-primary animate-pulse" : ""}`}
                            >
                              {meeting.time}
                            </span>

                            <Button variant="outline" size="sm" className="mt-1 h-7 text-xs">
                              Join
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <p className="text-sm text-muted-foreground">No meetings scheduled for today</p>
                    <p className="text-xs text-muted-foreground mt-1">Enjoy your focus time! 🎯</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
