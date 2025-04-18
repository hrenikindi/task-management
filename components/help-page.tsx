"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Search, MessageSquare, FileText, Book, Video, Mail, Phone, HelpCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("faq")
  const [contactName, setContactName] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [contactSubject, setContactSubject] = useState("")
  const [contactMessage, setContactMessage] = useState("")
  const { toast } = useToast()

  const handleContactSubmit = (e) => {
    e.preventDefault()

    // In a real app, this would send the contact form data to a server
    console.log("Contact form submitted:", { contactName, contactEmail, contactSubject, contactMessage })

    toast({
      title: "Message sent!",
      description: "We've received your message and will respond shortly.",
      variant: "success",
    })

    // Reset form
    setContactName("")
    setContactEmail("")
    setContactSubject("")
    setContactMessage("")
  }

  // FAQ data
  const faqCategories = [
    {
      name: "Getting Started",
      items: [
        {
          question: "How do I create a new project?",
          answer:
            "To create a new project, click on the 'Add Project' button in the sidebar. Fill in the project details in the form that appears, including name, description, start and end dates, and team members. Click 'Create Project' to finish.",
        },
        {
          question: "How do I add team members to my project?",
          answer:
            "You can add team members when creating a project, or you can go to an existing project, navigate to the 'Team' tab, and click 'Add Team Member'. Select the users you want to add from your organization and assign them roles.",
        },
        {
          question: "How do I create tasks?",
          answer:
            "To create a task, go to the project board and click the 'Add Task' button. Fill in the task details including title, description, assignee, due date, and priority. You can also create tasks directly from the 'Tasks' page.",
        },
      ],
    },
    {
      name: "Projects & Tasks",
      items: [
        {
          question: "How do I track project progress?",
          answer:
            "Project progress is automatically calculated based on the completion status of tasks. You can view overall progress on the project overview page, and detailed breakdowns in the Analytics dashboard.",
        },
        {
          question: "Can I set up recurring tasks?",
          answer:
            "Yes, when creating or editing a task, check the 'Make recurring' option and set the recurrence pattern (daily, weekly, monthly). The system will automatically create new instances of the task according to your schedule.",
        },
        {
          question: "How do I manage sprints?",
          answer:
            "Navigate to your project and select the 'Sprints' tab. Here you can create new sprints, assign tasks to sprints, and track sprint progress. You can also conduct sprint planning, reviews, and retrospectives.",
        },
      ],
    },
    {
      name: "Account & Settings",
      items: [
        {
          question: "How do I change my password?",
          answer:
            "Go to the Settings page by clicking on your profile picture in the sidebar and selecting 'Settings'. Navigate to the 'Security' tab where you can update your password by entering your current password and your new password.",
        },
        {
          question: "How do I update notification preferences?",
          answer:
            "Go to Settings > Notifications. Here you can customize which notifications you receive and how you receive them (email, in-app, or both).",
        },
        {
          question: "Can I change the theme of the application?",
          answer:
            "Yes, you can toggle between light and dark mode by clicking the theme toggle button in the top navigation bar. You can also customize theme colors in Settings > Appearance.",
        },
      ],
    },
  ]

  // Filter FAQs based on search query
  const filteredFAQs =
    searchQuery.trim() === ""
      ? faqCategories
      : faqCategories
          .map((category) => ({
            ...category,
            items: category.items.filter(
              (item) =>
                item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.answer.toLowerCase().includes(searchQuery.toLowerCase()),
            ),
          }))
          .filter((category) => category.items.length > 0)

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
          <p className="text-muted-foreground mt-1">Find answers and get assistance</p>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search for help topics..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="faq" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="faq" className="flex items-center gap-1">
            <HelpCircle className="h-4 w-4" />
            <span>FAQ</span>
          </TabsTrigger>
          <TabsTrigger value="guides" className="flex items-center gap-1">
            <Book className="h-4 w-4" />
            <span>Guides</span>
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-1">
            <Video className="h-4 w-4" />
            <span>Videos</span>
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>Contact</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="mt-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find answers to common questions about ProjectMaster</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredFAQs.length > 0 ? (
                filteredFAQs.map((category, index) => (
                  <div key={category.name} className={index > 0 ? "mt-6" : ""}>
                    <h3 className="text-lg font-medium mb-4">{category.name}</h3>
                    <Accordion type="single" collapsible className="w-full">
                      {category.items.map((item, itemIndex) => (
                        <AccordionItem key={itemIndex} value={`${category.name}-${itemIndex}`}>
                          <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                          <AccordionContent>
                            <p className="text-muted-foreground">{item.answer}</p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <HelpCircle className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No results found</h3>
                  <p className="text-muted-foreground mt-1">Try a different search term or browse the categories</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guides" className="mt-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Guides</CardTitle>
              <CardDescription>Step-by-step guides to help you get the most out of ProjectMaster</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Getting Started Guide</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Learn the basics of ProjectMaster and set up your first project
                    </p>
                    <Badge variant="outline" className="mt-3">
                      Beginner
                    </Badge>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Task Management</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Learn how to create, assign, and track tasks effectively
                    </p>
                    <Badge variant="outline" className="mt-3">
                      Intermediate
                    </Badge>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Sprint Planning</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Master the art of planning and executing successful sprints
                    </p>
                    <Badge variant="outline" className="mt-3">
                      Advanced
                    </Badge>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Analytics & Reporting</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Learn how to use analytics to track project performance
                    </p>
                    <Badge variant="outline" className="mt-3">
                      Advanced
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos" className="mt-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Video Tutorials</CardTitle>
              <CardDescription>Watch step-by-step video guides to learn how to use ProjectMaster</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                    <Video className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium">Introduction to ProjectMaster</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      A complete overview of the platform and its features
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <span>5:32</span>
                      <span>•</span>
                      <span>Beginner</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                    <Video className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium">Managing Projects & Teams</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Learn how to create and manage projects and teams
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <span>8:45</span>
                      <span>•</span>
                      <span>Intermediate</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                    <Video className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium">Advanced Task Management</h3>
                    <p className="text-sm text-muted-foreground mt-1">Master task creation, assignment, and tracking</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <span>7:18</span>
                      <span>•</span>
                      <span>Advanced</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                    <Video className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium">Reporting & Analytics</h3>
                    <p className="text-sm text-muted-foreground mt-1">Learn how to use the analytics dashboard</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <span>6:52</span>
                      <span>•</span>
                      <span>Advanced</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="mt-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>Get in touch with our support team for personalized assistance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Contact Methods</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Email Support</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          For general inquiries and non-urgent issues
                        </p>
                        <a
                          href="mailto:support@projectmaster.com"
                          className="text-sm text-primary hover:underline mt-1 inline-block"
                        >
                          support@projectmaster.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Phone Support</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          For urgent issues requiring immediate assistance
                        </p>
                        <a href="tel:+18001234567" className="text-sm text-primary hover:underline mt-1 inline-block">
                          +1 (800) 123-4567
                        </a>
                        <p className="text-xs text-muted-foreground mt-1">Monday-Friday, 9am-5pm EST</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium">Live Chat</h4>
                        <p className="text-sm text-muted-foreground mt-1">Chat with a support agent in real-time</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Start Chat
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Send a Message</h3>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Name
                        </label>
                        <Input
                          id="name"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Your name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email
                        </label>
                        <Input
                          id="email"
                          type="email"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="Your email"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">
                        Subject
                      </label>
                      <Input
                        id="subject"
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                        placeholder="Subject of your message"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="How can we help you?"
                        rows={5}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Send Message
                    </Button>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
