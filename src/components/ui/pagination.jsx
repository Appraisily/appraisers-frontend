import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const Pagination = ({
  className,
  ...props
}) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
)

const PaginationContent = ({
  className,
  ...props
}) => (
  <ul
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
)

const PaginationItem = ({
  className,
  ...props
}) => (
  <li
    className={cn("", className)}
    {...props}
  />
)

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}) => (
  <Button
    aria-current={isActive ? "page" : undefined}
    variant={isActive ? "outline" : "ghost"}
    size={size}
    className={cn(
      "h-9 w-9 rounded-md",
      {
        "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground": isActive,
      },
      className
    )}
    {...props}
  />
)

const PaginationPrevious = ({
  className,
  ...props
}) => (
  <Button
    aria-label="Go to previous page"
    size="icon"
    variant="ghost"
    className={cn("h-9 w-9 rounded-md", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
  </Button>
)

const PaginationNext = ({
  className,
  ...props
}) => (
  <Button
    aria-label="Go to next page"
    size="icon"
    variant="ghost"
    className={cn("h-9 w-9 rounded-md", className)}
    {...props}
  >
    <ChevronRight className="h-4 w-4" />
  </Button>
)

const PaginationEllipsis = ({
  className,
  ...props
}) => (
  <div
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </div>
)

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}