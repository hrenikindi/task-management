"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Plus, Filter, Mail, Phone, MapPin, Building, Users, UserPlus, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

// Sample team members data
const teamMembers = [
  {
    id: "user-1",
    name: "John Doe",
    role: "Project Manager",
    department: "Management",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    avatar: "/placeholder.svg?height=128&width=128",
    initials: "JD",
    projects: ["Marketing Campaign", "Website Redesign"],
    skills: ["Leadership", "Project Planning", "Agile"],
    status: "active",
  },
  {
    id: "user-2",
    name: "Sarah Johnson",
    role: "Senior Designer",
    department: "Design",
    email: "sarah.johnson@example.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    avatar: "/placeholder.svg?height=128&width=128",
    initials: "SJ",
    projects: ["Marketing Campaign", "Mobile App Launch"],
    skills: ["UI/UX", "Figma", "Illustration"],
    status: "active",
  },
  {
    id: "user-3",
    name: "Mike Brown",
    role: "Frontend Developer",
    department: "Engineering",
    email: "mike.brown@example.com",
    phone: "+1 (555) 345-6789",
    location: "Austin, TX",
    avatar: "/placeholder.svg?height=128&width=128",
    initials: "MB",
    projects: ["Website Redesign"],
    skills: ["React", "TypeScript", "Tailwind CSS"],
    status: "active",
  },
  {
    id: "user-4",
    name: "Emily Clark",
    role: "Content Strategist",
    department: "Marketing",
    email: "emily.clark@example.com",
    phone: "+1 (555) 456-7890",
    location: "Chicago, IL",
    avatar: "/placeholder.svg?height=128&width=128",
    initials: "EC",
    projects: ["Marketing Campaign", "Brand Refresh"],
    skills: ["Copywriting", "SEO", "Content Planning"],
    status: "active",
  },
  {
    id: "user-5",
    name: "Alex Wong",
    role: "Backend Developer",
    department: "Engineering",
    email: "alex.wong@example.com",
    phone: "+1 (555) 567-8901",
    location: "Seattle, WA",
    avatar: "/placeholder.svg?height=128&width=128",
    initials: "AW",
    projects: ["Website Redesign", "Mobile App Launch"],
    skills: ["Node.js", "Python", "Database Design"],
    status: "vacation",
  },
  {
    id: "user-6",
    name: "Lisa Martinez",
    role: "Product Manager",
    department: "Product",
    email: "lisa.martinez@example.com",
    phone: "+1 (555) 678-9012",
    location: "Boston, MA",
    avatar: "/placeholder.svg?height=128&width=128",
    initials: "LM",
    projects: ["Mobile App Launch"],
    skills: ["Product Strategy", "User Research", "Roadmapping"],
    status: "active",
  },
  {
    id: "user-7",
    name: "David Kim",
    role: "QA Engineer",
    department: "Engineering",
    email: "david.kim@example.com",
    phone: "+1 (555) 789-0123",
    location: "Portland, OR",
    avatar: "/placeholder.svg?height=128&width=128",
    initials: "DK",
    projects: ["Website Redesign", "Mobile App Launch"],
    skills: ["Test Automation", "Manual Testing", "QA Processes"],
    status: "active",
  },
  {
    id: "user-8",
    name: "Rachel Green",
    role: "Marketing Specialist",
    department: "Marketing",
    email: "rachel.green@example.com",
    phone: "+1 (555) 890-1234",
    location: "Miami, FL",
    avatar: "/placeholder.svg?height=128&width=128",
    initials: "RG",
    projects: ["Marketing Campaign", "Brand Refresh"],
    skills: ["Social Media", "Email Marketing", "Analytics"],
    status: "active",
  },
]

// Current project team members
const currentProjectTeam = teamMembers.filter((member) => member.projects.includes("Marketing Campaign"))

export default function TeamView() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const { toast } = useToast()

  // Filter team members based on search query and department filter
  const filteredTeamMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesDepartment =
      departmentFilter === "all" || member.department.toLowerCase() === departmentFilter.toLowerCase()

    return matchesSearch && matchesDepartment
  })

  // Get unique departments for filter
  const departments = ["all", ...new Set(teamMembers.map((member) => member.department.toLowerCase()))]

  const handleInvite = () => {
    toast({
      title: "Invitation sent!",
      description: "An email invitation has been sent to the new team member.",
      variant: "success",
    })
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team</h1>
          <p className="text-muted-foreground mt-1">Manage your team members and their access</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <UserPlus className="h-4 w-4" />
            <span>Invite</span>
          </Button>

          <Button onClick={handleInvite}>
            <Plus className="h-4 w-4 mr-2" />
            Add Team Member
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <TabsList className="mb-0">
            <TabsTrigger value="all">All Members</TabsTrigger>
            <TabsTrigger value="project">Project Team</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search team members..."
                className="pl-8 w-[200px] md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Department</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {departments.map((dept) => (
                  <DropdownMenuItem
                    key={dept}
                    onClick={() => setDepartmentFilter(dept)}
                    className={departmentFilter === dept ? "bg-muted" : ""}
                  >
                    {dept === "all" ? "All Departments" : dept.charAt(0).toUpperCase() + dept.slice(1)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span>All Team Members</span>
                <Badge variant="outline">{filteredTeamMembers.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-16rem)]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTeamMembers.map((member) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      whileHover={{ scale: 1.02 }}
                      className="cursor-pointer"
                    >
                      <Card className="overflow-hidden h-full border hover:border-primary/50 transition-colors">
                        <CardContent className="p-0">
                          <div className="relative">
                            <div className="h-20 bg-gradient-to-r from-primary/20 to-primary/10"></div>
                            <Avatar className="absolute -bottom-6 left-4 h-16 w-16 border-4 border-background">
                              <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                              <AvatarFallback className="text-lg">{member.initials}</AvatarFallback>
                            </Avatar>
                            <div className="absolute top-2 right-2">
                              <Badge variant={member.status === "active" ? "success" : "warning"}>
                                {member.status === "active" ? "Active" : "On Vacation"}
                              </Badge>
                            </div>
                          </div>

                          <div className="pt-8 px-4 pb-4">
                            <h3 className="font-semibold text-lg">{member.name}</h3>
                            <p className="text-muted-foreground text-sm">{member.role}</p>

                            <div className="mt-4 space-y-2">
                              <div className="flex items-center text-sm">
                                <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>{member.department}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span className="truncate">{member.email}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span>{member.location}</span>
                              </div>
                            </div>

                            <Separator className="my-4" />

                            <div>
                              <h4 className="text-sm font-medium mb-2">Projects</h4>
                              <div className="flex flex-wrap gap-1">
                                {member.projects.map((project) => (
                                  <Badge key={project} variant="outline" className="text-xs">
                                    {project}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                              <Button variant="ghost" size="sm" className="gap-1">
                                <Mail className="h-3.5 w-3.5" />
                                <span className="text-xs">Message</span>
                              </Button>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>View Profile</DropdownMenuItem>
                                  <DropdownMenuItem>Edit Member</DropdownMenuItem>
                                  <DropdownMenuItem>Assign to Project</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {filteredTeamMembers.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Users className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No team members found</h3>
                    <p className="text-muted-foreground mt-1">Try adjusting your search or filter criteria</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="project" className="mt-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span>Marketing Campaign Team</span>
                <Badge variant="outline">{currentProjectTeam.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <h3 className="text-lg font-medium mb-4">Team Members</h3>
                  <div className="space-y-4">
                    {currentProjectTeam.map((member) => (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                            <AvatarFallback>{member.initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{member.name}</h4>
                            <p className="text-sm text-muted-foreground">{member.role}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Phone className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Profile</DropdownMenuItem>
                              <DropdownMenuItem>Remove from Project</DropdownMenuItem>
                              <DropdownMenuItem>Change Role</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Project Details</h3>
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">PROJECT NAME</h4>
                          <p className="font-medium">Marketing Campaign</p>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">TIMELINE</h4>
                          <p className="font-medium">Apr 1 - Apr 30, 2025</p>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">STATUS</h4>
                          <Badge>In Progress</Badge>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground">TEAM LEAD</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="John Doe" />
                              <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <span>John Doe</span>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">TEAM COMPOSITION</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Management</span>
                              <Badge variant="outline">1</Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span>Design</span>
                              <Badge variant="outline">1</Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span>Marketing</span>
                              <Badge variant="outline">2</Badge>
                            </div>
                          </div>
                        </div>

                        <Button className="w-full">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add Team Member
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
