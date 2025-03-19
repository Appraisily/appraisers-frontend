import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-subtle hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-subtle hover:bg-destructive/90",
        outline:
          "bg-transparent text-foreground border border-border shadow-subtle hover:bg-secondary/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-subtle border border-border/50 hover:bg-secondary/80",
        ghost: 
          "hover:bg-secondary/50",
        link: 
          "text-primary underline-offset-4 hover:underline",
        gold:
          "bg-gold text-black shadow-subtle hover:bg-gold/90",
      },
      size: {
        default: "h-10 px-4 py-2.5",
        sm: "h-9 rounded-md px-3 py-2 text-xs",
        lg: "h-12 rounded-md px-8 py-3 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }