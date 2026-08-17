"use client"

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type PaginationItem = number | "ellipsis-start" | "ellipsis-end"

function getPaginationItems(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index)
  }

  const pages = new Set([0, totalPages - 1, currentPage])
  if (currentPage > 0) pages.add(currentPage - 1)
  if (currentPage < totalPages - 1) pages.add(currentPage + 1)

  const sortedPages = [...pages].sort((left, right) => left - right)
  const items: PaginationItem[] = []

  sortedPages.forEach((page, index) => {
    const previousPage = sortedPages[index - 1]
    if (previousPage !== undefined && page - previousPage > 1) {
      items.push(index === 1 ? "ellipsis-start" : "ellipsis-end")
    }
    items.push(page)
  })

  return items
}

type PaginationProps = {
  page: number
  size: number
  totalElements: number
  totalPages: number
  disabled?: boolean
  idPrefix?: string
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

export function Pagination({
  page,
  size,
  totalElements,
  totalPages,
  disabled = false,
  idPrefix = "pagination",
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  if (totalElements === 0) {
    return null
  }

  const start = page * size + 1
  const end = Math.min((page + 1) * size, totalElements)
  const items = getPaginationItems(page, totalPages)

  return (
    <div className="flex flex-col gap-4 border-t border-border px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Showing {start.toLocaleString("en-US")}–{end.toLocaleString("en-US")} of{" "}
        {totalElements.toLocaleString("en-US")}
      </p>

      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor={`${idPrefix}-page-size`} className="sr-only">
            Results per page
          </label>
          <Select
            value={String(size)}
            onValueChange={(value) => {
              if (value) onPageSizeChange(Number(value))
            }}
            disabled={disabled}
          >
            <SelectTrigger id={`${idPrefix}-page-size`} size="sm" className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start">
              {[10, 20, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={String(pageSize)}>
                  {pageSize} per page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <nav aria-label="Pagination" className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            disabled={disabled || page === 0}
            onClick={() => onPageChange(page - 1)}
            aria-label="Previous page"
          >
            <ChevronLeftIcon aria-hidden="true" />
          </Button>

          {items.map((item) =>
            typeof item === "number" ? (
              <Button
                key={item}
                variant={item === page ? "default" : "ghost"}
                size="icon"
                className="size-8"
                disabled={disabled}
                onClick={() => onPageChange(item)}
                aria-label={`Page ${item + 1}`}
                aria-current={item === page ? "page" : undefined}
              >
                {item + 1}
              </Button>
            ) : (
              <span
                key={item}
                className="flex size-8 items-center justify-center text-muted-foreground"
                aria-hidden="true"
              >
                …
              </span>
            ),
          )}

          <Button
            variant="outline"
            size="icon"
            className="size-8"
            disabled={disabled || page >= totalPages - 1}
            onClick={() => onPageChange(page + 1)}
            aria-label="Next page"
          >
            <ChevronRightIcon aria-hidden="true" />
          </Button>
        </nav>
      </div>
    </div>
  )
}
