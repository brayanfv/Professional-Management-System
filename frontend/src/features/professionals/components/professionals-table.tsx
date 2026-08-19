"use client"

import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
} from "lucide-react"
import Link from "next/link"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ProfessionalActions } from "@/features/professionals/components/professional-actions"
import { ProfessionalStatusBadge } from "@/features/professionals/components/professional-status-badge"
import { getSortParts } from "@/features/professionals/professional-list-params"
import { getProfessionalDetailsHref } from "@/features/professionals/professional-navigation"
import { formatShortDate } from "@/lib/date"
import { getInitials } from "@/lib/name"
import { cn } from "@/lib/utils"
import type {
  ProfessionalSort,
  ProfessionalSortField,
  ProfessionalSummary,
} from "@/types/professional"

function SortableHeader({
  label,
  field,
  sort,
  onSort,
}: {
  label: string
  field: ProfessionalSortField
  sort: ProfessionalSort
  onSort: (field: ProfessionalSortField) => void
}) {
  const currentSort = getSortParts(sort)
  const active = currentSort.field === field
  const ariaSort = active
    ? currentSort.direction === "asc"
      ? "ascending"
      : "descending"
    : "none"
  const Icon = !active
    ? ArrowUpDownIcon
    : currentSort.direction === "asc"
      ? ArrowUpIcon
      : ArrowDownIcon

  return (
    <th scope="col" aria-sort={ariaSort} className="px-4 py-3 font-medium">
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "-ml-2 h-8 gap-1.5 rounded-md px-2 text-xs font-medium text-muted-foreground hover:text-foreground",
          active && "text-foreground",
        )}
        onClick={() => onSort(field)}
      >
        {label}
        <Icon aria-hidden="true" />
      </Button>
    </th>
  )
}

export function ProfessionalsTable({
  professionals,
  sort,
  onSort,
  returnHref,
}: {
  professionals: ProfessionalSummary[]
  sort: ProfessionalSort
  onSort: (field: ProfessionalSortField) => void
  returnHref: string
}) {
  return (
    <div className="hidden min-w-0 lg:block">
      <table className="w-full table-fixed border-collapse text-left text-sm">
        <caption className="sr-only">Professionals directory</caption>
        <colgroup>
          <col className="w-[32%]" />
          <col className="w-[17%]" />
          <col className="w-[20%]" />
          <col className="w-[12%]" />
          <col className="w-[12%]" />
          <col className="w-14" />
        </colgroup>
        <thead>
          <tr className="border-b border-border bg-surface-secondary/40 text-xs text-muted-foreground">
            <SortableHeader
              label="Professional"
              field="name"
              sort={sort}
              onSort={onSort}
            />
            <th scope="col" className="px-5 py-3 font-medium">
              Department
            </th>
            <th scope="col" className="px-5 py-3 font-medium">
              Position
            </th>
            <SortableHeader
              label="Status"
              field="status"
              sort={sort}
              onSort={onSort}
            />
            <SortableHeader
              label="Created"
              field="createdAt"
              sort={sort}
              onSort={onSort}
            />
            <th scope="col" className="w-14 px-3 py-3 font-medium">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {professionals.map((professional) => (
            <tr
              key={professional.id}
              className="border-b border-border transition-colors hover:bg-surface-secondary/60 last:border-0"
            >
              <td className="px-5 py-4">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar size="sm" className="data-[size=sm]:size-9">
                    <AvatarFallback>{getInitials(professional.name)}</AvatarFallback>
                  </Avatar>
                  <Link
                    href={getProfessionalDetailsHref(
                      professional.id,
                      returnHref,
                    )}
                    className="block truncate font-semibold text-foreground outline-none transition-colors hover:text-primary hover:underline focus-visible:rounded-xs focus-visible:ring-2 focus-visible:ring-primary/25"
                  >
                    {professional.name}
                  </Link>
                </div>
              </td>
              <td
                className={cn(
                  "truncate px-5 py-4 text-text-secondary",
                  !professional.department && "text-muted-foreground",
                )}
              >
                {professional.department?.name ?? "—"}
              </td>
              <td
                className={cn(
                  "truncate px-5 py-4 text-text-secondary",
                  !professional.position && "text-muted-foreground",
                )}
              >
                {professional.position?.name ?? "—"}
              </td>
              <td className="px-5 py-4">
                <ProfessionalStatusBadge status={professional.status} />
              </td>
              <td className="px-5 py-4 whitespace-nowrap text-xs text-muted-foreground">
                {formatShortDate(professional.createdAt)}
              </td>
              <td className="px-3 py-4 text-right">
                <ProfessionalActions
                  professionalId={professional.id}
                  returnHref={returnHref}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
