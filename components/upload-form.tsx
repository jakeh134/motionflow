"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, CheckCircle, AlertCircle, FileUp } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ExtractedData } from "@/lib/types"
import { DataReviewForm } from "@/components/data-review-form"
import { LoadingSpinner } from "@/components/loading-spinner"

export function UploadForm() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "processing" | "success" | "error">("idle")
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null)
  const [errorMessage, setErrorMessage] = useState("")

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    // Check if file is PDF or image
    if (!file.type.match("application/pdf|image/jpeg|image/png")) {
      setErrorMessage("Please upload a PDF or image file (JPG, PNG)")
      setUploadState("error")
      return
    }

    setFile(file)
    uploadFile(file)
  }

  const uploadFile = async (file: File) => {
    setUploadState("uploading")
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return 95
        }
        return prev + 5
      })
    }, 100)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      clearInterval(interval)
      setUploadProgress(100)

      setUploadState("processing")

      // Simulate AI processing
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Mock extracted data
      const mockData: ExtractedData = {
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
      }

      setExtractedData(mockData)
      setUploadState("success")
    } catch (error) {
      clearInterval(interval)
      setErrorMessage("An error occurred while processing your document. Please try again.")
      setUploadState("error")
    }
  }

  const handleSubmitToQueue = () => {
    // Show loading state
    setUploadState("processing")

    // Simulate submitting to queue
    setTimeout(() => {
      router.push("/motions")
    }, 1000)
  }

  const renderUploadArea = () => {
    return (
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all",
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-upload")?.click()}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-full bg-primary/10 p-4">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <div>
            <p className="text-lg font-medium">Drag and drop your document here</p>
            <p className="text-sm text-muted-foreground mt-1">or click to browse (PDF, JPG, PNG)</p>
          </div>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
          />

          <Button variant="outline" className="mt-2 gap-2">
            <FileUp className="h-4 w-4" />
            Select File
          </Button>
        </div>
      </div>
    )
  }

  const renderUploadProgress = () => {
    return (
      <div className="flex flex-col items-center gap-6 p-12">
        <div className="rounded-full bg-primary/10 p-4">
          <FileText className="h-8 w-8 text-primary" />
        </div>
        <div className="text-center">
          <p className="text-lg font-medium">
            {uploadState === "uploading" ? "Uploading document..." : "Processing document..."}
          </p>
          <p className="text-sm text-muted-foreground mt-1">{file?.name}</p>
        </div>
        <div className="w-full max-w-md">
          <Progress
            value={uploadProgress}
            className="h-2"
            indicatorColor={uploadState === "processing" ? "bg-amber-500" : undefined}
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-muted-foreground">
              {uploadState === "uploading"
                ? `Uploading: ${Math.round(uploadProgress)}%`
                : "Analyzing document with AI..."}
            </p>
            {uploadState === "processing" && <LoadingSpinner size="sm" color="border-amber-500" />}
          </div>
        </div>

        {uploadState === "processing" && (
          <div className="text-center text-sm text-muted-foreground mt-4 max-w-md">
            <p>
              Our AI is analyzing your document to extract key information and check for compliance issues. This may
              take a few moments.
            </p>
          </div>
        )}
      </div>
    )
  }

  const renderError = () => {
    return (
      <div className="flex flex-col items-center gap-6 p-12">
        <div className="rounded-full bg-red-100 p-4">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <div className="text-center">
          <p className="text-lg font-medium text-red-600">Upload Failed</p>
          <p className="text-sm text-muted-foreground mt-1">{errorMessage}</p>
        </div>
        <Button onClick={() => setUploadState("idle")}>Try Again</Button>
      </div>
    )
  }

  const renderSuccess = () => {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-green-100 p-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-lg font-medium">Document Processed Successfully</p>
            <p className="text-sm text-muted-foreground">Please review the extracted information below</p>
          </div>
        </div>

        {extractedData && <DataReviewForm data={extractedData} onSubmit={handleSubmitToQueue} />}
      </div>
    )
  }

  return (
    <Card className="shadow-sm overflow-hidden">
      <CardContent className="p-0">
        {uploadState === "idle" && renderUploadArea()}
        {(uploadState === "uploading" || uploadState === "processing") && renderUploadProgress()}
        {uploadState === "error" && renderError()}
        {uploadState === "success" && renderSuccess()}
      </CardContent>
    </Card>
  )
}

