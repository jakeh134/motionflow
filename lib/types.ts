export interface ExtractedData {
  caseNumber: string
  motionType: string
  filerName: string
  reason: string
  confidence: {
    overall: number
    caseNumber?: number
    motionType?: number
    filerName?: number
    reason?: number
    [key: string]: number | undefined
  }
}

export interface ComplianceFlag {
  rule: string
  message: string
  severity: "error" | "warning"
}

export interface Motion {
  id: string
  caseNumber: string
  caseType?: string
  motionType: string
  filerName: string
  status: "pending" | "pending_review" | "accepted" | "rejected"
  dateFiled?: string
  dateField?: string // For backward compatibility
  reason?: string
  complianceFlags?: ComplianceFlag[]
  extractedData?: ExtractedData
}

