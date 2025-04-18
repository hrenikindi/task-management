"use client"

import { useState } from "react"
import { Moon, Sun, Bell, Clock, Save, Shield, Palette, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "next-themes"
import { useToast } from "@/components/ui/use-toast"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  // User settings
  const [name, setName] = useState("John Doe")
  const [email, setEmail] = useState("john.doe@example.com")
  const [jobTitle, setJobTitle] = useState("Project Manager")

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [reminderNotifications, setReminderNotifications] = useState(true)
  const [deadlineAlerts, setDeadlineAlerts] = useState(true)
  const [meetingReminders, setMeetingReminders] = useState(true)

  // Appearance settings
  const [accentColor, setAccentColor] = useState("blue")
  const [compactMode, setCompactMode] = useState(false)
  const [animationsEnabled, setAnimationsEnabled] = useState(true)

  // Reminder settings
  const [reminderTime, setReminderTime] = useState("15")
  const [snoozeTime, setSnoozeTime] = useState("60")

  const handleSaveSettings = (section) => {
    toast({
      title: "Settings saved",
      description: `Your ${section} settings have been updated.`,
      variant: "success",
    })
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account and application preferences</p>
        </div>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="reminders">Reminders</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="mt-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your account details and profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex flex-col items-center gap-2">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" alt="User" />
                    <AvatarFallback className="text-2xl">JD</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    Change Avatar
                  </Button>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="job-title">Job Title</Label>
                    <Input id="job-title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={() => handleSaveSettings("profile")}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your account security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <Switch id="two-factor" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={() => handleSaveSettings("security")}>
                <Shield className="h-4 w-4 mr-2" />
                Update Security
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Delivery Methods</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications in the browser</p>
                  </div>
                  <Switch id="push-notifications" checked={pushNotifications} onCheckedChange={setPushNotifications} />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Types</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="reminder-notifications">Task Reminders</Label>
                    <p className="text-sm text-muted-foreground">Notifications for upcoming tasks</p>
                  </div>
                  <Switch
                    id="reminder-notifications"
                    checked={reminderNotifications}
                    onCheckedChange={setReminderNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="deadline-alerts">Deadline Alerts</Label>
                    <p className="text-sm text-muted-foreground">Notifications for approaching deadlines</p>
                  </div>
                  <Switch id="deadline-alerts" checked={deadlineAlerts} onCheckedChange={setDeadlineAlerts} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="meeting-reminders">Meeting Reminders</Label>
                    <p className="text-sm text-muted-foreground">Notifications for upcoming meetings</p>
                  </div>
                  <Switch id="meeting-reminders" checked={meetingReminders} onCheckedChange={setMeetingReminders} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={() => handleSaveSettings("notifications")}>
                <Bell className="h-4 w-4 mr-2" />
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize how the application looks and feels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Theme</h3>

                <div className="flex items-center space-x-4">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    className="flex items-center gap-2"
                    onClick={() => {
                      setTheme("light")
                      toast({
                        title: "Theme updated",
                        description: "Light mode has been applied.",
                      })
                    }}
                  >
                    <Sun className="h-4 w-4" />
                    Light
                  </Button>

                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    className="flex items-center gap-2"
                    onClick={() => {
                      setTheme("dark")
                      toast({
                        title: "Theme updated",
                        description: "Dark mode has been applied.",
                      })
                    }}
                  >
                    <Moon className="h-4 w-4" />
                    Dark
                  </Button>

                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    className="flex items-center gap-2"
                    onClick={() => {
                      setTheme("system")
                      toast({
                        title: "Theme updated",
                        description: "System preference will be used.",
                      })
                    }}
                  >
                    <RefreshCw className="h-4 w-4" />
                    System
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Accent Color</h3>

                <RadioGroup value={accentColor} onValueChange={setAccentColor} className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="blue" id="blue" className="bg-blue-500" />
                    <Label htmlFor="blue">Blue</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="green" id="green" className="bg-green-500" />
                    <Label htmlFor="green">Green</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="purple" id="purple" className="bg-purple-500" />
                    <Label htmlFor="purple">Purple</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="orange" id="orange" className="bg-orange-500" />
                    <Label htmlFor="orange">Orange</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pink" id="pink" className="bg-pink-500" />
                    <Label htmlFor="pink">Pink</Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Interface Options</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="compact-mode">Compact Mode</Label>
                    <p className="text-sm text-muted-foreground">Use a more compact layout with less whitespace</p>
                  </div>
                  <Switch id="compact-mode" checked={compactMode} onCheckedChange={setCompactMode} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="animations">Animations</Label>
                    <p className="text-sm text-muted-foreground">Enable animations and transitions</p>
                  </div>
                  <Switch id="animations" checked={animationsEnabled} onCheckedChange={setAnimationsEnabled} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={() => handleSaveSettings("appearance")}>
                <Palette className="h-4 w-4 mr-2" />
                Save Appearance
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="reminders" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Reminder Settings</CardTitle>
              <CardDescription>Configure how reminders and alerts work</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Timing Preferences</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="reminder-time">Default Reminder Time</Label>
                    <p className="text-sm text-muted-foreground">
                      How many minutes before a task or meeting to show a reminder
                    </p>
                    <div className="flex items-center">
                      <Input
                        id="reminder-time"
                        type="number"
                        min="5"
                        max="120"
                        value={reminderTime}
                        onChange={(e) => setReminderTime(e.target.value)}
                        className="w-20 mr-2"
                      />
                      <span>minutes</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="snooze-time">Default Snooze Time</Label>
                    <p className="text-sm text-muted-foreground">How many minutes to snooze a reminder</p>
                    <div className="flex items-center">
                      <Input
                        id="snooze-time"
                        type="number"
                        min="5"
                        max="120"
                        value={snoozeTime}
                        onChange={(e) => setSnoozeTime(e.target.value)}
                        className="w-20 mr-2"
                      />
                      <span>minutes</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Reminder Behavior</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-dismiss">Auto-dismiss Reminders</Label>
                    <p className="text-sm text-muted-foreground">Automatically dismiss reminders after 1 minute</p>
                  </div>
                  <Switch id="auto-dismiss" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sound-alerts">Sound Alerts</Label>
                    <p className="text-sm text-muted-foreground">Play a sound when a reminder appears</p>
                  </div>
                  <Switch id="sound-alerts" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="focus-mode">Focus Mode</Label>
                    <p className="text-sm text-muted-foreground">Only show critical reminders during meetings</p>
                  </div>
                  <Switch id="focus-mode" defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={() => handleSaveSettings("reminders")}>
                <Clock className="h-4 w-4 mr-2" />
                Save Reminder Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
