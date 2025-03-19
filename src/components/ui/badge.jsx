import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary/10 text-primary border border-primary/20",
        secondary:
          "bg-secondary text-secondary-foreground border border-secondary/50",
        destructive:
          "bg-destructive/10 text-destructive border border-destructive/20",
        outline:
          "text-foreground border border-border",
        success:
          "bg-green-100 text-green-800 border border-green-200",
        warning:
          "bg-gold-muted text-amber-800 border border-amber-200",
        info:
          "bg-blue-100 text-blue-800 border border-blue-200",
        gold:
          "bg-gold/10 text-gold border border-gold/20",
        navy:
          "bg-navy-muted text-navy border border-navy/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }