"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, Upload, CheckCircle, AlertCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileUpload() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [caseNumber, setCaseNumber] = useState("")
  const [uploadState, setUploadState] = useState<"idle" | "preview" | "uploading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onload = () => {
        setCapturedImage(reader.result as string)
        setUploadState("preview")
      }

      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async () => {
    if (!capturedImage) return

    setUploadState("uploading")

    try {
      // Simulate upload
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setUploadState("success")
    } catch (error) {
      setErrorMessage("Failed to upload image. Please try again.")
      setUploadState("error")
    }
  }

  const handleReset = () => {
    setCapturedImage(null)
    setCaseNumber("")
    setUploadState("idle")
    setErrorMessage("")
  }

  const renderCapture = () => {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-full bg-primary/10 p-4">
            <Camera className="h-8 w-8 text-primary" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold">Capture Motion Document</h2>
            <p className="text-sm text-muted-foreground mt-1">Take a clear photo of the entire document</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="caseNumber" className="text-sm font-medium">
              Case Number (Optional)
            </label>
            <Input
              id="caseNumber"
              placeholder="e.g., 23-456"
              value={caseNumber}
              onChange={(e) => setCaseNumber(e.target.value)}
            />
          </div>

          <Button className="w-full gap-2" size="lg" onClick={handleCapture}>
            <Camera className="h-5 w-5" />
            Take Photo
          </Button>

          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>
      </div>
    )
  }

  const renderPreview = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Review Image</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={handleReset}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="relative">
          <img src={capturedImage || ""} alt="Captured document" className="w-full rounded-md border" />
          {caseNumber && (
            <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
              Case #{caseNumber}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={handleReset}>
            Retake
          </Button>
          <Button className="flex-1 gap-2" onClick={handleUpload}>
            <Upload className="h-4 w-4" />
            Upload
          </Button>
        </div>
      </div>
    )
  }

  const renderUploading = () => {
    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <div className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
        <div className="text-center">
          <h2 className="text-xl font-semibold">Uploading Document</h2>
          <p className="text-sm text-muted-foreground mt-1">Please wait while we upload your document...</p>
        </div>
      </div>
    )
  }

  const renderSuccess = () => {
    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <div className="rounded-full bg-green-100 p-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold">Upload Successful</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Your document has been uploaded and will be processed shortly.
          </p>
        </div>
        <Button onClick={handleReset}>Upload Another Document</Button>
      </div>
    )
  }

  const renderError = () => {
    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <div className="rounded-full bg-red-100 p-4">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold">Upload Failed</h2>
          <p className="text-sm text-muted-foreground mt-1">{errorMessage}</p>
        </div>
        <Button onClick={handleReset}>Try Again</Button>
      </div>
    )
  }

  return (
    <Card className="shadow-sm">
      <CardContent className={cn("p-6", uploadState === "idle" || uploadState === "preview" ? "" : "p-0")}>
        {uploadState === "idle" && renderCapture()}
        {uploadState === "preview" && renderPreview()}
        {uploadState === "uploading" && renderUploading()}
        {uploadState === "success" && renderSuccess()}
        {uploadState === "error" && renderError()}
      </CardContent>
    </Card>
  )
}

