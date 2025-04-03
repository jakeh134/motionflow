"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, CheckCircle, XCircle, AlertTriangle, Star, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Motion } from "@/lib/types"
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

// Mock data for a single motion
const mockMotion: Motion = {
  id: "1",
  caseNumber: "23-456",
  motionType: "Motion to Dismiss",
  filerName: "John Doe",
  status: "pending",
  dateField: "2023-04-01T10:30:00Z",
  reason: "Case settled between parties",
  complianceFlags: [
    {
      rule: "signaturePresent",
      message: "No signature detected",
      severity: "error",
    },
    {
      rule: "proofOfService",
      message: "Proof of service may be missing",
      severity: "warning",
    },
  ],
  extractedData: {
    caseNumber: "23-456",
    motionType: "Motion to Dismiss",
    filerName: "John Doe",
    reason: "Case settled between parties",
    confidence: {
      overall: 0.85,
      caseNumber: 0.95,
      motionType: 0.88,
      filerName: 0.92,
      reason: 0.75,
    },
  },
}

interface MotionReviewProps {
  id: string
}

export function MotionReview({ id }: MotionReviewProps) {
  const [motion] = useState<Motion>(mockMotion)
  const [rejectionReason, setRejectionReason] = useState("")
  const [fixNotes, setFixNotes] = useState("")
  const [aiRating, setAiRating] = useState<number | null>(null)
  const [feedbackIssues, setFeedbackIssues] = useState<string[]>([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showAcceptDialog, setShowAcceptDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [showFixDialog, setShowFixDialog] = useState(false)

  const handleAccept = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setShowAcceptDialog(false)
      setShowFeedback(true)
    }, 1000)
  }

  const handleReject = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setShowRejectDialog(false)
      setShowFeedback(true)
    }, 1000)
  }

  const handleRequestFix = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setShowFixDialog(false)
      setShowFeedback(true)
    }, 1000)
  }

  const handleFeedbackSubmit = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      alert("Thank you for your feedback!")
      // Redirect to dashboard
    }, 1000)
  }

  const toggleFeedbackIssue = (issue: string) => {
    if (feedbackIssues.includes(issue)) {
      setFeedbackIssues(feedbackIssues.filter((i) => i !== issue))
    } else {
      setFeedbackIssues([...feedbackIssues, issue])
    }
  }

  const renderComplianceFlags = () => {
    if (!motion.complianceFlags || motion.complianceFlags.length === 0) {
      return (
        <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-md">
          <CheckCircle className="h-5 w-5" />
          <span>No compliance issues detected</span>
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {motion.complianceFlags.map((flag, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center gap-2 p-3 rounded-md",
              flag.severity === "error" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600",
            )}
          >
            {flag.severity === "error" ? <AlertCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
            <span>{flag.message}</span>
          </div>
        ))}
      </div>
    )
  }

  if (showFeedback) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rate AI Performance</CardTitle>
          <CardDescription>Your feedback helps us improve our AI system</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="text-sm font-medium">How accurate was the AI extraction?</div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  variant="outline"
                  size="sm"
                  className={cn("h-10 w-10 p-0", aiRating === rating && "bg-primary text-primary-foreground")}
                  onClick={() => setAiRating(rating)}
                >
                  <Star className={cn("h-5 w-5", aiRating === rating && "fill-current")} />
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">What issues did you notice? (Select all that apply)</div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {[
                "Wrong Motion Type",
                "Missing Field",
                "Incorrect Field Extraction",
                "False Compliance Flag",
                "Missed Compliance Issue",
                "Other Issue",
              ].map((issue) => (
                <div key={issue} className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn("justify-start", feedbackIssues.includes(issue) && "bg-primary/10")}
                    onClick={() => toggleFeedbackIssue(issue)}
                  >
                    <span
                      className={cn(
                        "mr-2 h-4 w-4 rounded-sm border border-primary",
                        feedbackIssues.includes(issue) ? "bg-primary text-primary-foreground" : "opacity-50",
                      )}
                    >
                      {feedbackIssues.includes(issue) && <CheckCircle className="h-3 w-3" />}
                    </span>
                    {issue}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Additional comments (optional)</div>
            <Textarea placeholder="Please provide any additional feedback..." />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setShowFeedback(false)} disabled={isLoading}>
            Skip
          </Button>
          <Button onClick={handleFeedbackSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Submitting...
              </>
            ) : (
              "Submit Feedback"
            )}
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Sticky Decision Bar for Mobile */}
      <div className="md:hidden sticky top-0 z-10 bg-background border-b p-4 -mx-6 -mt-6 mb-6 flex items-center justify-between">
        <Button variant="ghost" size="sm" className="gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button size="sm" variant="success" onClick={() => setShowAcceptDialog(true)}>
            Accept
          </Button>
          <Button size="sm" variant="destructive" onClick={() => setShowRejectDialog(true)}>
            Reject
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="lg:col-span-1 overflow-hidden">
          <CardHeader>
            <CardTitle>Document Preview</CardTitle>
            <CardDescription>
              Case #{motion.caseNumber} | {motion.motionType}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="aspect-[8.5/11] bg-muted flex items-center justify-center">
              <div className="text-muted-foreground">Document preview would appear here</div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Motion Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="details">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="compliance">Compliance</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Case Number</div>
                      <div className="font-medium">{motion.caseNumber}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Motion Type</div>
                      <div className="font-medium">{motion.motionType}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Filer Name</div>
                      <div className="font-medium">{motion.filerName}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Date Filed</div>
                      <div className="font-medium">
                        {new Date(motion.dateField || motion.dateField).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Reason</div>
                    <div className="mt-1 rounded-md border p-3">{motion.reason}</div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-2">AI Confidence</div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                        <div
                          className={cn(
                            "h-full transition-all duration-500 ease-in-out",
                            motion.extractedData?.confidence.overall >= 0.9
                              ? "bg-green-500"
                              : motion.extractedData?.confidence.overall >= 0.7
                                ? "bg-amber-500"
                                : "bg-red-500",
                          )}
                          style={{ width: `${(motion.extractedData?.confidence.overall || 0) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {Math.round((motion.extractedData?.confidence.overall || 0) * 100)}%
                      </span>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="compliance" className="pt-4">
                  {renderComplianceFlags()}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Decision</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Desktop Decision Buttons */}
              <div className="hidden md:grid grid-cols-3 gap-2">
                <Button
                  className="flex flex-col items-center gap-1 h-auto py-3"
                  variant="success"
                  onClick={() => setShowAcceptDialog(true)}
                >
                  <CheckCircle className="h-5 w-5" />
                  <span>Accept</span>
                </Button>

                <Button
                  variant="destructive"
                  className="flex flex-col items-center gap-1 h-auto py-3"
                  onClick={() => setShowRejectDialog(true)}
                >
                  <XCircle className="h-5 w-5" />
                  <span>Reject</span>
                </Button>

                <Button
                  variant="outline"
                  className="flex flex-col items-center gap-1 h-auto py-3"
                  onClick={() => setShowFixDialog(true)}
                >
                  <AlertTriangle className="h-5 w-5" />
                  <span>Request Fix</span>
                </Button>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Rejection Reason</div>
                <Select value={rejectionReason} onValueChange={setRejectionReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="missing_service">Missing Proof of Service</SelectItem>
                    <SelectItem value="fee_unpaid">Fee Unpaid</SelectItem>
                    <SelectItem value="invalid_reason">Invalid Reason</SelectItem>
                    <SelectItem value="missing_signature">Missing Signature</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Notes for Fix Request</div>
                <Textarea
                  placeholder="Provide details about what needs to be fixed..."
                  value={fixNotes}
                  onChange={(e) => setFixNotes(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Accept Dialog */}
      <AlertDialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Accept Motion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to accept this motion? This will move it to the accepted queue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAccept}
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
                  Accept Motion
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
            <AlertDialogTitle>Reject Motion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this motion? Please ensure you've selected a rejection reason.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              disabled={isLoading || !rejectionReason}
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
                  Reject Motion
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Fix Dialog */}
      <AlertDialog open={showFixDialog} onOpenChange={setShowFixDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Request Fix</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to request a fix for this motion? Please ensure you've provided notes about what
              needs to be fixed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRequestFix}
              disabled={isLoading || !fixNotes}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Request Fix
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

