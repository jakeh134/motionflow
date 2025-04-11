"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Upload, Layers, Settings, LogOut, Menu, X } from "lucide-react"
import type { User } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const router = useRouter()
  const pathname = usePathname()
  const isMobile = useMobile()
  const [user, setUser] = useState<User | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("motionflow-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      router.push("/login")
    }
  }, [router])

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    } else {
      setSidebarOpen(true)
    }
  }, [isMobile])

  const handleLogout = () => {
    localStorage.removeItem("motionflow-user")
    router.push("/login")
  }

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/upload", label: "Upload", icon: Upload },
    { href: "/batches", label: "Batches", icon: Layers },
    { href: "/settings", label: "Settings", icon: Settings },
  ]

  if (!user) {
    return null // Or a loading spinner
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Mobile sidebar toggle */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X /> : <Menu />}
        </Button>
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out",
          isMobile && !sidebarOpen && "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                MF
              </div>
              <div>
                <h2 className="font-bold text-lg">MotionFlow</h2>
              </div>
            </div>
          </div>

          <div className="p-4 border-b border-slate-200">
            <div className="text-sm font-medium">{user.fullName}</div>
            <div className="text-xs text-muted-foreground">{user.courtName}</div>
            <div className="text-xs text-muted-foreground">{user.role}</div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium",
                    pathname === item.href
                      ? "bg-slate-100 text-primary"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-slate-200">
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-600 hover:text-slate-900"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        className={cn(
          "flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out",
          sidebarOpen ? (isMobile ? "ml-0" : "ml-64") : "ml-0",
        )}
      >
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
