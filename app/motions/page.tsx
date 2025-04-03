"use client"

import { Sidebar } from "@/components/sidebar"
import { MotionsDashboard } from "@/components/motions-dashboard"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function MotionsPage() {
  const [isPageTransitioning, setIsPageTransitioning] = useState(true)

  useEffect(() => {
    // Simulate page transition
    const timer = setTimeout(() => {
      setIsPageTransitioning(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Sidebar>
      <div
        className={`flex-1 space-y-4 p-6 transition-opacity duration-300 ${isPageTransitioning ? "opacity-0" : "opacity-100"}`}
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Motions Dashboard</h1>
          <p className="text-muted-foreground">Review and process motion documents submitted to the court.</p>
        </div>

        {isPageTransitioning ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full max-w-md" />
            <Skeleton className="h-[600px] w-full" />
          </div>
        ) : (
          <MotionsDashboard />
        )}
      </div>
    </Sidebar>
  )
}

