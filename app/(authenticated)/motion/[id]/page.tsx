"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch" // Add Switch import
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Copy,
  Eye,
  FileText,
  RefreshCw,
  XCircle,
  BookOpen,
  Highlighter,
} from "lucide-react"
import type { Motion, User } from "@/lib/types"
import { mockMotions } from "@/lib/mock-data"
import { formatDateTime } from "@/lib/utils"

// Add types for citations
interface Citation {
  id: string
  text: string
  isValid: boolean
  reason?: string
  location: string
}

export default function MotionDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [motion, setMotion] = useState<Motion | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [editedData, setEditedData] = useState<any>({})
  const [hasEdits, setHasEdits] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [fixRequestDialogOpen, setFixRequestDialogOpen] = useState(false)
  const [fixRequestNotes, setFixRequestNotes] = useState("")
  const [activeTab, setActiveTab] = useState("document")
  const [highlightEnabled, setHighlightEnabled] = useState(true) // Add state for highlighting toggle

  // Mock citations for the document
  const [citations] = useState<Citation[]>([
    {
      id: "cit1",
      text: "Texas Property Code § 24.005",
      isValid: true,
      location: "Paragraph 2"
    },
    {
      id: "cit2",
      text: "Smith v. Jones, 123 S.W.3d 456 (Tex. App. 2019)",
      isValid: true,
      location: "Paragraph 3"
    },
    {
      id: "cit3",
      text: "Tex. R. Civ. P. 510.9",
      isValid: false,
      reason: "Rule number is incorrect. Should be 510.7 for continuances in eviction cases.",
      location: "Paragraph 4"
    }
  ])

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("motionflow-user")
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)

      // Find motion by ID
      const foundMotion = mockMotions.find((m) => m.id === params.id)
      if (foundMotion) {
        // Check if user has access to this motion
        if (foundMotion.courtId === parsedUser.courtId) {
          setMotion(foundMotion)
          setEditedData(foundMotion.extractedData)
        } else {
          // User doesn't have access to this motion
          toast({
            title: "Access denied",
            description: "You don't have permission to view this motion",
            variant: "destructive",
          })
          router.push("/dashboard")
        }
      } else {
        // Motion not found
        toast({
          title: "Motion not found",
          description: "The requested motion could not be found",
          variant: "destructive",
        })
        router.push("/dashboard")
      }
      setIsLoading(false)
    } else {
      router.push("/login")
    }
  }, [params.id, router, toast])

  const handleInputChange = (field: string, value: string) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }))
    setHasEdits(true)
  }

  const handleSaveChanges = () => {
    // In a real app, we would call an API to update the motion
    setMotion((prev) => {
      if (!prev) return null
      return {
        ...prev,
        extractedData: editedData,
      }
    })

    setHasEdits(false)
    toast({
      title: "Changes saved",
      description: "Your changes have been saved successfully",
    })
  }

  const handleAccept = () => {
    // In a real app, we would call an API to update the motion
    setMotion((prev) => {
      if (!prev) return null
      return {
        ...prev,
        status: "accepted",
      }
    })

    toast({
      title: "Motion accepted",
      description: "The motion has been accepted successfully",
    })

    // Redirect to dashboard after a delay
    setTimeout(() => {
      router.push("/dashboard")
    }, 1500)
  }

  const handleReject = () => {
    if (!rejectReason) {
      toast({
        title: "Rejection reason required",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      })
      return
    }

    // In a real app, we would call an API to update the motion
    setMotion((prev) => {
      if (!prev) return null
      return {
        ...prev,
        status: "rejected",
      }
    })

    setRejectDialogOpen(false)
    toast({
      title: "Motion rejected",
      description: "The motion has been rejected successfully",
    })

    // Redirect to dashboard after a delay
    setTimeout(() => {
      router.push("/dashboard")
    }, 1500)
  }

  const handleRequestFix = () => {
    if (!fixRequestNotes) {
      toast({
        title: "Fix request notes required",
        description: "Please provide notes for the fix request",
        variant: "destructive",
      })
      return
    }

    // In a real app, we would call an API to update the motion
    setMotion((prev) => {
      if (!prev) return null
      return {
        ...prev,
        status: "fix_requested",
      }
    })

    setFixRequestDialogOpen(false)
    toast({
      title: "Fix requested",
      description: "The fix request has been sent successfully",
    })

    // Redirect to dashboard after a delay
    setTimeout(() => {
      router.push("/dashboard")
    }, 1500)
  }

  const copyFromDocument = () => {
    // In a real app, this would copy selected text from the document
    toast({
      title: "Text copied",
      description: "Selected text has been copied to the clipboard",
    })
  }

  // Function to jump to a citation in the document
  const jumpToCitation = (citationId: string) => {
    setActiveTab("document")
    // In a real implementation, this would scroll to the citation
    toast({
      title: "Citation located",
      description: `Jumped to citation in ${citations.find(c => c.id === citationId)?.location}`,
    })
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

  if (!motion) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold">Motion Not Found</h2>
        <p className="text-muted-foreground mb-4">The requested motion could not be found</p>
        <Button onClick={() => router.push("/dashboard")}>Return to Dashboard</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Motion Review</h1>
        <Badge variant={getStatusBadgeVariant(motion.status)}>{getStatusLabel(motion.status)}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document Preview */}
        <div className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="document">
                <FileText className="h-4 w-4 mr-2" />
                Document
              </TabsTrigger>
              <TabsTrigger value="summary">
                <Eye className="h-4 w-4 mr-2" />
                AI Summary
              </TabsTrigger>
            </TabsList>
            <TabsContent value="document" className="mt-4">
              <Card className="border-2 border-muted">
                <CardHeader className="bg-muted/50 py-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-medium">Document Preview</CardTitle>
                    <div className="flex items-center space-x-4">
                      {/* Add highlighting toggle */}
                      <div className="flex items-center space-x-2">
                        <Highlighter className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Highlight Key Info</span>
                        <Switch 
                          checked={highlightEnabled} 
                          onCheckedChange={setHighlightEnabled}
                        />
                      </div>
                      <Button variant="ghost" size="sm" onClick={copyFromDocument}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Selection
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="bg-white rounded-b-lg overflow-hidden">
                    {/* This would be a PDF viewer in a real app */}
                    <div className="h-[600px] flex items-center justify-center bg-slate-100 p-4">
                      <div className="max-w-md mx-auto bg-white p-8 shadow-sm border rounded-lg">
                        {/* Add highlighting legend */}
                        {highlightEnabled && (
                          <div className="mb-4 p-2 bg-slate-50 rounded text-xs flex flex-wrap gap-2">
                            <span className="flex items-center">
                              <span className="inline-block w-3 h-3 bg-yellow-200 mr-1 rounded"></span> Dates
                            </span>
                            <span className="flex items-center">
                              <span className="inline-block w-3 h-3 bg-blue-200 mr-1 rounded"></span> Names
                            </span>
                            <span className="flex items-center">
                              <span className="inline-block w-3 h-3 bg-green-200 mr-1 rounded"></span> Case Numbers
                            </span>
                            <span className="flex items-center">
                              <span className="inline-block w-3 h-3 bg-purple-200 mr-1 rounded"></span> Citations
                            </span>
                          </div>
                        )}
                        
                        <div className="text-center mb-6">
                          <h2 className="text-xl font-bold">MOTION FOR CONTINUANCE</h2>
                          <p className="text-sm text-muted-foreground">Case No. {highlightEnabled ? <span className="bg-green-200 px-1 rounded">{motion.caseNumber}</span> : motion.caseNumber}</p>
                        </div>

                        <div className="mb-6">
                          <p className="mb-2">
                            <strong>PLAINTIFF:</strong> Landlord Properties LLC
                          </p>
                          <p>
                            <strong>DEFENDANT:</strong> {highlightEnabled ? <span className="bg-blue-200 px-1 rounded">{motion.filerName}</span> : motion.filerName}
                          </p>
                        </div>

                        <div className="mb-6">
                          <p className="mb-4">
                            COMES NOW the Defendant, {highlightEnabled ? <span className="bg-blue-200 px-1 rounded">{motion.filerName}</span> : motion.filerName}, and moves this Court for a continuance of the
                            hearing scheduled for {highlightEnabled ? <span className="bg-yellow-200 px-1 rounded">April 15, 2025</span> : "April 15, 2025"}, and in support thereof states:
                          </p>

                          <ol className="list-decimal pl-6 space-y-2">
                            <li>Defendant requires additional time to gather evidence and prepare for the hearing.</li>
                            <li>
                              Defendant has a medical appointment that conflicts with the currently scheduled hearing
                              date.
                            </li>
                            <li>This is the first request for continuance in this matter.</li>
                            <li>
                              Plaintiff's counsel has been contacted and does not oppose this request. 
                              {highlightEnabled && <span className="bg-purple-200 px-1 rounded ml-1">Texas Property Code § 24.005</span>}
                            </li>
                          </ol>
                        </div>

                        <div className="mb-6">
                          <p>
                            WHEREFORE, Defendant respectfully requests that this Court grant a continuance of the
                            hearing currently scheduled for {highlightEnabled ? <span className="bg-yellow-200 px-1 rounded">April 15, 2025</span> : "April 15, 2025"}, and reschedule it for a date after {highlightEnabled ? <span className="bg-yellow-200 px-1 rounded">April 30, 2025</span> : "April 30, 2025"}.
                            {highlightEnabled && <span className="bg-purple-200 px-1 rounded ml-1">Smith v. Jones, 123 S.W.3d 456 (Tex. App. 2019)</span>}
                          </p>
                        </div>

                        <div className="mt-8">
                          <p className="text-right">Respectfully submitted,</p>
                          <p className="text-right mt-4">/s/ {highlightEnabled ? <span className="bg-blue-200 px-1 rounded">{motion.filerName}</span> : motion.filerName}</p>
                          <p className="text-right text-sm text-muted-foreground">{formatDateTime(new Date())}</p>
                          {highlightEnabled && <p className="text-right text-sm text-muted-foreground mt-2"><span className="bg-purple-200 px-1 rounded">Tex. R. Civ. P. 510.9</span></p>}
                        </div>
                        <div className="text-sm text-muted-foreground">Filed: {formatDateTime(motion.createdAt)}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="summary" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>AI Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    {motion.summary ||
                      "Defendant John Doe files a Motion for Continuance for the hearing on April 15, 2025, citing the need for additional time to gather evidence and a conflicting medical appointment. This is their first continuance request, and the plaintiff does not oppose it. They request rescheduling after April 30, 2025."}
                  </p>
                </CardContent>
              </Card>

              {/* AI Assistance Features */}
              <div className="mt-4 space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Duplicate Detection</AlertTitle>
                  <AlertDescription>No similar motions detected in the system.</AlertDescription>
                </Alert>

                <Alert variant="warning">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>PII Detection</AlertTitle>
                  <AlertDescription>
                    No personally identifiable information (PII) detected in this document.
                  </AlertDescription>
                </Alert>

                {/* Add Citation Verification */}
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Citation Verification
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3">
                    <div className="space-y-3 text-sm">
                      {citations.map(citation => (
                        <div key={citation.id} className="flex items-start space-x-2 p-2 rounded border">
                          {citation.isValid ? (
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <div className="font-medium">{citation.text}</div>
                            {citation.reason && (
                              <div className="text-xs text-red-600 mt-1">{citation.reason}</div>
                            )}
                            <div className="text-xs text-muted-foreground mt-1">
                              Found in: {citation.location}
                              <Button 
                                variant="link" 
                                size="sm" 
                                className="h-auto p-0 ml-2 text-xs"
                                onClick={() => jumpToCitation(citation.id)}
                              >
                                View in document
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Extracted Data & Actions */}
        <div className="space-y-6">
          {/* Extracted Data Form */}
          <Card>
            <CardHeader>
              <CardTitle>Extracted Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="caseNumber">Case Number</Label>
                    <Input
                      id="caseNumber"
                      value={editedData.caseNumber || motion.caseNumber}
                      onChange={(e) => handleInputChange("caseNumber", e.target.value)}
                      className={motion.aiConfidence?.caseNumber < 0.8 ? "border-yellow-500" : ""}
                    />
                    {motion.aiConfidence?.caseNumber < 0.8 && (
                      <p className="text-xs text-yellow-600">
                        Low confidence (AI: {Math.round(motion.aiConfidence?.caseNumber * 100)}%)
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="motionType">Motion Type</Label>
                    <Input
                      id="motionType"
                      value={editedData.motionType || motion.motionType}
                      onChange={(e) => handleInputChange("motionType", e.target.value)}
                      readOnly
                      className="bg-muted/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="filerName">Filer Name</Label>
                  <Input
                    id="filerName"
                    value={editedData.filerName || motion.filerName}
                    onChange={(e) => handleInputChange("filerName", e.target.value)}
                    className={motion.aiConfidence?.filerName < 0.8 ? "border-yellow-500" : ""}
                  />
                  {motion.aiConfidence?.filerName < 0.8 && (
                    <p className="text-xs text-yellow-600">
                      Low confidence (AI: {Math.round(motion.aiConfidence?.filerName * 100)}%)
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Continuance</Label>
                  <Textarea
                    id="reason"
                    value={editedData.reason || motion.extractedData.reason || ""}
                    onChange={(e) => handleInputChange("reason", e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="originalDate">Original Hearing Date</Label>
                    <Input
                      id="originalDate"
                      value={editedData.originalDate || motion.extractedData.originalDate || ""}
                      onChange={(e) => handleInputChange("originalDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="requestedDate">Requested New Date</Label>
                    <Input
                      id="requestedDate"
                      value={editedData.requestedDate || motion.extractedData.requestedDate || ""}
                      onChange={(e) => handleInputChange("requestedDate", e.target.value)}
                    />
                  </div>
                </div>

                {/* Add a section for legal citations */}
                <div className="space-y-2">
                  <Label>Legal Citations</Label>
                  <div className="border rounded-md p-2 space-y-2 bg-muted/20">
                    {citations.map(citation => (
                      <div key={citation.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          {citation.isValid ? (
                            <CheckCircle className="h-3 w-3 text-green-600 mr-2" />
                          ) : (
                            <XCircle className="h-3 w-3 text-red-600 mr-2" />
                          )}
                          <span>{citation.text}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 px-2 text-xs"
                          onClick={() => jumpToCitation(citation.id)}
                        >
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {hasEdits && (
                  <Button onClick={handleSaveChanges} className="w-full">
                    Save Changes
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Compliance Flags */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance Check</CardTitle>
            </CardHeader>
            <CardContent>
              {motion.complianceFlags && motion.complianceFlags.length > 0 ? (
                <div className="space-y-3">
                  {motion.complianceFlags.map((flag, index) => (
                    <Alert key={index} variant={flag.pass ? "default" : "destructive"}>
                      {flag.pass ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      <AlertTitle>{flag.rule}</AlertTitle>
                      {!flag.pass && flag.message && <AlertDescription>{flag.message}</AlertDescription>}
                    </Alert>
                  ))}
                </div>
              ) : (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>All compliance checks passed</AlertTitle>
                  <AlertDescription>This motion meets all the required compliance rules.</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-2">
            <Button onClick={handleAccept} className="w-full" disabled={motion.status === "accepted"}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Accept Motion
            </Button>

            <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="w-full" disabled={motion.status === "rejected"}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Motion
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reject Motion</DialogTitle>
                  <DialogDescription>Please provide a reason for rejecting this motion.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="rejectReason">Rejection Reason</Label>
                    <Select value={rejectReason} onValueChange={setRejectReason}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a reason" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="missing_signature">Missing Signature</SelectItem>
                        <SelectItem value="missing_service">Missing Proof of Service</SelectItem>
                        <SelectItem value="incomplete_information">Incomplete Information</SelectItem>
                        <SelectItem value="wrong_court">Wrong Court/Jurisdiction</SelectItem>
                        <SelectItem value="invalid_citation">Invalid Legal Citation</SelectItem>
                        <SelectItem value="other">Other (specify in notes)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rejectNotes">Additional Notes (Optional)</Label>
                    <Textarea id="rejectNotes" placeholder="Enter any additional notes..." rows={3} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleReject}>
                    Confirm Rejection
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={fixRequestDialogOpen} onOpenChange={setFixRequestDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full" disabled={motion.status === "fix_requested"}>
                  Request Fix
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Request Fix</DialogTitle>
                  <DialogDescription>Please provide details about what needs to be fixed.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="fixRequestNotes">Fix Request\
