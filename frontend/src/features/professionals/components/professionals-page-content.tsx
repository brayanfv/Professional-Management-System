"use client"

import { PlusIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useTransition } from "react"

import { PageHeader } from "@/components/common/page-header"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useDepartments } from "@/features/departments/hooks/use-departments"
import { usePositions } from "@/features/positions/hooks/use-positions"
import { ProfessionalFilters } from "@/features/professionals/components/professional-filters"
import { ProfessionalList } from "@/features/professionals/components/professional-list"
import { useProfessionals } from "@/features/professionals/hooks/use-professionals"
import {
  getNextSort,
  getProfessionalsListHref,
  hasProfessionalFilters,
} from "@/features/professionals/professional-list-params"
import { getProfessionalCreateHref } from "@/features/professionals/professional-navigation"
import type {
  ProfessionalListParams,
  ProfessionalSortField,
} from "@/types/professional"

export function ProfessionalsPageContent({
  params,
}: {
  params: ProfessionalListParams
}) {
  const router = useRouter()
  const [isNavigating, startTransition] = useTransition()
  const latestParams = useRef(params)
  const professionalsQuery = useProfessionals(params)
  const departmentsQuery = useDepartments()
  const positionsQuery = usePositions()

  useEffect(() => {
    latestParams.current = params
  }, [params])

  const updateParams = useCallback(
    (
      updates: Partial<ProfessionalListParams>,
      mode: "push" | "replace" = "push",
    ) => {
      const nextParams = { ...latestParams.current, ...updates }
      latestParams.current = nextParams
      const href = getProfessionalsListHref(nextParams)

      startTransition(() => {
        if (mode === "replace") {
          router.replace(href, { scroll: false })
        } else {
          router.push(href, { scroll: false })
        }
      })
    },
    [router],
  )

  const clearFilters = useCallback(() => {
    updateParams({
      page: 0,
      search: undefined,
      status: undefined,
      departmentId: undefined,
      positionId: undefined,
    })
  }, [updateParams])

  useEffect(() => {
    const data = professionalsQuery.data
    if (!data) return

    const lastAvailablePage = Math.max(data.totalPages - 1, 0)
    const pageIsOutOfRange =
      (data.totalPages === 0 && params.page > 0) ||
      (data.totalPages > 0 && params.page > lastAvailablePage)

    if (pageIsOutOfRange) {
      updateParams({ page: lastAvailablePage }, "replace")
    }
  }, [params.page, professionalsQuery.data, updateParams])

  function handleSort(field: ProfessionalSortField) {
    updateParams({ page: 0, sort: getNextSort(params.sort, field) })
  }

  const isUpdating = isNavigating || professionalsQuery.isPlaceholderData

  return (
    <section className="space-y-6">
      <PageHeader
        title="Professionals"
        description="Manage people in your organization."
        actions={
          <Link
            href={getProfessionalCreateHref(getProfessionalsListHref(params))}
            className={buttonVariants()}
          >
            <PlusIcon aria-hidden="true" />
            Add professional
          </Link>
        }
      />

      <Card
        className="gap-0 py-0 shadow-none"
        aria-busy={professionalsQuery.isPending || isUpdating}
        aria-label="Professionals directory"
      >
        <CardContent className="p-0">
          <div className="border-b border-border bg-surface-secondary/30 px-4 py-4 sm:px-5">
            <ProfessionalFilters
              key={params.search ?? ""}
              params={params}
              departments={departmentsQuery.data ?? []}
              positions={positionsQuery.data ?? []}
              departmentsLoading={departmentsQuery.isPending}
              positionsLoading={positionsQuery.isPending}
              departmentsError={departmentsQuery.isError}
              positionsError={positionsQuery.isError}
              onParamsChange={updateParams}
              onClearFilters={clearFilters}
            />
          </div>

          <ProfessionalList
            data={professionalsQuery.data}
            params={params}
            isPending={professionalsQuery.isPending}
            isError={professionalsQuery.isError}
            isUpdating={isUpdating}
            hasFilters={hasProfessionalFilters(params)}
            onRetry={() => void professionalsQuery.refetch()}
            onClearFilters={clearFilters}
            onSort={handleSort}
            onPageChange={(page) => updateParams({ page })}
            onPageSizeChange={(size) => updateParams({ page: 0, size })}
          />
        </CardContent>
      </Card>
    </section>
  )
}
