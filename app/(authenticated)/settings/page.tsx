"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { RefreshCw } from "lucide-react"
import type { User } from "@/lib/types"

export default function SettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notifications, setNotifications] = useState({
    email: true,
    browser: true,
    motionUpdates: true,
    batchCompletions: true,
  })

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("motionflow-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      setIsLoading(false)
    } else {
      router.push("/login")
    }
  }, [router])

  const handleNotificationChange = (key: string, checked: boolean) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: checked,
    }))

    toast({
      title: "Settings updated",
      description: "Your notification preferences have been saved",
    })
  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()

    toast({
      title: "Password updated",
      description: "Your password has been changed successfully",
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      </div>

      <div className="grid gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Manage your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" value={user?.fullName || ""} readOnly className="bg-muted/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user?.email || ""} readOnly className="bg-muted/50" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" value={user?.role || ""} readOnly className="bg-muted/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="court">Assigned Court</Label>
                <Input id="court" value={user?.courtName || ""} readOnly className="bg-muted/50" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Password Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your account password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" required />
              </div>
              <Button type="submit">Update Password</Button>
            </form>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Configure how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Notification Channels</h3>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={notifications.email}
                  onCheckedChange={(checked) => handleNotificationChange("email", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="browser-notifications">Browser Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications in your browser</p>
                </div>
                <Switch
                  id="browser-notifications"
                  checked={notifications.browser}
                  onCheckedChange={(checked) => handleNotificationChange("browser", checked)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Notification Types</h3>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="motion-updates">Motion Updates</Label>
                  <p className="text-sm text-muted-foreground">Notifications about motion status changes</p>
                </div>
                <Switch
                  id="motion-updates"
                  checked={notifications.motionUpdates}
                  onCheckedChange={(checked) => handleNotificationChange("motionUpdates", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="batch-completions">Batch Completions</Label>
                  <p className="text-sm text-muted-foreground">Notifications when batch uploads complete</p>
                </div>
                <Switch
                  id="batch-completions"
                  checked={notifications.batchCompletions}
                  onCheckedChange={(checked) => handleNotificationChange("batchCompletions", checked)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              Note: Some notification settings may be required by your court administrator.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
