"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode, Smartphone } from "lucide-react"
import Image from "next/image"

export function QrCodeDisplay() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Smartphone className="h-4 w-4" />
          Mobile Upload
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isExpanded ? (
          <div className="flex flex-col items-center gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <Image
                src="/placeholder.svg?height=200&width=200"
                alt="QR Code for mobile upload"
                width={200}
                height={200}
                className="mx-auto"
              />
            </div>
            <div className="text-center text-sm text-muted-foreground">
              <p>Scan this QR code with your mobile device to upload documents directly from your camera.</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsExpanded(false)} className="mt-2">
              Hide QR Code
            </Button>
          </div>
        ) : (
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => setIsExpanded(true)}
              className="group flex items-center gap-2 px-4 py-2 transition-all hover:bg-primary/5 hover:border-primary/30"
            >
              <div className="bg-primary/10 rounded-full p-1.5 transition-colors group-hover:bg-primary/20">
                <QrCode className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium">Show QR Code</span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

