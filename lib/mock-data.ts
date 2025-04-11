import type { User, Motion, BatchUpload, County, Court, CaseType, MotionType } from "./types"

// Mock Counties
export const mockCounties: County[] = [
  {
    id: "c1",
    name: "Travis County",
  },
  {
    id: "c2",
    name: "Williamson County",
  },
]

// Mock Courts
export const mockCourts: Court[] = [
  {
    id: "travis_county_court",
    name: "Travis County Court",
    countyId: "c1",
  },
  {
    id: "williamson_county_court",
    name: "Williamson County Court",
    countyId: "c2",
  },
]

// Mock Users
export const mockUsers: User[] = [
  {
    id: "u1",
    email: "travis_clerk@example.com",
    fullName: "Alex Johnson",
    role: "clerk",
    courtId: "travis_county_court",
    courtName: "Travis County Court",
    countyId: "c1",
    countyName: "Travis County",
    isActive: true,
  },
  {
    id: "u2",
    email: "williamson_clerk@example.com",
    fullName: "Sam Rodriguez",
    role: "clerk",
    courtId: "williamson_county_court",
    courtName: "Williamson County Court",
    countyId: "c2",
    countyName: "Williamson County",
    isActive: true,
  },
]

// Mock Case Types
export const mockCaseTypes: CaseType[] = [
  {
    id: 1,
    name: "Eviction",
  },
  {
    id: 2,
    name: "Civil",
  },
]

// Mock Motion Types
export const mockMotionTypes: MotionType[] = [
  {
    id: 1,
    name: "Motion for Continuance",
    caseTypeId: 1,
  },
  {
    id: 2,
    name: "Motion to Dismiss",
    caseTypeId: 1,
  },
  {
    id: 3,
    name: "Motion for Default Judgment",
    caseTypeId: 1,
  },
  {
    id: 4,
    name: "Motion for Stay of Execution",
    caseTypeId: 1,
  },
  {
    id: 5,
    name: "Motion to Set Aside Judgment",
    caseTypeId: 1,
  },
]

// Mock Batch Uploads
export const mockBatches: BatchUpload[] = [
  {
    id: "b1",
    uploadedByUserId: "u1",
    uploadTimestamp: "2025-04-09T14:30:00Z",
    status: "complete",
    totalFiles: 5,
    processedFiles: 5,
    failedFiles: 0,
  },
  {
    id: "b2",
    uploadedByUserId: "u1",
    uploadTimestamp: "2025-04-08T10:15:00Z",
    status: "partial_complete",
    totalFiles: 3,
    processedFiles: 2,
    failedFiles: 1,
  },
  {
    id: "b3",
    uploadedByUserId: "u2",
    uploadTimestamp: "2025-04-09T09:45:00Z",
    status: "processing",
    totalFiles: 4,
    processedFiles: 2,
    failedFiles: 0,
  },
]

