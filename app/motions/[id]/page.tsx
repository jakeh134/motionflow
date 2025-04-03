"use client"

import { Sidebar } from "@/components/sidebar"
import { MotionReview } from "@/components/motion-review"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function MotionReviewPage({ params }: { params: { id: string } }) {
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
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/motions">Motions</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/motions/${params.id}`} isCurrentPage>
                Motion #{params.id}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center gap-4">
          <Link href="/motions">
            <Button variant="ghost" size="sm" className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              Back to Motions Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Motion Review</h1>
            <p className="text-muted-foreground">Review motion details and make a decision.</p>
          </div>
        </div>

        {isPageTransitioning ? (
          <div className="grid gap-6 lg:grid-cols-2">
            <Skeleton className="h-[600px] w-full" />
            <div className="space-y-6">
              <Skeleton className="h-[300px] w-full" />
              <Skeleton className="h-[250px] w-full" />
            </div>
          </div>
        ) : (
          <MotionReview id={params.id} />
        )}
      </div>
    </Sidebar>
  )
}

