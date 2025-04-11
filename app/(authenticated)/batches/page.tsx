"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { RefreshCw, ExternalLink } from "lucide-react"
import type { BatchUpload, User } from "@/lib/types"
import { mockBatches } from "@/lib/mock-data"
import { formatDateTime } from "@/lib/utils"

export default function BatchesPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [batches, setBatches] = useState<BatchUpload[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("motionflow-user")
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)

      // Filter batches by user ID
      const userBatches = mockBatches.filter((batch) => batch.uploadedByUserId === parsedUser.id)
      setBatches(userBatches)
      setIsLoading(false)
    } else {
      router.push("/login")
    }
  }, [router])

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "outline"
      case "processing":
        return "secondary"
      case "complete":
        return "success"
      case "partial_complete":
        return "warning"
      case "failed":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending"
      case "processing":
        return "Processing"
      case "complete":
        return "Complete"
      case "partial_complete":
        return "Partially Complete"
      case "failed":
        return "Failed"
      default:
        return status
    }
  }

  const calculateProgress = (batch: BatchUpload) => {
    if (batch.status === "complete") return 100
    if (batch.status === "failed") return 0

    const processed = batch.processedFiles + batch.failedFiles
    return Math.round((processed / batch.totalFiles) * 100)
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
        <h1 className="text-2xl font-bold tracking-tight">Batch Uploads</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => router.push("/upload")}>
            New Upload
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Batches</CardTitle>
          <CardDescription>View and manage your recent batch uploads</CardDescription>
        </CardHeader>
        <CardContent>
          {batches.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No batch uploads found</p>
              <Button variant="link" onClick={() => router.push("/upload")} className="mt-2">
                Upload your first batch
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Files</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batches.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell className="font-medium">{batch.id.slice(0, 8)}</TableCell>
                    <TableCell>{formatDateTime(batch.uploadTimestamp)}</TableCell>
                    <TableCell>
                      {batch.processedFiles + batch.failedFiles}/{batch.totalFiles}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Progress value={calculateProgress(batch)} className="h-2" />
                        <div className="text-xs text-muted-foreground">{calculateProgress(batch)}% complete</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(batch.status)}>{getStatusLabel(batch.status)}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => router.push(`/dashboard?batchId=${batch.id}`)}>
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">View batch</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
