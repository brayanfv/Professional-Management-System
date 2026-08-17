"use client"

import { EyeIcon, EyeOffIcon } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function PasswordInput(props: React.ComponentProps<"input">) {
  const [visible, setVisible] = useState(false)
  const label = visible ? "Hide password" : "Show password"
  const Icon = visible ? EyeOffIcon : EyeIcon

  return (
    <div className="relative">
      <Input {...props} type={visible ? "text" : "password"} className="pr-11" />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={label}
        aria-pressed={visible}
        onClick={() => setVisible((current) => !current)}
        className="absolute top-1/2 right-1 size-8 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        <Icon />
      </Button>
    </div>
  )
}
