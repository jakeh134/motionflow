"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch" // Add Switch import
import { useToast } from "@/hooks/use-toast"
import {
  AlertCircle,
  CheckCircle,
  Copy,
  Eye,
  FileText,
  ThumbsDown,
  ThumbsUp,
  XCircle,
  BookOpen,
  Highlighter,
} from "lucide-react"
import type { Motion } from "@/lib/types"
import { formatDateTime } from "@/lib/utils"

// Add types for citations and highlights
interface Citation {
  id: string
  text: string
  isValid: boolean
  reason?: string
  location: string
}

interface DocumentReviewProps {
  document: Motion
  onUpdate: (updatedDoc: Motion) => void
}

export function DocumentReview({ document, onUpdate }: DocumentReviewProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("document")
  const [editedData, setEditedData] = useState<Record<string, any>>(document.extractedData || {})
  const [hasEdits, setHasEdits] = useState(false)
  const [status, setStatus] = useState<Motion["status"]>(document.status)
  const [highlightEnabled, setHighlightEnabled] = useState(true) // Add state for highlighting toggle

  // Mock citations for the document
  const [citations] = useState<Citation[]>([
    {
      id: "cit1",
      text: "Texas Property Code § 24.005",
      isValid: true,
      location: "Paragraph 2",
    },
    {
      id: "cit2",
      text: "Smith v. Jones, 123 S.W.3d 456 (Tex. App. 2019)",
      isValid: true,
      location: "Paragraph 3",
    },
    {
      id: "cit3",
      text: "Tex. R. Civ. P. 510.9",
      isValid: false,
      reason: "Rule number is incorrect. Should be 510.7 for continuances in eviction cases.",
      location: "Paragraph 4",
    },
  ])

  const handleInputChange = (field: string, value: string) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }))
    setHasEdits(true)
  }

  const handleSaveChanges = () => {
    const updatedDoc = {
      ...document,
      extractedData: editedData,
    }
    onUpdate(updatedDoc)
    setHasEdits(false)

    toast({
      title: "Changes saved",
      description: "Your changes have been saved successfully",
    })
  }

  const handleApprove = () => {
    const updatedDoc = {
      ...document,
      extractedData: editedData,
      status: "accepted",
    }
    onUpdate(updatedDoc)
    setStatus("accepted")

    toast({
      title: "Document approved",
      description: "The document has been approved and will be added to the dashboard",
    })
  }

  const handleReject = () => {
    const updatedDoc = {
      ...document,
      status: "rejected",
    }
    onUpdate(updatedDoc)
    setStatus("rejected")

    toast({
      title: "Document rejected",
      description: "The document has been rejected and will not be processed",
    })
  }

  const handleRequestManualReview = () => {
    const updatedDoc = {
      ...document,
      status: "needs_manual_review",
    }
    onUpdate(updatedDoc)
    setStatus("needs_manual_review")

    toast({
      title: "Manual review requested",
      description: "The document has been flagged for manual review by a clerk",
    })
  }

  const copyFromDocument = () => {
    toast({
      title: "Text copied",
      description: "Selected text has been copied to the clipboard",
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
        return "Approved"
      case "rejected":
        return "Rejected"
      case "fix_requested":
        return "Fix Requested"
      case "needs_manual_review":
        return "Needs Manual Review"
      case "ai_error":
        return "AI Error"
      default:
        return status
    }
  }

  // Function to jump to a citation in the document
  const jumpToCitation = (citationId: string) => {
    setActiveTab("document")
    // In a real implementation, this would scroll to the citation
    toast({
      title: "Citation located",
      description: `Jumped to citation in ${citations.find((c) => c.id === citationId)?.location}`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-medium">{document.caseNumber}</h3>
          <Badge variant={getStatusBadgeVariant(status)}>{getStatusLabel(status)}</Badge>
        </div>
        <div className="text-sm text-muted-foreground">Filed: {formatDateTime(document.createdAt)}</div>
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
                        <Switch checked={highlightEnabled} onCheckedChange={setHighlightEnabled} />
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
                    <div className="h-[500px] flex items-center justify-center bg-slate-100 p-4">
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
                          <p className="text-sm text-muted-foreground">
                            Case No.{" "}
                            {highlightEnabled ? (
                              <span className="bg-green-200 px-1 rounded">{document.caseNumber}</span>
                            ) : (
                              document.caseNumber
                            )}
                          </p>
                        </div>

                        <div className="mb-6">
                          <p className="mb-2">
                            <strong>PLAINTIFF:</strong> Landlord Properties LLC
                          </p>
                          <p>
                            <strong>DEFENDANT:</strong>{" "}
                            {highlightEnabled ? (
                              <span className="bg-blue-200 px-1 rounded">{document.filerName}</span>
                            ) : (
                              document.filerName
                            )}
                          </p>
                        </div>

                        <div className="mb-6">
                          <p className="mb-4">
                            COMES NOW the Defendant,{" "}
                            {highlightEnabled ? (
                              <span className="bg-blue-200 px-1 rounded">{document.filerName}</span>
                            ) : (
                              document.filerName
                            )}
                            , and moves this Court for a continuance of the hearing scheduled for{" "}
                            {highlightEnabled ? (
                              <span className="bg-yellow-200 px-1 rounded">April 15, 2025</span>
                            ) : (
                              "April 15, 2025"
                            )}
                            , and in support thereof states:
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
                              {highlightEnabled && (
                                <span className="bg-purple-200 px-1 rounded ml-1">Texas Property Code § 24.005</span>
                              )}
                            </li>
                          </ol>
                        </div>

                        <div className="mb-6">
                          <p>
                            WHEREFORE, Defendant respectfully requests that this Court grant a continuance of the
                            hearing currently scheduled for{" "}
                            {highlightEnabled ? (
                              <span className="bg-yellow-200 px-1 rounded">April 15, 2025</span>
                            ) : (
                              "April 15, 2025"
                            )}
                            , and reschedule it for a date after{" "}
                            {highlightEnabled ? (
                              <span className="bg-yellow-200 px-1 rounded">April 30, 2025</span>
                            ) : (
                              "April 30, 2025"
                            )}
                            .
                            {highlightEnabled && (
                              <span className="bg-purple-200 px-1 rounded ml-1">
                                Smith v. Jones, 123 S.W.3d 456 (Tex. App. 2019)
                              </span>
                            )}
                          </p>
                        </div>

                        <div className="mt-8">
                          <p className="text-right">Respectfully submitted,</p>
                          <p className="text-right mt-4">
                            /s/{" "}
                            {highlightEnabled ? (
                              <span className="bg-blue-200 px-1 rounded">{document.filerName}</span>
                            ) : (
                              document.filerName
                            )}
                          </p>
                          <p className="text-right text-sm text-muted-foreground">Defendant, Pro Se</p>
                          <p className="text-right text-sm text-muted-foreground">
                            {highlightEnabled ? (
                              <span className="bg-yellow-200 px-1 rounded">April 1, 2025</span>
                            ) : (
                              "April 1, 2025"
                            )}
                          </p>
                          {highlightEnabled && (
                            <p className="text-right text-sm text-muted-foreground mt-2">
                              <span className="bg-purple-200 px-1 rounded">Tex. R. Civ. P. 510.9</span>
                            </p>
                          )}
                        </div>
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
                    {document.summary ||
                      "Defendant files a Motion for Continuance for the hearing on April 15, 2025, citing the need for additional time to gather evidence and a conflicting medical appointment. This is their first continuance request, and the plaintiff does not oppose it. They request rescheduling after April 30, 2025."}
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
                      {citations.map((citation) => (
                        <div key={citation.id} className="flex items-start space-x-2 p-2 rounded border">
                          {citation.isValid ? (
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <div className="font-medium">{citation.text}</div>
                            {citation.reason && <div className="text-xs text-red-600 mt-1">{citation.reason}</div>}
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
                      value={editedData.caseNumber || document.caseNumber}
                      onChange={(e) => handleInputChange("caseNumber", e.target.value)}
                      className={document.aiConfidence?.caseNumber < 0.8 ? "border-yellow-500" : ""}
                    />
                    {document.aiConfidence?.caseNumber < 0.8 && (
                      <p className="text-xs text-yellow-600">
                        Low confidence (AI: {Math.round(document.aiConfidence?.caseNumber * 100)}%)
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="motionType">Motion Type</Label>
                    <Input
                      id="motionType"
                      value={editedData.motionType || document.motionType}
                      onChange={(e) => handleInputChange("motionType", e.target.value)}
                      className={document.aiConfidence?.motionType < 0.8 ? "border-yellow-500" : ""}
                    />
                    {document.aiConfidence?.motionType < 0.8 && (
                      <p className="text-xs text-yellow-600">
                        Low confidence (AI: {Math.round(document.aiConfidence?.motionType * 100)}%)
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="filerName">Filer Name</Label>
                  <Input
                    id="filerName"
                    value={editedData.filerName || document.filerName}
                    onChange={(e) => handleInputChange("filerName", e.target.value)}
                    className={document.aiConfidence?.filerName < 0.8 ? "border-yellow-500" : ""}
                  />
                  {document.aiConfidence?.filerName < 0.8 && (
                    <p className="text-xs text-yellow-600">
                      Low confidence (AI: {Math.round(document.aiConfidence?.filerName * 100)}%)
                    </p>
                  )}
                </div>

                {/* Dynamic fields based on motion type */}
                {document.motionType === "Motion for Continuance" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="reason">Reason for Continuance</Label>
                      <Textarea
                        id="reason"
                        value={editedData.reason || document.extractedData.reason || ""}
                        onChange={(e) => handleInputChange("reason", e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="originalDate">Original Hearing Date</Label>
                        <Input
                          id="originalDate"
                          value={editedData.originalDate || document.extractedData.originalDate || ""}
                          onChange={(e) => handleInputChange("originalDate", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="requestedDate">Requested New Date</Label>
                        <Input
                          id="requestedDate"
                          value={editedData.requestedDate || document.extractedData.requestedDate || ""}
                          onChange={(e) => handleInputChange("requestedDate", e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}

                {document.motionType === "Motion to Dismiss" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="dismissalReason">Grounds for Dismissal</Label>
                      <Textarea
                        id="dismissalReason"
                        value={editedData.dismissalReason || document.extractedData.dismissalReason || ""}
                        onChange={(e) => handleInputChange("dismissalReason", e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="legalAuthority">Legal Authority Cited</Label>
                      <Input
                        id="legalAuthority"
                        value={editedData.legalAuthority || document.extractedData.legalAuthority || ""}
                        onChange={(e) => handleInputChange("legalAuthority", e.target.value)}
                      />
                    </div>
                  </>
                )}

                {document.motionType === "Motion for Default Judgment" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="defaultReason">Reason for Default</Label>
                      <Textarea
                        id="defaultReason"
                        value={editedData.defaultReason || document.extractedData.defaultReason || ""}
                        onChange={(e) => handleInputChange("defaultReason", e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="serviceDate">Date of Service</Label>
                        <Input
                          id="serviceDate"
                          value={editedData.serviceDate || document.extractedData.serviceDate || ""}
                          onChange={(e) => handleInputChange("serviceDate", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="responseDeadline">Response Deadline</Label>
                        <Input
                          id="responseDeadline"
                          value={editedData.responseDeadline || document.extractedData.responseDeadline || ""}
                          onChange={(e) => handleInputChange("responseDeadline", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="judgmentAmount">Judgment Amount Requested</Label>
                      <Input
                        id="judgmentAmount"
                        value={editedData.judgmentAmount || document.extractedData.judgmentAmount || ""}
                        onChange={(e) => handleInputChange("judgmentAmount", e.target.value)}
                      />
                    </div>
                  </>
                )}

                {document.motionType === "Motion for Stay of Execution" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="stayReason">Reason for Stay Request</Label>
                      <Textarea
                        id="stayReason"
                        value={editedData.stayReason || document.extractedData.stayReason || ""}
                        onChange={(e) => handleInputChange("stayReason", e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="judgmentDate">Judgment Date</Label>
                        <Input
                          id="judgmentDate"
                          value={editedData.judgmentDate || document.extractedData.judgmentDate || ""}
                          onChange={(e) => handleInputChange("judgmentDate", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="executionDate">Scheduled Execution Date</Label>
                        <Input
                          id="executionDate"
                          value={editedData.executionDate || document.extractedData.executionDate || ""}
                          onChange={(e) => handleInputChange("executionDate", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="requestedStayDuration">Requested Stay Duration</Label>
                      <Input
                        id="requestedStayDuration"
                        value={editedData.requestedStayDuration || document.extractedData.requestedStayDuration || ""}
                        onChange={(e) => handleInputChange("requestedStayDuration", e.target.value)}
                      />
                    </div>
                  </>
                )}

                {document.motionType === "Motion to Set Aside Judgment" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="setAsideReason">Grounds for Setting Aside</Label>
                      <Textarea
                        id="setAsideReason"
                        value={editedData.setAsideReason || document.extractedData.setAsideReason || ""}
                        onChange={(e) => handleInputChange("setAsideReason", e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="judgmentDate">Judgment Date</Label>
                        <Input
                          id="judgmentDate"
                          value={editedData.judgmentDate || document.extractedData.judgmentDate || ""}
                          onChange={(e) => handleInputChange("judgmentDate", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="filingDeadline">Filing Deadline</Label>
                        <Input
                          id="filingDeadline"
                          value={editedData.filingDeadline || document.extractedData.filingDeadline || ""}
                          onChange={(e) => handleInputChange("filingDeadline", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="legalAuthority">Legal Authority Cited</Label>
                      <Input
                        id="legalAuthority"
                        value={editedData.legalAuthority || document.extractedData.legalAuthority || ""}
                        onChange={(e) => handleInputChange("legalAuthority", e.target.value)}
                      />
                    </div>
                  </>
                )}

                {/* Fallback for any other motion types not specifically handled */}
                {![
                  "Motion for Continuance",
                  "Motion to Dismiss",
                  "Motion for Default Judgment",
                  "Motion for Stay of Execution",
                  "Motion to Set Aside Judgment",
                ].includes(document.motionType) && (
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Motion</Label>
                    <Textarea
                      id="reason"
                      value={editedData.reason || document.extractedData.reason || ""}
                      onChange={(e) => handleInputChange("reason", e.target.value)}
                      rows={3}
                    />
                  </div>
                )}

                {/* Add a section for legal citations */}
                <div className="space-y-2">
                  <Label>Legal Citations</Label>
                  <div className="border rounded-md p-2 space-y-2 bg-muted/20">
                    {citations.map((citation) => (
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
              {document.complianceFlags && document.complianceFlags.length > 0 ? (
                <div className="space-y-3">
                  {document.complianceFlags.map((flag, index) => (
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
                  <AlertDescription>This document meets all the required compliance rules.</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-2">
            <Button onClick={handleApprove} className="w-full" disabled={status === "accepted"} variant="default">
              <ThumbsUp className="h-4 w-4 mr-2" />
              Approve Document
            </Button>

            <Button
              onClick={handleRequestManualReview}
              className="w-full"
              disabled={status === "needs_manual_review"}
              variant="outline"
            >
              <Eye className="h-4 w-4 mr-2" />
              Request Manual Review
            </Button>

            <Button onClick={handleReject} className="w-full" disabled={status === "rejected"} variant="destructive">
              <ThumbsDown className="h-4 w-4 mr-2" />
              Reject Document
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
