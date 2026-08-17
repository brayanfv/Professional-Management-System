"use client"

import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"
import { CheckIcon, ChevronsUpDownIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export type ComboboxOption = {
  value: string
  label: string
}

type ComboboxProps = {
  id?: string
  options: ComboboxOption[]
  value: string | null
  onValueChange: (value: string | null) => void
  placeholder: string
  searchPlaceholder?: string
  emptyMessage?: string
  disabled?: boolean
  loading?: boolean
  invalid?: boolean
  describedBy?: string
  clearLabel?: string
}

export function Combobox({
  id,
  options,
  value,
  onValueChange,
  placeholder,
  searchPlaceholder = "Search...",
  emptyMessage = "No options found.",
  disabled = false,
  loading = false,
  invalid = false,
  describedBy,
  clearLabel = "Clear selection",
}: ComboboxProps) {
  const selectedOption =
    options.find((option) => option.value === value) ?? null
  const isDisabled = disabled || loading

  return (
    <ComboboxPrimitive.Root
      items={options}
      value={selectedOption}
      onValueChange={(option) => onValueChange(option?.value ?? null)}
      isItemEqualToValue={(option, selected) =>
        option.value === selected.value
      }
      itemToStringLabel={(option) => option.label}
      itemToStringValue={(option) => option.value}
      disabled={isDisabled}
    >
      <ComboboxPrimitive.InputGroup
        className={cn(
          "relative flex h-10 w-full items-center rounded-md border border-border bg-surface text-sm transition-[color,background-color,border-color,box-shadow] duration-150 ease-out hover:border-border-strong focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
          invalid && "border-danger ring-2 ring-danger/20",
          isDisabled &&
            "cursor-not-allowed bg-surface-secondary text-muted-foreground opacity-70",
        )}
      >
        <ComboboxPrimitive.Input
          id={id}
          className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-foreground outline-none placeholder:text-placeholder disabled:cursor-not-allowed"
          placeholder={loading ? `Loading ${placeholder.toLowerCase()}...` : searchPlaceholder}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          disabled={isDisabled}
        />
        <div className="flex h-full shrink-0 items-center pr-1">
          {selectedOption && !isDisabled ? (
            <ComboboxPrimitive.Clear
              className="flex size-8 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-surface-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/25"
              aria-label={clearLabel}
            >
              <XIcon className="size-4" aria-hidden="true" />
            </ComboboxPrimitive.Clear>
          ) : null}
          <ComboboxPrimitive.Trigger
            className="flex size-8 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-surface-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/25 disabled:pointer-events-none"
            aria-label={placeholder}
          >
            <ChevronsUpDownIcon className="size-4" aria-hidden="true" />
          </ComboboxPrimitive.Trigger>
        </div>
      </ComboboxPrimitive.InputGroup>

      <ComboboxPrimitive.Portal>
        <ComboboxPrimitive.Positioner
          side="bottom"
          sideOffset={4}
          align="start"
          className="z-50 outline-none"
        >
          <ComboboxPrimitive.Popup className="w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-dropdown outline-none transition-[transform,opacity] duration-150 ease-out data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
            <ComboboxPrimitive.Empty className="px-3 py-6 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </ComboboxPrimitive.Empty>
            <ComboboxPrimitive.List className="max-h-[min(18rem,var(--available-height))] scroll-py-1 overflow-y-auto overscroll-contain p-1.5 outline-none data-empty:p-0">
              {(option: ComboboxOption) => (
                <ComboboxPrimitive.Item
                  key={option.value}
                  value={option}
                  className="grid min-h-9 cursor-default grid-cols-[1rem_1fr] items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none select-none data-highlighted:bg-surface-secondary data-highlighted:text-foreground"
                >
                  <ComboboxPrimitive.ItemIndicator className="col-start-1 text-primary">
                    <CheckIcon className="size-4" aria-hidden="true" />
                  </ComboboxPrimitive.ItemIndicator>
                  <span className="col-start-2 truncate">{option.label}</span>
                </ComboboxPrimitive.Item>
              )}
            </ComboboxPrimitive.List>
          </ComboboxPrimitive.Popup>
        </ComboboxPrimitive.Positioner>
      </ComboboxPrimitive.Portal>
    </ComboboxPrimitive.Root>
  )
}
