import * as React from "react"

import { cn } from "@/lib/utils"

function FormMessage({ className, children, ...props }: React.ComponentProps<"p">) {
  if (!children) {
    return null
  }

  return (
    <p
      data-slot="form-message"
      role="alert"
      className={cn("text-xs leading-4 text-danger-foreground", className)}
      {...props}
    >
      {children}
    </p>
  )
}

export { FormMessage }
