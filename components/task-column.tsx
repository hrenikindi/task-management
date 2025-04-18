"use client"

import { Droppable } from "@hello-pangea/dnd"
import { motion } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"
import TaskCard from "@/components/task-card"

export default function TaskColumn({ title, tasks, id, onTaskClick }) {
  return (
    <div className="flex flex-col bg-muted/40 rounded-lg overflow-hidden border shadow-sm">
      <div className="p-3 font-medium bg-muted/60 border-b flex items-center justify-between sticky top-0 z-10">
        <h3>{title}</h3>
        <span className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full">{tasks.length}</span>
      </div>

      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-2 ${snapshot.isDraggingOver ? "bg-muted/80" : ""}`}
          >
            <ScrollArea className="h-[calc(100vh-16rem)]">
              <div className="space-y-2 p-1">
                {tasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <TaskCard task={task} index={index} onClick={() => onTaskClick(task)} />
                  </motion.div>
                ))}
                {provided.placeholder}

                {tasks.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-24 text-center p-4 border border-dashed rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      {id === "done" ? "All clear! You're a productivity wizard 🧙‍♂️" : "No tasks here yet"}
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </Droppable>
    </div>
  )
}
