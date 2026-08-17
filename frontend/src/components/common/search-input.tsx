"use client"

import { SearchIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SearchInput({
  id,
  label,
  placeholder,
  value,
  onChange,
  disabled = false,
}: {
  id: string
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}) {
  return (
    <div className="relative w-full max-w-md">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <SearchIcon
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        id={id}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="pr-10 pl-9"
        disabled={disabled}
      />
      {value ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute top-1/2 right-1 size-8 -translate-y-1/2"
          onClick={() => onChange("")}
          aria-label={`Clear ${label.toLowerCase()}`}
          disabled={disabled}
        >
          <XIcon aria-hidden="true" />
        </Button>
      ) : null}
    </div>
  )
}
