"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Logo } from "./logo"

export function MainNav() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center">
        <div className="mr-8">
          <Link href="/">
            <Logo />
          </Link>
        </div>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link
            href="/upload"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === "/upload" ? "text-foreground" : "text-foreground/60",
            )}
          >
            Upload
          </Link>
          <Link
            href="/motions"
            className={cn(
              "transition-colors hover:text-foreground/80",
              pathname === "/motions" || pathname.startsWith("/motions/") ? "text-foreground" : "text-foreground/60",
            )}
          >
            Motions
          </Link>
        </nav>
      </div>
    </header>
  )
}

