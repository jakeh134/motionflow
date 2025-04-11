"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Filter, MoreHorizontal, RefreshCw, Search } from "lucide-react"
import type { Motion, User } from "@/lib/types"
import { mockMotions } from "@/lib/mock-data"
import { formatDateTime } from "@/lib/utils"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [motions, setMotions] = useState<Motion[]>([])
  const [filteredMotions, setFilteredMotions] = useState<Motion[]>([])
  const [selectedMotions, setSelectedMotions] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("motionflow-user")
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)

      // Filter motions by court ID
      const userMotions = mockMotions.filter((motion) => motion.courtId === parsedUser.courtId)
      setMotions(userMotions)
      setFilteredMotions(userMotions)
      setIsLoading(false)
    } else {
      router.push("/login")
    }
  }, [router])

  useEffect(() => {
    if (motions.length > 0) {
      let filtered = [...motions]

      // Apply status filter
      if (statusFilter !== "all") {
        filtered = filtered.filter((motion) => motion.status === statusFilter)
      }

      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        filtered = filtered.filter(
          (motion) => motion.caseNumber.toLowerCase().includes(query) || motion.filerName.toLowerCase().includes(query),
        )
      }

      setFilteredMotions(filtered)
    }
  }, [statusFilter, searchQuery, motions])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMotions(filteredMotions.map((motion) => motion.id))
    } else {
      setSelectedMotions([])
    }
  }

  const handleSelectMotion = (motionId: string, checked: boolean) => {
    if (checked) {
      setSelectedMotions([...selectedMotions, motionId])
    } else {
      setSelectedMotions(selectedMotions.filter((id) => id !== motionId))
    }
  }

  const handleBatchAction = (action: "accept" | "reject") => {
    if (selectedMotions.length === 0) return

    // In a real app, we would call an API to update the motions
    const updatedMotions = motions.map((motion) => {
      if (selectedMotions.includes(motion.id)) {
        return {
          ...motion,
          status: action === "accept" ? "accepted" : "rejected",
        }
      }
      return motion
    })

    setMotions(updatedMotions)
    setSelectedMotions([])
  }

  const handleViewMotion = (motionId: string) => {
    router.push(`/motion/${motionId}`)
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "outline"
      case "accepted":
        return "success"
      case "rejected":
        return "destructive"
      case "fix_requested":
        return "warning"
      case "needs_manual_review":
        return "secondary"
      case "ai_error":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending"
      case "accepted":
        return "Accepted"
      case "rejected":
        return "Rejected"
      case "fix_requested":
        return "Fix Requested"
      case "needs_manual_review":
        return "Needs Review"
      case "ai_error":
        return "AI Error"
      default:
        return status
    }
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
        <h1 className="text-2xl font-bold tracking-tight">Motion Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => router.push("/upload")}>
            Upload New Motion
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by case number or filer name..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="fix_requested">Fix Requested</SelectItem>
                <SelectItem value="needs_manual_review">Needs Review</SelectItem>
                <SelectItem value="ai_error">AI Error</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Batch Actions */}
      {selectedMotions.length > 0 && (
        <div className="bg-muted/50 p-2 rounded-lg flex items-center justify-between">
          <div className="text-sm font-medium">
            {selectedMotions.length} motion{selectedMotions.length !== 1 && "s"} selected
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={() => setSelectedMotions([])}>
              Clear Selection
            </Button>
            <Button size="sm" variant="default" onClick={() => handleBatchAction("accept")}>
              Accept Selected
            </Button>
            <Button size="sm" variant="destructive" onClick={() => handleBatchAction("reject")}>
              Reject Selected
            </Button>
          </div>
        </div>
      )}

      {/* Motions Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={filteredMotions.length > 0 && selectedMotions.length === filteredMotions.length}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Case #</TableHead>
              <TableHead>Motion Type</TableHead>
              <TableHead>Filer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Filed</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMotions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No motions found matching your filters
                </TableCell>
              </TableRow>
            ) : (
              filteredMotions.map((motion) => (
                <TableRow key={motion.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedMotions.includes(motion.id)}
                      onCheckedChange={(checked) => handleSelectMotion(motion.id, checked as boolean)}
                      aria-label={`Select motion ${motion.caseNumber}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{motion.caseNumber}</TableCell>
                  <TableCell>{motion.motionType}</TableCell>
                  <TableCell>{motion.filerName}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(motion.status)}>{getStatusLabel(motion.status)}</Badge>
                  </TableCell>
                  <TableCell>{formatDateTime(motion.createdAt)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewMotion(motion.id)}>View Details</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleBatchAction("accept")}>Accept</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleBatchAction("reject")}>Reject</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
