"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, CheckCircle, XCircle, Download } from "lucide-react"
import type { Motion } from "@/lib/types"
import { MotionCard } from "@/components/motion-card"
import { Skeleton } from "@/components/ui/skeleton"
import { LoadingSpinner } from "@/components/loading-spinner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Mock data
const mockMotions: Motion[] = [
  {
    id: "1",
    caseNumber: "23-456",
    caseType: "Evictions",
    motionType: "Motion to Dismiss",
    filerName: "John Doe",
    status: "pending",
    dateFiled: "2023-04-01T10:30:00Z",
    reason: "Case settled between parties",
  },
  {
    id: "2",
    caseNumber: "23-789",
    caseType: "Evictions",
    motionType: "Motion for Continuance",
    filerName: "Jane Smith",
    status: "pending",
    dateField: "2023-04-02T14:15:00Z",
    reason: "Need additional time to prepare",
  },
  {
    id: "3",
    caseNumber: "23-123",
    caseType: "Evictions",
    motionType: "Motion for Default Judgment",
    filerName: "Robert Johnson",
    status: "pending",
    dateField: "2023-04-03T09:45:00Z",
    reason: "Defendant failed to respond to complaint",
  },
  {
    id: "4",
    caseNumber: "23-234",
    caseType: "Evictions",
    motionType: "Motion for Stay of Execution",
    filerName: "Sarah Williams",
    status: "pending_review",
    dateField: "2023-04-03T11:20:00Z",
    reason: "Pending appeal",
  },
  {
    id: "5",
    caseNumber: "23-345",
    caseType: "Evictions",
    motionType: "Motion to Set Aside Judgment",
    filerName: "Michael Brown",
    status: "accepted",
    dateField: "2023-04-01T08:30:00Z",
    reason: "Missed hearing due to medical emergency",
  },
  {
    id: "6",
    caseNumber: "23-567",
    caseType: "Evictions",
    motionType: "Motion to Dismiss",
    filerName: "Emily Davis",
    status: "rejected",
    dateField: "2023-04-02T13:10:00Z",
    reason: "Lack of jurisdiction",
  },
]

