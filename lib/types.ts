// User Types
export interface User {
  id: string
  email: string
  fullName: string
  role: "clerk" | "admin"
  courtId: string
  courtName: string
  countyId: string
  countyName: string
  isActive: boolean
}

// Motion Types
export interface Motion {
  id: string
  countyId: string
  courtId: string
  batchId?: string
  uploadedByUserId: string
  caseNumber: string
  caseTypeId: number
  caseType: string
  motionTypeId: number
  motionType: string
  filerName: string
  reason?: string
  status: "pending" | "accepted" | "rejected" | "fix_requested" | "needs_manual_review" | "ai_error" | "non_eviction"
  complianceFlags: ComplianceFlag[]
  extractedData: Record<string, any>
  aiConfidence: Record<string, number>
  summary?: string
  documentStoragePath: string
  createdAt: string
  updatedAt: string
}

export interface ComplianceFlag {
  rule: string
  pass: boolean
  message?: string
}

// Batch Upload Types
export interface BatchUpload {
  id: string
  uploadedByUserId: string
  uploadTimestamp: string
  status: "pending" | "processing" | "partial_complete" | "complete" | "failed"
  totalFiles: number
  processedFiles: number
  failedFiles: number
}

// County and Court Types
export interface County {
  id: string
  name: string
}

export interface Court {
  id: string
  name: string
  countyId: string
}

// Case and Motion Type Definitions
export interface CaseType {
  id: number
  name: string
}

export interface MotionType {
  id: number
  name: string
  caseTypeId: number
}
