import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
  color?: string
}

export function LoadingSpinner({ size = "md", className, color = "border-primary" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-3",
  }

  return (
    <div
      className={cn(
        "inline-block animate-spin rounded-full border-solid border-current border-t-transparent",
        sizeClasses[size],
        color,
        className,
      )}
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

