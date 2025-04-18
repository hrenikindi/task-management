"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  BarChart,
  Settings,
  HelpCircle,
  Calendar,
  MessageSquare,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function SidebarComponent() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeItem, setActiveItem] = useState("")
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Set active item based on current pathname
  useEffect(() => {
    if (pathname === "/") {
      setActiveItem("dashboard")
    } else if (pathname === "/tasks") {
      setActiveItem("tasks")
    } else if (pathname === "/calendar") {
      setActiveItem("calendar")
    } else if (pathname === "/team") {
      setActiveItem("team")
    } else if (pathname === "/meetings") {
      setActiveItem("meetings")
    } else if (pathname === "/analytics") {
      setActiveItem("analytics")
    } else if (pathname === "/settings") {
      setActiveItem("settings")
    } else if (pathname === "/help") {
      setActiveItem("help")
    }
  }, [pathname])

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/", badge: null },
    { id: "tasks", label: "My Tasks", icon: CheckSquare, path: "/tasks", badge: 5 },
    { id: "calendar", label: "Calendar", icon: Calendar, path: "/calendar", badge: null },
    { id: "team", label: "Team", icon: Users, path: "/team", badge: null },
    { id: "meetings", label: "Meetings", icon: MessageSquare, path: "/meetings", badge: 3 },
    { id: "analytics", label: "Analytics", icon: BarChart, path: "/analytics", badge: null },
  ]

  const projectItems = [
    { id: "marketing", label: "Marketing Campaign", color: "bg-blue-500", path: "/projects/marketing" },
    { id: "website", label: "Website Redesign", color: "bg-green-500", path: "/projects/website" },
    { id: "mobile", label: "Mobile App Launch", color: "bg-purple-500", path: "/projects/mobile" },
    { id: "branding", label: "Brand Refresh", color: "bg-amber-500", path: "/projects/branding" },
  ]

  const bottomMenuItems = [
    { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
    { id: "help", label: "Help & Support", icon: HelpCircle, path: "/help" },
  ]

  const handleNavigation = (path) => {
    router.push(path)
  }

  return (
    <div
      className={cn(
        "relative h-full border-r bg-card transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[70px]" : "w-64",
      )}
    >
      {/* Collapse toggle button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 z-10 flex h-6 w-6 items-center justify-center rounded-full border bg-background shadow-sm"
      >
        {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>

      <div className="flex h-full flex-col">
        <div
          className={cn(
            "flex items-center p-4 transition-all duration-300",
            isCollapsed ? "justify-center" : "space-x-2",
          )}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <span className="text-primary-foreground font-bold">PM</span>
          </div>
          {!isCollapsed && <h2 className="text-xl font-bold">ProjectMaster</h2>}
        </div>

        {!isCollapsed && (
          <div className="relative px-4 py-2">
            <Search className="absolute left-6 top-[13px] h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        <Separator className="my-2" />

        <div className="flex-1 overflow-auto px-2 py-2">
          <nav className="space-y-1">
            <TooltipProvider delayDuration={0}>
              {menuItems.map((item) => (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.path}
                      className={cn(
                        "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-accent",
                        activeItem === item.id
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:text-foreground",
                        isCollapsed ? "justify-center" : "",
                      )}
                      onClick={() => setActiveItem(item.id)}
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5 flex-shrink-0",
                          activeItem === item.id ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                        )}
                      />

                      {!isCollapsed && (
                        <>
                          <span className="ml-3 flex-1">{item.label}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="ml-auto h-5 min-w-5 flex items-center justify-center">
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right">
                      <div className="flex items-center">
                        <span>{item.label}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="ml-2">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                    </TooltipContent>
                  )}
                </Tooltip>
              ))}
            </TooltipProvider>
          </nav>

          {!isCollapsed && (
            <>
              <Separator className="my-4" />

              <div className="px-3 py-2">
                <h3 className="mb-2 text-xs font-semibold text-muted-foreground">PROJECTS</h3>
                <nav className="space-y-1">
                  {projectItems.map((project) => (
                    <Link
                      key={project.id}
                      href={project.path}
                      className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
                    >
                      <div className={cn("h-2 w-2 rounded-full mr-3", project.color)} />
                      <span className="truncate">{project.label}</span>
                    </Link>
                  ))}

                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-muted-foreground mt-1"
                    onClick={() => {
                      // This will be connected to the dialog in the next step
                      router.push("/add-project")
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Project
                  </Button>
                </nav>
              </div>
            </>
          )}
        </div>

        <div className="mt-auto p-4">
          {!isCollapsed && (
            <>
              <nav className="space-y-1 mb-4">
                {bottomMenuItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.path}
                    className={cn(
                      "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-accent",
                      activeItem === item.id
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                    onClick={() => setActiveItem(item.id)}
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5 flex-shrink-0",
                        activeItem === item.id ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                      )}
                    />
                    <span className="ml-3">{item.label}</span>
                  </Link>
                ))}
              </nav>

              <Separator className="my-2" />
            </>
          )}

          <div className={cn("flex items-center", isCollapsed ? "justify-center" : "space-x-3")}>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar className="h-9 w-9 cursor-pointer transition-transform hover:scale-105">
                    <AvatarImage src="/placeholder.svg?height=36&width=36" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right">
                    <div>
                      <p className="font-medium">John Doe</p>
                      <p className="text-xs text-muted-foreground">Project Manager</p>
                    </div>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>

            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">John Doe</p>
                <p className="text-xs text-muted-foreground truncate">Project Manager</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Plus(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}
