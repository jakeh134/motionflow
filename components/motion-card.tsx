import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye } from "lucide-react"
import Link from "next/link"
import type { Motion } from "@/lib/types"

interface MotionCardProps {
  motion: Motion
  isSelected: boolean
  onSelect: (id: string) => void
}

export function MotionCard({ motion, isSelected, onSelect }: MotionCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="warning" className="font-normal">
            Pending
          </Badge>
        )
      case "pending_review":
        return (
          <Badge variant="secondary" className="font-normal">
            Needs Review
          </Badge>
        )
      case "accepted":
        return (
          <Badge variant="success" className="font-normal">
            Accepted
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="danger" className="font-normal">
            Rejected
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="font-normal">
            {status}
          </Badge>
        )
    }
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-0">
        <div className="border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onSelect(motion.id)}
              aria-label={`Select motion ${motion.caseNumber}`}
            />
            <div>
              <div className="font-medium">{motion.caseNumber}</div>
              <div className="text-xs text-muted-foreground">{motion.caseType}</div>
            </div>
          </div>
          {getStatusBadge(motion.status)}
        </div>

        <div className="p-4 space-y-3">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Motion Type</div>
            <div>{motion.motionType}</div>
          </div>

          <div>
            <div className="text-sm font-medium text-muted-foreground">Filer</div>
            <div>{motion.filerName}</div>
          </div>

          <div>
            <div className="text-sm font-medium text-muted-foreground">Date Filed</div>
            <div>{new Date(motion.dateField || motion.dateFiled).toLocaleDateString()}</div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t p-4 flex justify-end">
        <Link href={`/motions/${motion.id}`}>
          <Button size="sm">
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

