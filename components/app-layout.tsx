"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { AnimatePresence } from "framer-motion"
import { X, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import Sidebar from "@/components/sidebar"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/use-toast"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { theme } = useTheme()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)

  // Handle hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Show welcome toast on first load
  useEffect(() => {
    if (!mounted) return

    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome")

    if (!hasSeenWelcome) {
      setTimeout(() => {
        toast({
          title: "Welcome to ProjectMaster!",
          description: "Your interactive project management dashboard is ready to use.",
          duration: 5000,
        })
        localStorage.setItem("hasSeenWelcome", "true")
      }, 1000)
    }
  }, [toast, mounted])

  if (!mounted) {
    return null // Avoid rendering with incorrect theme
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background transition-colors duration-300">
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-screen">
        <Sidebar />
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="rounded-full shadow-md"
        >
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm md:hidden"
          >
            <div className="p-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-4 right-4"
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="pt-12">
                <Sidebar />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-auto">{children}</div>
    </div>
  )
}
