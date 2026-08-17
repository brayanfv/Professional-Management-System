import * as React from "react"

import { cn } from "@/lib/utils"

function FormDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="form-description"
      className={cn("text-xs leading-4 text-muted-foreground", className)}
      {...props}
    />
  )
}

export { FormDescription }