export function MotionsDashboard() {
  const [selectedMotions, setSelectedMotions] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingInitial, setIsLoadingInitial] = useState(true)
  const [showAcceptDialog, setShowAcceptDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [actionSuccess, setActionSuccess] = useState<{
    type: "accept" | "reject" | null
    count: number
  } | null>(null)

  // Simulate initial data loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingInitial(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const filteredMotions = mockMotions.filter((motion) => {
    // Apply status filter
    if (statusFilter !== "all" && motion.status !== statusFilter) {
      return false
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        motion.caseNumber.toLowerCase().includes(query) ||
        motion.motionType.toLowerCase().includes(query) ||
        motion.filerName.toLowerCase().includes(query)
      )
    }

    return true
  })

  const handleSelectAll = () => {
    if (selectedMotions.length === filteredMotions.length) {
      setSelectedMotions([])
    } else {
      setSelectedMotions(filteredMotions.map((m) => m.id))
    }
  }

  const handleSelectMotion = (id: string) => {
    if (selectedMotions.includes(id)) {
      setSelectedMotions(selectedMotions.filter((m) => m !== id))
    } else {
      setSelectedMotions([...selectedMotions, id])
    }
  }

  const handleBatchAccept = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setShowAcceptDialog(false)
      setActionSuccess({
        type: "accept",
        count: selectedMotions.length,
      })
      setSelectedMotions([])

      // Auto-hide success message
      setTimeout(() => {
        setActionSuccess(null)
      }, 3000)
    }, 1000)
  }

  const handleBatchReject = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setShowRejectDialog(false)
      setActionSuccess({
        type: "reject",
        count: selectedMotions.length,
      })
      setSelectedMotions([])

      // Auto-hide success message
      setTimeout(() => {
        setActionSuccess(null)
      }, 3000)
    }, 1000)
  }

  const handleExport = () => {
    // Convert the filtered motions to CSV format
    const headers = ["Case #", "Case Type", "Motion Type", "Filer", "Status", "Date Filed"]
    const csvRows = [headers]

    filteredMotions.forEach((motion) => {
      const row = [
        motion.caseNumber,
        motion.caseType || "Evictions",
        motion.motionType,
        motion.filerName,
        motion.status,
        new Date(motion.dateField || motion.dateFiled).toLocaleDateString(),
      ]
      csvRows.push(row)
    })

    // Convert array to CSV string
    const csvContent = csvRows.map((row) => row.join(",")).join("\n")

    // Create a blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")

    // Set up and trigger download
    link.setAttribute("href", url)
    link.setAttribute("download", `motions-export-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="warning" className="font-normal">
            Pending
          </Badge>
        )
      case "pending_review":
        return (
          <Badge variant="secondary" className="font-normal">
            Needs Review
          </Badge>
        )
      case "accepted":
        return (
          <Badge variant="success" className="font-normal">
            Accepted
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="danger" className="font-normal">
            Rejected
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="font-normal">
            {status}
          </Badge>
        )
    }
  }

  if (isLoadingInitial) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between animate-pulse">
          <div className="flex w-full items-center gap-2 md:w-auto">
            <Skeleton className="h-10 w-full md:w-80" />
            <Skeleton className="h-10 w-[180px]" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>

        <div className="rounded-md border shadow-sm overflow-hidden">
          <div className="hidden md:block">
            <Skeleton className="h-12 w-full" />
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
          <div className="md:hidden space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {actionSuccess && (
        <div
          className={`p-4 rounded-md flex items-center gap-3 transition-all ${
            actionSuccess.type === "accept" ? "bg-green-50 text-green-800" : "bg-amber-50 text-amber-800"
          }`}
        >
          {actionSuccess.type === "accept" ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
          <span>
            Successfully {actionSuccess.type === "accept" ? "accepted" : "rejected"} {actionSuccess.count} motion
            {actionSuccess.count !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full items-center gap-2 md:w-auto">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by case #, motion, or filer..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="pending_review">Needs Review</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleExport} className="hidden md:flex">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport} className="md:hidden">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>

          {selectedMotions.length > 0 && (
            <div className="text-sm text-muted-foreground mr-2">{selectedMotions.length} selected</div>
          )}

          <Button
            variant="success"
            size="sm"
            onClick={() => setShowAcceptDialog(true)}
            disabled={selectedMotions.length === 0}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Accept
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowRejectDialog(true)}
            disabled={selectedMotions.length === 0}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Reject
          </Button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="rounded-md border shadow-sm overflow-hidden hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedMotions.length === filteredMotions.length && filteredMotions.length > 0}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                  className="translate-y-[2px]"
                />
              </TableHead>
              <TableHead className="w-[120px] font-medium">Case #</TableHead>
              <TableHead className="w-[120px] font-medium">Case Type</TableHead>
              <TableHead className="w-[200px] font-medium">Motion Type</TableHead>
              <TableHead className="font-medium">Filer</TableHead>
              <TableHead className="w-[120px] font-medium">Status</TableHead>
              <TableHead className="w-[120px] font-medium">Date Filed</TableHead>
              <TableHead className="w-[100px] text-right font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMotions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Search className="h-8 w-8 mb-2 text-muted-foreground/60" />
                    <p>No motions found</p>
                    <p className="text-sm">Try adjusting your search or filter criteria</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredMotions.map((motion) => (
                <TableRow key={motion.id} className="hover:bg-muted/30">
                  <TableCell>
                    <Checkbox
                      checked={selectedMotions.includes(motion.id)}
                      onCheckedChange={() => handleSelectMotion(motion.id)}
                      aria-label={`Select motion ${motion.caseNumber}`}
                      className="translate-y-[2px]"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{motion.caseNumber}</TableCell>
                  <TableCell>{motion.caseType}</TableCell>
                  <TableCell>{motion.motionType}</TableCell>
                  <TableCell>{motion.filerName}</TableCell>
                  <TableCell>{getStatusBadge(motion.status)}</TableCell>
                  <TableCell>{new Date(motion.dateField || motion.dateFiled).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/motions/${motion.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View details</span>
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filteredMotions.length === 0 ? (
          <div className="rounded-md border p-8 text-center">
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <Search className="h-8 w-8 mb-2 text-muted-foreground/60" />
              <p>No motions found</p>
              <p className="text-sm">Try adjusting your search or filter criteria</p>
            </div>
          </div>
        ) : (
          filteredMotions.map((motion) => (
            <MotionCard
              key={motion.id}
              motion={motion}
              isSelected={selectedMotions.includes(motion.id)}
              onSelect={handleSelectMotion}
            />
          ))
        )}
      </div>

      {/* Accept Dialog */}
      <AlertDialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Accept Selected Motions</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to accept {selectedMotions.length} motion{selectedMotions.length !== 1 ? "s" : ""}?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBatchAccept}
              disabled={isLoading}
              className="bg-success text-success-foreground hover:bg-success/90"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Accept Motions
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Selected Motions</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject {selectedMotions.length} motion{selectedMotions.length !== 1 ? "s" : ""}?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBatchReject}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject Motions
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

