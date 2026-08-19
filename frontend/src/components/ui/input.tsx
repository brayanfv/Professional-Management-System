import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-md border border-border bg-surface px-3 py-2 text-base text-foreground outline-none transition-[color,background-color,border-color,box-shadow] duration-150 ease-out file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-placeholder hover:border-border-strong focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-surface-secondary disabled:text-muted-foreground disabled:opacity-70 aria-invalid:border-danger aria-invalid:ring-2 aria-invalid:ring-danger/20 sm:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
