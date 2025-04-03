"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

const recentUploads = [
  {
    id: "1",
    filename: "Motion_to_Dismiss_Smith.pdf",
    timestamp: "2 minutes ago",
    status: "processing" as const,
  },
  {
    id: "2",
    filename: "Continuance_Request_Johnson.pdf",
    timestamp: "15 minutes ago",
    status: "completed" as const,
  },
  {
    id: "3",
    filename: "Default_Judgment_Brown.pdf",
    timestamp: "1 hour ago",
    status: "completed" as const,
  },
]

export function RecentUploads() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Recent Uploads
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentUploads.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No recent uploads</p>
          ) : (
            <ul className="space-y-3">
              {recentUploads.map((upload) => (
                <li key={upload.id} className="flex items-start gap-3">
                  <div className="rounded-md bg-primary/10 p-2 mt-0.5">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{upload.filename}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span>{upload.timestamp}</span>
                      <span className="mx-1">•</span>
                      <span
                        className={cn(
                          "capitalize",
                          upload.status === "processing" && "text-amber-600",
                          upload.status === "completed" && "text-green-600",
                        )}
                      >
                        {upload.status}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

