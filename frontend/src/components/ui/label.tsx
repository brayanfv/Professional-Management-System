"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type LabelProps = React.ComponentProps<"label"> & {
  disabled?: boolean
  optional?: boolean
  required?: boolean
}

function Label({
  className,
  children,
  disabled = false,
  optional = false,
  required = false,
  ...props
}: LabelProps) {
  return (
    <label
      data-slot="label"
      data-disabled={disabled || undefined}
      data-required={required || undefined}
      aria-disabled={disabled || undefined}
      className={cn(
        "flex items-center gap-2 text-sm leading-5 font-medium text-text-secondary select-none data-disabled:cursor-not-allowed data-disabled:text-muted-foreground group-data-[disabled=true]/field:cursor-not-allowed group-data-[disabled=true]/field:text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:text-muted-foreground",
        className
      )}
      {...props}
    >
      <span>{children}</span>
      {optional && (
        <span className="text-xs font-normal text-muted-foreground">
          Optional
        </span>
      )}
      {required && <span className="sr-only"> (required)</span>}
    </label>
  )
}

export { Label, type LabelProps }
