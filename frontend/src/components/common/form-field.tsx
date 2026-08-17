import * as React from "react"

import { Label, type LabelProps } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type FormFieldProps = React.ComponentProps<"div"> & {
  disabled?: boolean
  invalid?: boolean
}

function FormField({
  className,
  disabled = false,
  invalid = false,
  ...props
}: FormFieldProps) {
  return (
    <div
      data-slot="form-field"
      data-disabled={disabled || undefined}
      data-invalid={invalid || undefined}
      className={cn("group/field grid gap-2", className)}
      {...props}
    />
  )
}

function FormLabel({ className, ...props }: LabelProps) {
  return <Label data-slot="form-label" className={className} {...props} />
}

export { FormField, FormLabel, type FormFieldProps }
