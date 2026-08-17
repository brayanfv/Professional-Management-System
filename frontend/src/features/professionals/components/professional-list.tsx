"use client"

import { CircleAlertIcon, UserPlusIcon, UsersIcon } from "lucide-react"
import Link from "next/link"

import { Pagination } from "@/components/common/pagination"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ProfessionalListSkeleton } from "@/features/professionals/components/professional-list-skeleton"
import { ProfessionalMobileCards } from "@/features/professionals/components/professional-mobile-cards"
import { ProfessionalsTable } from "@/features/professionals/components/professionals-table"
import { getProfessionalsListHref } from "@/features/professionals/professional-list-params"
import { getProfessionalCreateHref } from "@/features/professionals/professional-navigation"
import { cn } from "@/lib/utils"
import type { PageResponse } from "@/types/pagination"
import type {
  ProfessionalListParams,
  ProfessionalSortField,
  ProfessionalSummary,
} from "@/types/professional"

type ProfessionalListProps = {
  data: PageResponse<ProfessionalSummary> | undefined
  params: ProfessionalListParams
  isPending: boolean
  isError: boolean
  isUpdating: boolean
  hasFilters: boolean
  onRetry: () => void
  onClearFilters: () => void
  onSort: (field: ProfessionalSortField) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

export function ProfessionalList({
  data,
  params,
  isPending,
  isError,
  isUpdating,
  hasFilters,
  onRetry,
  onClearFilters,
  onSort,
  onPageChange,
  onPageSizeChange,
}: ProfessionalListProps) {
  const returnHref = getProfessionalsListHref(params)

  if (isPending) {
    return <ProfessionalListSkeleton rows={Math.min(params.size, 10)} />
  }

  if (isError) {
    return (
      <Card>
        <CardContent
          className="flex min-h-72 flex-col items-center justify-center gap-3 px-6 text-center"
          role="alert"
        >
          <CircleAlertIcon
            className="size-6 text-danger"
            aria-hidden="true"
          />
          <div className="space-y-1">
            <p className="font-semibold text-foreground">
              Unable to load professionals
            </p>
            <p className="text-sm text-muted-foreground">
              Something went wrong while loading this data.
            </p>
          </div>
          <Button variant="outline" onClick={onRetry}>
            Try again
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (data?.totalElements === 0) {
    return (
      <Card>
        <CardContent className="flex min-h-72 flex-col items-center justify-center gap-4 px-6 text-center">
          <span className="flex size-11 items-center justify-center rounded-md bg-primary-soft text-primary">
            {hasFilters ? (
              <UsersIcon className="size-5" aria-hidden="true" />
            ) : (
              <UserPlusIcon className="size-5" aria-hidden="true" />
            )}
          </span>
          <div className="space-y-1">
            <p className="font-semibold text-foreground">
              {hasFilters ? "No professionals found" : "No professionals yet"}
            </p>
            <p className="max-w-md text-sm text-muted-foreground">
              {hasFilters
                ? "Try adjusting your search or filters."
                : "Add your first professional to start building your organization directory."}
            </p>
          </div>
          {hasFilters ? (
            <Button variant="outline" onClick={onClearFilters}>
              Clear filters
            </Button>
          ) : (
            <Link
              href={getProfessionalCreateHref(returnHref)}
              className={buttonVariants()}
            >
              Add professional
            </Link>
          )}
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return null
  }

  return (
    <Card
      className="gap-0 py-0"
      aria-busy={isUpdating}
      aria-label="Professionals list"
    >
      {isUpdating ? (
        <div
          className="border-b border-border bg-primary-soft px-4 py-2 text-xs font-medium text-primary sm:px-6"
          role="status"
        >
          Updating results...
        </div>
      ) : null}
      <CardContent
        className={cn(
          "p-0 transition-opacity duration-150",
          isUpdating && "opacity-60",
        )}
      >
        <ProfessionalsTable
          professionals={data.content}
          sort={params.sort}
          onSort={onSort}
          returnHref={returnHref}
        />
        <ProfessionalMobileCards
          professionals={data.content}
          returnHref={returnHref}
        />
        <Pagination
          page={data.page}
          size={data.size}
          totalElements={data.totalElements}
          totalPages={data.totalPages}
          disabled={isUpdating}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </CardContent>
    </Card>
  )
}
