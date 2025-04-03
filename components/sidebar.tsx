"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { FileText, Upload, Settings, HelpCircle, Menu, Bell, Search, X } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

interface SidebarProps {
  children: React.ReactNode
}

export function Sidebar({ children }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Handle initial mount to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const routes = [
    {
      label: "Motions",
      icon: FileText,
      href: "/motions",
      active: pathname === "/motions" || pathname.startsWith("/motions/"),
      badge: 12,
    },
    {
      label: "Upload",
      icon: Upload,
      href: "/upload",
      active: pathname === "/upload",
    },
  ]

  const bottomRoutes = [
    {
      label: "Settings",
      icon: Settings,
      href: "/settings",
      active: pathname === "/settings",
    },
    {
      label: "Help & Support",
      icon: HelpCircle,
      href: "/help",
      active: pathname === "/help",
    },
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile Navigation */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-50 rounded-full w-10 h-10 shadow-sm bg-background"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72 border-r shadow-lg">
          <div className="h-full flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <Logo />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileOpen(false)}
                className="h-8 w-8 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid gap-1 px-2">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                      route.active ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted",
                    )}
                  >
                    <route.icon
                      className={cn("h-5 w-5", route.active ? "text-primary-foreground" : "text-muted-foreground")}
                    />
                    <span>{route.label}</span>
                    {route.badge && (
                      <Badge
                        variant={route.active ? "outline" : "default"}
                        className={cn("ml-auto", route.active && "bg-primary-foreground text-primary")}
                      >
                        {route.badge}
                      </Badge>
                    )}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="border-t p-4">
              <nav className="grid gap-1">
                {bottomRoutes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                      route.active ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted",
                    )}
                  >
                    <route.icon
                      className={cn("h-5 w-5", route.active ? "text-primary-foreground" : "text-muted-foreground")}
                    />
                    <span>{route.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      {isMounted && (
        <div
          className={cn(
            "hidden md:flex flex-col border-r bg-background transition-all duration-300 ease-in-out",
            isCollapsed ? "w-[70px]" : "w-[240px]",
          )}
        >
          <div className="p-4 border-b flex items-center justify-between">
            {!isCollapsed && <Logo size="sm" />}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={cn("h-8 w-8 rounded-full", !isCollapsed && "ml-auto")}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid gap-1 px-2">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    route.active ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted text-foreground",
                    isCollapsed && "justify-center px-2",
                  )}
                  title={isCollapsed ? route.label : undefined}
                >
                  {route.active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-foreground rounded-full" />
                  )}
                  <route.icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0",
                      route.active ? "text-primary-foreground" : "text-muted-foreground",
                    )}
                  />
                  {!isCollapsed && <span>{route.label}</span>}
                  {!isCollapsed && route.badge && (
                    <Badge
                      variant={route.active ? "outline" : "default"}
                      className={cn("ml-auto", route.active && "bg-primary-foreground text-primary")}
                    >
                      {route.badge}
                    </Badge>
                  )}
                  {isCollapsed && route.badge && (
                    <Badge
                      variant={route.active ? "outline" : "default"}
                      className={cn(
                        "absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs",
                        route.active && "bg-primary-foreground text-primary",
                      )}
                    >
                      {route.badge}
                    </Badge>
                  )}
                </Link>
              ))}
            </nav>
          </div>
          <div className="border-t p-4">
            <nav className="grid gap-1">
              {bottomRoutes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    route.active ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted text-foreground",
                    isCollapsed && "justify-center px-2",
                  )}
                  title={isCollapsed ? route.label : undefined}
                >
                  {route.active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-foreground rounded-full" />
                  )}
                  <route.icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0",
                      route.active ? "text-primary-foreground" : "text-muted-foreground",
                    )}
                  />
                  {!isCollapsed && <span>{route.label}</span>}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b bg-background z-10 shadow-sm">
          <div className="flex h-16 items-center px-4 md:px-6">
            {/* Left section - Search */}
            <div className="flex-1 flex items-center">
              <div className="relative md:w-64 lg:w-80 max-w-sm">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search motions, cases..."
                  className="w-full pl-8 h-9 md:max-w-sm bg-muted/40 border-muted focus-visible:bg-background"
                />
              </div>
            </div>

            {/* Right section - Notifications and Profile */}
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="relative h-9 w-9 rounded-full border-muted bg-background"
                  >
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                      3
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Notifications</span>
                      <Button variant="ghost" size="sm" className="h-auto p-1 text-xs">
                        Mark all as read
                      </Button>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-80 overflow-auto">
                    {[1, 2, 3].map((i) => (
                      <DropdownMenuItem key={i} className="cursor-pointer py-3 px-4 focus:bg-muted">
                        <div className="flex items-start gap-3">
                          <div className="rounded-full bg-primary/10 p-1.5 mt-0.5">
                            <FileText className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <div className="grid gap-0.5">
                            <p className="text-sm font-medium leading-none">New motion requires review</p>
                            <p className="text-xs text-muted-foreground">Case #23-789 has compliance issues</p>
                            <p className="text-xs text-muted-foreground mt-1">2 minutes ago</p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer justify-center text-sm font-medium text-primary">
                    View all notifications
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-9 w-9 border border-muted/50 hover:bg-muted/30"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">JD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary/10 text-primary">JD</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-0.5">
                      <p className="text-sm font-medium leading-none">John Doe</p>
                      <p className="text-xs text-muted-foreground">john.doe@example.com</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Help & Support</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                    onClick={() => router.push("/")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

