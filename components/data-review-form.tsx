"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import type { ExtractedData } from "@/lib/types"
import { cn } from "@/lib/utils"
import { AlertCircle } from "lucide-react"

interface DataReviewFormProps {
  data: ExtractedData
  onSubmit: () => void
}

export function DataReviewForm({ data, onSubmit }: DataReviewFormProps) {
  const [formData, setFormData] = useState<ExtractedData>(data)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const getConfidenceClass = (confidence: number) => {
    if (confidence >= 0.9) return "confidence-high"
    if (confidence >= 0.7) return "confidence-medium"
    return "confidence-low"
  }

  const renderConfidenceBadge = (field: keyof ExtractedData["confidence"]) => {
    const confidence = data.confidence[field]
    if (!confidence) return null

    const confidenceClass = getConfidenceClass(confidence)
    const confidencePercent = Math.round(confidence * 100)

    return (
      <span className={cn("text-xs px-2 py-0.5 rounded-full border", confidenceClass)}>
        {confidencePercent}% confidence
      </span>
    )
  }

  const isLowConfidence = (field: keyof ExtractedData["confidence"]) => {
    const confidence = data.confidence[field]
    return confidence !== undefined && confidence < 0.8
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-5">
            <div className="form-group">
              <div className="flex items-center justify-between mb-1.5">
                <Label htmlFor="caseNumber" className="text-sm font-medium">
                  Case Number
                </Label>
                {renderConfidenceBadge("caseNumber")}
              </div>
              <Input
                id="caseNumber"
                name="caseNumber"
                value={formData.caseNumber}
                onChange={handleChange}
                error={isLowConfidence("caseNumber")}
                className={cn(isLowConfidence("caseNumber") && "border-amber-300 bg-amber-50")}
              />
              {isLowConfidence("caseNumber") && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                  <p className="text-xs text-amber-700">Please verify this case number</p>
                </div>
              )}
            </div>

            <div className="form-group">
              <div className="flex items-center justify-between mb-1.5">
                <Label htmlFor="motionType" className="text-sm font-medium">
                  Motion Type
                </Label>
                {renderConfidenceBadge("motionType")}
              </div>
              <Input
                id="motionType"
                name="motionType"
                value={formData.motionType}
                onChange={handleChange}
                error={isLowConfidence("motionType")}
                className={cn(isLowConfidence("motionType") && "border-amber-300 bg-amber-50")}
              />
              {isLowConfidence("motionType") && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                  <p className="text-xs text-amber-700">Please verify this motion type</p>
                </div>
              )}
            </div>

            <div className="form-group">
              <div className="flex items-center justify-between mb-1.5">
                <Label htmlFor="filerName" className="text-sm font-medium">
                  Filer Name
                </Label>
                {renderConfidenceBadge("filerName")}
              </div>
              <Input
                id="filerName"
                name="filerName"
                value={formData.filerName}
                onChange={handleChange}
                error={isLowConfidence("filerName")}
                className={cn(isLowConfidence("filerName") && "border-amber-300 bg-amber-50")}
              />
              {isLowConfidence("filerName") && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                  <p className="text-xs text-amber-700">Please verify this filer name</p>
                </div>
              )}
            </div>

            <div className="form-group">
              <div className="flex items-center justify-between mb-1.5">
                <Label htmlFor="reason" className="text-sm font-medium">
                  Reason
                </Label>
                {renderConfidenceBadge("reason")}
              </div>
              <Textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows={3}
                className={cn(isLowConfidence("reason") && "border-amber-300 bg-amber-50")}
              />
              {isLowConfidence("reason") && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                  <p className="text-xs text-amber-700">Please verify this reason</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-6 border-t flex justify-end gap-3">
          <Button variant="outline">Save Draft</Button>
          <Button onClick={onSubmit}>Submit to Queue</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

