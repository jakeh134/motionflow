"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Stepper, StepperContent, StepperTrigger } from "@/components/ui/stepper"
import { useToast } from "@/hooks/use-toast"
import { UploadIcon as FileUpload, Upload, X, CheckCircle, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react"
import type { User, Motion } from "@/lib/types"
import { cn } from "@/lib/utils"
import { DocumentReview } from "@/components/upload/document-review"
import { mockMotions } from "@/lib/mock-data"

export default function UploadPage() {
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [processedDocuments, setProcessedDocuments] = useState<Motion[]>([])
  const [currentDocIndex, setCurrentDocIndex] = useState(0)
  const [reviewComplete, setReviewComplete] = useState(false)

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("motionflow-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      router.push("/login")
    }
  }, [router])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      handleFiles(selectedFiles)
    }
  }

  const handleFiles = (newFiles: File[]) => {
    // Filter for PDFs and images
    const validFiles = newFiles.filter((file) => {
      const isValid =
        file.type === "application/pdf" ||
        file.type.startsWith("image/jpeg") ||
        file.type.startsWith("image/jpg") ||
        file.type.startsWith("image/png")

      if (!isValid) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a PDF or JPG file`,
          variant: "destructive",
        })
      }

      return isValid
    })

    setFiles((prevFiles) => [...prevFiles, ...validFiles])
  }

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  }

  const handleUpload = () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one file to upload",
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    setProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 5
      })
    }, 200)

    // Simulate upload completion
    setTimeout(() => {
      clearInterval(interval)
      setProgress(100)
      setUploading(false)
      setUploadComplete(true)

      toast({
        title: "Upload complete",
        description: `Successfully uploaded ${files.length} file${files.length !== 1 ? "s" : ""}`,
      })

      // Simulate AI processing by grabbing some mock motions
      const sampleMotions = mockMotions.slice(0, files.length).map((motion) => ({
        ...motion,
        id: `new-${Math.random().toString(36).substring(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }))

      setProcessedDocuments(sampleMotions)

      // Move to the next step after a delay
      setTimeout(() => {
        setCurrentStep(1)
      }, 1000)
    }, 4000)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleNextDocument = () => {
    if (currentDocIndex < processedDocuments.length - 1) {
      setCurrentDocIndex(currentDocIndex + 1)
    } else {
      // All documents reviewed
      setReviewComplete(true)
      toast({
        title: "Review complete",
        description: "All documents have been reviewed",
      })
    }
  }

  const handlePrevDocument = () => {
    if (currentDocIndex > 0) {
      setCurrentDocIndex(currentDocIndex - 1)
    }
  }

  const handleDocumentUpdate = (updatedDoc: Motion) => {
    setProcessedDocuments((prev) => prev.map((doc) => (doc.id === updatedDoc.id ? updatedDoc : doc)))
  }

  const handleFinishReview = () => {
    toast({
      title: "Processing complete",
      description: "Documents have been added to the dashboard",
    })

    // Redirect to dashboard after a delay
    setTimeout(() => {
      router.push("/dashboard")
    }, 1500)
  }

  const resetUpload = () => {
    setFiles([])
    setUploading(false)
    setProgress(0)
    setUploadComplete(false)
    setCurrentStep(0)
    setProcessedDocuments([])
    setCurrentDocIndex(0)
    setReviewComplete(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Upload Motions</h1>
        {currentStep > 0 && (
          <Button variant="outline" onClick={resetUpload}>
            Start New Upload
          </Button>
        )}
      </div>

      <Stepper value={currentStep.toString()} className="w-full">
        <StepperTrigger value="0" disabled={uploading}>
          Upload Files
        </StepperTrigger>
        <StepperTrigger value="1" disabled={!uploadComplete}>
          Review Extracted Data
        </StepperTrigger>
        <StepperContent value="0">
          <Card>
            <CardContent className="p-6">
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors",
                  isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
                  uploading && "pointer-events-none opacity-60",
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileInput}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                  className="hidden"
                  onChange={handleFileInputChange}
                  disabled={uploading}
                />

                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="rounded-full bg-primary/10 p-4">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Drag & drop files here</h3>
                    <p className="text-sm text-muted-foreground mt-1">or click to browse your files</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Supports PDF and JPG files up to 10MB</p>
                </div>
              </div>

              {files.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Selected Files ({files.length})</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted/50 rounded-md p-2">
                        <div className="flex items-center space-x-2 overflow-hidden">
                          <FileUpload className="h-4 w-4 flex-shrink-0" />
                          <span className="text-sm truncate">{file.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeFile(index)
                          }}
                          disabled={uploading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(uploading || uploadComplete) && (
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Upload Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  {uploadComplete && (
                    <div className="flex items-center space-x-2 text-sm text-green-600 mt-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Upload complete! Preparing documents for review...</span>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <Button onClick={handleUpload} disabled={files.length === 0 || uploading || uploadComplete}>
                  {uploading ? "Uploading..." : "Upload Files"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </StepperContent>

        <StepperContent value="1">
          <Card>
            <CardContent className="p-6">
              {processedDocuments.length > 0 ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">
                      Document Review ({currentDocIndex + 1} of {processedDocuments.length})
                    </h2>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-muted-foreground">
                        {processedDocuments.filter((doc) => doc.status !== "pending").length} of{" "}
                        {processedDocuments.length} reviewed
                      </span>
                    </div>
                  </div>

                  {reviewComplete ? (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                      <div className="rounded-full bg-green-100 p-4">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold">Review Complete!</h3>
                      <p className="text-center text-muted-foreground max-w-md">
                        All {processedDocuments.length} documents have been reviewed and are ready to be processed.
                      </p>
                      <Button onClick={handleFinishReview} className="mt-4">
                        Finish and Go to Dashboard
                      </Button>
                    </div>
                  ) : (
                    <>
                      <DocumentReview document={processedDocuments[currentDocIndex]} onUpdate={handleDocumentUpdate} />

                      <div className="flex justify-between mt-6">
                        <Button variant="outline" onClick={handlePrevDocument} disabled={currentDocIndex === 0}>
                          <ChevronLeft className="h-4 w-4 mr-2" />
                          Previous Document
                        </Button>
                        <Button onClick={handleNextDocument}>
                          {currentDocIndex === processedDocuments.length - 1 ? (
                            "Complete Review"
                          ) : (
                            <>
                              Next Document
                              <ChevronRight className="h-4 w-4 ml-2" />
                            </>
                          )}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center space-y-4">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                    <p>Processing documents...</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </StepperContent>
      </Stepper>
    </div>
  )
}