// Mock Motions
export const mockMotions: Motion[] = [
  // Travis County Motions
  {
    id: "m1",
    countyId: "c1",
    courtId: "travis_county_court",
    batchId: "b1",
    uploadedByUserId: "u1",
    caseNumber: "25-EV-1001",
    caseTypeId: 1,
    caseType: "Eviction",
    motionTypeId: 1,
    motionType: "Motion for Continuance",
    filerName: "John Doe",
    reason: "Medical appointment conflict",
    status: "pending",
    complianceFlags: [
      {
        rule: "Signature Presence",
        pass: true,
      },
      {
        rule: "Required Fields",
        pass: true,
      },
    ],
    extractedData: {
      caseNumber: "25-EV-1001",
      filerName: "John Doe",
      reason: "Medical appointment conflict",
      originalDate: "April 15, 2025",
      requestedDate: "After April 30, 2025",
    },
    aiConfidence: {
      caseNumber: 0.95,
      filerName: 0.92,
      reason: 0.88,
      originalDate: 0.9,
      requestedDate: 0.85,
    },
    summary:
      "Defendant John Doe files a Motion for Continuance for the hearing on April 15, 2025, citing the need for additional time to gather evidence and a conflicting medical appointment. This is their first continuance request, and the plaintiff does not oppose it. They request rescheduling after April 30, 2025.",
    documentStoragePath: "/documents/m1.pdf",
    createdAt: "2025-04-09T14:35:00Z",
    updatedAt: "2025-04-09T14:35:00Z",
  },
  {
    id: "m2",
    countyId: "c1",
    courtId: "travis_county_court",
    batchId: "b1",
    uploadedByUserId: "u1",
    caseNumber: "25-EV-1002",
    caseTypeId: 1,
    caseType: "Eviction",
    motionTypeId: 2,
    motionType: "Motion to Dismiss",
    filerName: "Jane Smith",
    reason: "Lease violation claim is invalid",
    status: "needs_manual_review",
    complianceFlags: [
      {
        rule: "Signature Presence",
        pass: true,
      },
      {
        rule: "Proof of Service",
        pass: false,
        message: "No proof of service attached or referenced in the document",
      },
    ],
    extractedData: {
      caseNumber: "25-EV-1002",
      filerName: "Jane Smith",
      reason: "Lease violation claim is invalid",
    },
    aiConfidence: {
      caseNumber: 0.96,
      filerName: 0.75,
      reason: 0.82,
    },
    documentStoragePath: "/documents/m2.pdf",
    createdAt: "2025-04-09T14:36:00Z",
    updatedAt: "2025-04-09T14:36:00Z",
  },
  {
    id: "m3",
    countyId: "c1",
    courtId: "travis_county_court",
    batchId: "b1",
    uploadedByUserId: "u1",
    caseNumber: "25-EV-1003",
    caseTypeId: 1,
    caseType: "Eviction",
    motionTypeId: 3,
    motionType: "Motion for Default Judgment",
    filerName: "Landlord Properties LLC",
    reason: "Tenant failed to appear at hearing",
    status: "accepted",
    complianceFlags: [
      {
        rule: "Signature Presence",
        pass: true,
      },
      {
        rule: "Required Fields",
        pass: true,
      },
      {
        rule: "Proof of Service",
        pass: true,
      },
    ],
    extractedData: {
      caseNumber: "25-EV-1003",
      filerName: "Landlord Properties LLC",
      reason: "Tenant failed to appear at hearing",
      hearingDate: "April 2, 2025",
    },
    aiConfidence: {
      caseNumber: 0.98,
      filerName: 0.94,
      reason: 0.91,
      hearingDate: 0.89,
    },
    documentStoragePath: "/documents/m3.pdf",
    createdAt: "2025-04-09T14:37:00Z",
    updatedAt: "2025-04-09T15:10:00Z",
  },
  {
    id: "m4",
    countyId: "c1",
    courtId: "travis_county_court",
    batchId: "b2",
    uploadedByUserId: "u1",
    caseNumber: "25-EV-1004",
    caseTypeId: 1,
    caseType: "Eviction",
    motionTypeId: 4,
    motionType: "Motion for Stay of Execution",
    filerName: "Robert Johnson",
    reason: "Seeking time to find new housing",
    status: "rejected",
    complianceFlags: [
      {
        rule: "Filing Fee",
        pass: false,
        message: "No indication of filing fee payment",
      },
      {
        rule: "Required Fields",
        pass: false,
        message: "Missing required information about judgment date",
      },
    ],
    extractedData: {
      caseNumber: "25-EV-1004",
      filerName: "Robert Johnson",
      reason: "Seeking time to find new housing",
    },
    aiConfidence: {
      caseNumber: 0.92,
      filerName: 0.88,
      reason: 0.85,
    },
    documentStoragePath: "/documents/m4.pdf",
    createdAt: "2025-04-08T10:20:00Z",
    updatedAt: "2025-04-08T11:05:00Z",
  },
  {
    id: "m5",
    countyId: "c1",
    courtId: "travis_county_court",
    batchId: "b2",
    uploadedByUserId: "u1",
    caseNumber: "25-EV-1005",
    caseTypeId: 1,
    caseType: "Eviction",
    motionTypeId: 5,
    motionType: "Motion to Set Aside Judgment",
    filerName: "Maria Garcia",
    reason: "Did not receive notice of hearing",
    status: "fix_requested",
    complianceFlags: [
      {
        rule: "Signature Presence",
        pass: true,
      },
      {
        rule: "Supporting Evidence",
        pass: false,
        message: "No supporting evidence for claim of lack of notice",
      },
    ],
    extractedData: {
      caseNumber: "25-EV-1005",
      filerName: "Maria Garcia",
      reason: "Did not receive notice of hearing",
      judgmentDate: "March 25, 2025",
    },
    aiConfidence: {
      caseNumber: 0.94,
      filerName: 0.91,
      reason: 0.87,
      judgmentDate: 0.82,
    },
    documentStoragePath: "/documents/m5.pdf",
    createdAt: "2025-04-08T10:22:00Z",
    updatedAt: "2025-04-08T14:15:00Z",
  },

  // Williamson County Motions
  {
    id: "m6",
    countyId: "c2",
    courtId: "williamson_county_court",
    batchId: "b3",
    uploadedByUserId: "u2",
    caseNumber: "25-EV-2001",
    caseTypeId: 1,
    caseType: "Eviction",
    motionTypeId: 1,
    motionType: "Motion for Continuance",
    filerName: "Thomas Wilson",
    reason: "Attorney scheduling conflict",
    status: "pending",
    complianceFlags: [
      {
        rule: "Signature Presence",
        pass: true,
      },
      {
        rule: "Required Fields",
        pass: true,
      },
    ],
    extractedData: {
      caseNumber: "25-EV-2001",
      filerName: "Thomas Wilson",
      reason: "Attorney scheduling conflict",
      originalDate: "April 20, 2025",
      requestedDate: "After May 5, 2025",
    },
    aiConfidence: {
      caseNumber: 0.97,
      filerName: 0.93,
      reason: 0.9,
      originalDate: 0.88,
      requestedDate: 0.86,
    },
    documentStoragePath: "/documents/m6.pdf",
    createdAt: "2025-04-09T09:50:00Z",
    updatedAt: "2025-04-09T09:50:00Z",
  },
  {
    id: "m7",
    countyId: "c2",
    courtId: "williamson_county_court",
    batchId: "b3",
    uploadedByUserId: "u2",
    caseNumber: "25-EV-2002",
    caseTypeId: 1,
    caseType: "Eviction",
    motionTypeId: 2,
    motionType: "Motion to Dismiss",
    filerName: "Sarah Brown",
    reason: "Improper service of eviction notice",
    status: "ai_error",
    complianceFlags: [],
    extractedData: {
      caseNumber: "25-EV-2002",
      filerName: "Sarah Brown",
    },
    aiConfidence: {
      caseNumber: 0.65,
      filerName: 0.6,
    },
    documentStoragePath: "/documents/m7.pdf",
    createdAt: "2025-04-09T09:52:00Z",
    updatedAt: "2025-04-09T09:52:00Z",
  },
]
