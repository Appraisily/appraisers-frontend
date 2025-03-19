import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-subtle",
        "placeholder:text-muted-foreground/70",
        "focus:ring-2 focus:ring-primary/20 focus:border-primary focus-visible:outline-none", 
        "transition-all duration-200",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }