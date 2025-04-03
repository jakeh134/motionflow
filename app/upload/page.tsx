"use client"

import { Sidebar } from "@/components/sidebar"
import { UploadForm } from "@/components/upload-form"
import { QrCodeDisplay } from "@/components/qr-code-display"
import { RecentUploads } from "@/components/recent-uploads"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function UploadPage() {
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
          <h1 className="text-2xl font-bold tracking-tight">Upload Motion</h1>
          <p className="text-muted-foreground">
            Upload a motion document to extract information and process it automatically.
          </p>
        </div>

        {isPageTransitioning ? (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <Skeleton className="h-[400px] w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-[180px] w-full" />
              <Skeleton className="h-[180px] w-full" />
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <UploadForm />
            </div>
            <div className="space-y-6">
              <QrCodeDisplay />
              <RecentUploads />
            </div>
          </div>
        )}
      </div>
    </Sidebar>
  )
}

