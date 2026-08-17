import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-24 w-full resize-y rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none transition-[color,background-color,border-color,box-shadow] duration-150 ease-out placeholder:text-placeholder hover:border-border-strong focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:bg-surface-secondary disabled:text-muted-foreground disabled:opacity-70 aria-invalid:border-danger aria-invalid:ring-2 aria-invalid:ring-danger/20",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
