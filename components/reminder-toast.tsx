"use client"

import { motion } from "framer-motion"
import { X, CheckCircle, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function ReminderToast({ message, onDismiss, onAcknowledge }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <Card className="w-80 shadow-lg border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <p className="text-sm font-medium">{message}</p>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (onDismiss) onDismiss()
              }}
              className="h-6 w-6 -mt-1 -mr-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center justify-end mt-3 gap-2">
            <Button variant="outline" size="sm" onClick={onDismiss} className="h-8 text-xs gap-1">
              <Clock className="h-3 w-3" />
              Snooze for 1hr
            </Button>

            <Button size="sm" onClick={onAcknowledge} className="h-8 text-xs gap-1">
              <CheckCircle className="h-3 w-3" />
              Acknowledge
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
