"use client"

import { EyeIcon, EyeOffIcon } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function PasswordInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  const [visible, setVisible] = useState(false)
  const label = visible ? "Hide password" : "Show password"
  const Icon = visible ? EyeOffIcon : EyeIcon

  return (
    <div className="relative">
      <Input
        {...props}
        type={visible ? "text" : "password"}
        className={cn("pr-12 sm:pr-11", className)}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={label}
        aria-pressed={visible}
        onClick={() => setVisible((current) => !current)}
        className="absolute top-1/2 right-0 size-10 -translate-y-1/2 text-muted-foreground hover:text-foreground sm:right-1 sm:size-8"
      >
        <Icon />
      </Button>
    </div>
  )
}
