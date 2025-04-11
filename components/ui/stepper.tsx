"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const StepperContext = React.createContext<{
  value: string
  onChange: (value: string) => void
}>({
  value: "",
  onChange: () => {},
})

const Stepper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value: string
    onValueChange?: (value: string) => void
    defaultValue?: string
  }
>(({ className, value, onValueChange, defaultValue, ...props }, ref) => {
  const [selectedValue, setSelectedValue] = React.useState(value || defaultValue || "")

  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value)
    }
  }, [value])

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      setSelectedValue(newValue)
      onValueChange?.(newValue)
    },
    [onValueChange],
  )

  return (
    <StepperContext.Provider
      value={{
        value: selectedValue,
        onChange: handleValueChange,
      }}
    >
      <div ref={ref} className={cn("flex flex-col space-y-4", className)} {...props} />
    </StepperContext.Provider>
  )
})
Stepper.displayName = "Stepper"

const StepperTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    value: string
    disabled?: boolean
  }
>(({ className, value, disabled, ...props }, ref) => {
  const { value: selectedValue, onChange } = React.useContext(StepperContext)
  const isActive = selectedValue === value
  const isCompleted = Number.parseInt(selectedValue) > Number.parseInt(value)

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "group flex h-10 items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive && "border-primary bg-primary/10 text-primary",
        isCompleted && "border-primary bg-primary text-primary-foreground",
        className,
      )}
      onClick={() => onChange(value)}
      disabled={disabled}
      {...props}
    />
  )
})
StepperTrigger.displayName = "StepperTrigger"

const StepperStep = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value: string
    title: string
    description?: string
  }
>(({ className, value, title, description, ...props }, ref) => {
  const { value: selectedValue } = React.useContext(StepperContext)
  const isActive = selectedValue === value
  const isCompleted = Number.parseInt(selectedValue) > Number.parseInt(value)

  return (
    <div
      ref={ref}
      className={cn("flex items-center gap-2", isActive && "text-primary", isCompleted && "text-primary", className)}
      {...props}
    >
      <div
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full border border-input text-sm font-medium",
          isActive && "border-primary bg-primary/10 text-primary",
          isCompleted && "border-primary bg-primary text-primary-foreground",
        )}
      >
        {isCompleted ? <CheckIcon className="h-4 w-4" /> : Number.parseInt(value) + 1}
      </div>
      <div>
        <div className="text-sm font-medium">{title}</div>
        {description && <div className="text-xs text-muted-foreground">{description}</div>}
      </div>
    </div>
  )
})
StepperStep.displayName = "StepperStep"

const StepperContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value: string
  }
>(({ className, value, ...props }, ref) => {
  const { value: selectedValue } = React.useContext(StepperContext)
  const isActive = selectedValue === value

  if (!isActive) return null

  return <div ref={ref} className={cn("mt-4", className)} {...props} />
})
StepperContent.displayName = "StepperContent"

export { Stepper, StepperContent, StepperStep, StepperTrigger }
