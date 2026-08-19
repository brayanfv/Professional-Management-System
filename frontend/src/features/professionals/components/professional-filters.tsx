"use client"

import { FilterIcon, SearchIcon, XIcon } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import type { Department } from "@/types/department"
import type { Position } from "@/types/position"
import type {
  ProfessionalListParams,
  ProfessionalSort,
  ProfessionalStatus,
} from "@/types/professional"

type HistoryMode = "push" | "replace"

export type ProfessionalParamsChange = (
  updates: Partial<ProfessionalListParams>,
  mode?: HistoryMode,
) => void

type ProfessionalFiltersProps = {
  params: ProfessionalListParams
  departments: Department[]
  positions: Position[]
  departmentsLoading: boolean
  positionsLoading: boolean
  departmentsError: boolean
  positionsError: boolean
  onParamsChange: ProfessionalParamsChange
  onClearFilters: () => void
}

const allValue = "ALL"

const mobileSortOptions: Array<{ value: ProfessionalSort; label: string }> = [
  { value: "name,asc", label: "Name A–Z" },
  { value: "name,desc", label: "Name Z–A" },
  { value: "createdAt,desc", label: "Newest" },
  { value: "createdAt,asc", label: "Oldest" },
  { value: "status,asc", label: "Status" },
]

function SearchField({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="relative min-w-0 flex-1 lg:min-w-64">
      <label htmlFor="professional-search" className="sr-only">
        Search professionals
      </label>
      <SearchIcon
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        id="professional-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search professionals..."
        autoComplete="off"
        className="pl-9"
      />
    </div>
  )
}

export function ProfessionalFilters({
  params,
  departments,
  positions,
  departmentsLoading,
  positionsLoading,
  departmentsError,
  positionsError,
  onParamsChange,
  onClearFilters,
}: ProfessionalFiltersProps) {
  const [searchValue, setSearchValue] = useState(params.search ?? "")
  const [mobileOpen, setMobileOpen] = useState(false)
  const [draftStatus, setDraftStatus] = useState<ProfessionalStatus | "ALL">(
    params.status ?? allValue,
  )
  const [draftDepartment, setDraftDepartment] = useState(
    params.departmentId ? String(params.departmentId) : allValue,
  )
  const [draftPosition, setDraftPosition] = useState(
    params.positionId ? String(params.positionId) : allValue,
  )
  const [draftSort, setDraftSort] = useState<ProfessionalSort>(params.sort)

  useEffect(() => {
    const normalizedSearch = searchValue.trim()
    if (normalizedSearch === (params.search ?? "")) {
      return
    }

    const timeout = window.setTimeout(() => {
      onParamsChange(
        { search: normalizedSearch || undefined, page: 0 },
        "replace",
      )
    }, 300)

    return () => window.clearTimeout(timeout)
  }, [onParamsChange, params.search, searchValue])

  const activeFilterCount = [
    params.status,
    params.departmentId,
    params.positionId,
  ].filter(Boolean).length
  const hasFilters = Boolean(params.search || activeFilterCount)

  function syncMobileDrafts() {
    setDraftStatus(params.status ?? allValue)
    setDraftDepartment(
      params.departmentId ? String(params.departmentId) : allValue,
    )
    setDraftPosition(params.positionId ? String(params.positionId) : allValue)
    setDraftSort(params.sort)
  }

  function handleMobileOpenChange(open: boolean) {
    if (open) syncMobileDrafts()
    setMobileOpen(open)
  }

  function applyMobileFilters() {
    onParamsChange({
      page: 0,
      status: draftStatus === allValue ? undefined : draftStatus,
      departmentId:
        draftDepartment === allValue ? undefined : Number(draftDepartment),
      positionId: draftPosition === allValue ? undefined : Number(draftPosition),
      sort: draftSort,
    })
    setMobileOpen(false)
  }

  function clearMobileDrafts() {
    setDraftStatus(allValue)
    setDraftDepartment(allValue)
    setDraftPosition(allValue)
  }

  return (
    <div className="space-y-3">
      <div className="hidden flex-wrap items-center gap-3 lg:flex">
        <SearchField value={searchValue} onChange={setSearchValue} />

        <div className="w-44 shrink-0">
          <label htmlFor="professional-status-filter" className="sr-only">
            Filter by status
          </label>
          <Select
            value={params.status ?? allValue}
            onValueChange={(value) =>
              onParamsChange({
                status:
                  value && value !== allValue
                    ? (value as ProfessionalStatus)
                    : undefined,
                page: 0,
              })
            }
          >
            <SelectTrigger id="professional-status-filter">
              <span className="shrink-0 text-xs font-medium text-muted-foreground">
                Status
              </span>
              <SelectValue className="min-w-0 truncate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={allValue}>All statuses</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-52 shrink-0">
          <label htmlFor="professional-department-filter" className="sr-only">
            Filter by department
          </label>
          <Select
            value={
              params.departmentId ? String(params.departmentId) : allValue
            }
            onValueChange={(value) =>
              onParamsChange({
                departmentId:
                  value && value !== allValue ? Number(value) : undefined,
                page: 0,
              })
            }
            disabled={departmentsLoading || departmentsError}
          >
            <SelectTrigger id="professional-department-filter">
              <span className="shrink-0 text-xs font-medium text-muted-foreground">
                Department
              </span>
              <SelectValue
                className="min-w-0 truncate"
                placeholder={
                  departmentsLoading
                    ? "Loading departments..."
                    : departmentsError
                      ? "Departments unavailable"
                      : "All departments"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={allValue}>All departments</SelectItem>
              {departments.map((department) => (
                <SelectItem key={department.id} value={String(department.id)}>
                  {department.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-52 shrink-0">
          <label htmlFor="professional-position-filter" className="sr-only">
            Filter by position
          </label>
          <Select
            value={params.positionId ? String(params.positionId) : allValue}
            onValueChange={(value) =>
              onParamsChange({
                positionId:
                  value && value !== allValue ? Number(value) : undefined,
                page: 0,
              })
            }
            disabled={positionsLoading || positionsError}
          >
            <SelectTrigger id="professional-position-filter">
              <span className="shrink-0 text-xs font-medium text-muted-foreground">
                Position
              </span>
              <SelectValue
                className="min-w-0 truncate"
                placeholder={
                  positionsLoading
                    ? "Loading positions..."
                    : positionsError
                      ? "Positions unavailable"
                      : "All positions"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={allValue}>All positions</SelectItem>
              {positions.map((position) => (
                <SelectItem key={position.id} value={String(position.id)}>
                  {position.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasFilters ? (
          <Button
            variant="ghost"
            className="shrink-0"
            onClick={onClearFilters}
          >
            <XIcon aria-hidden="true" />
            Clear filters
          </Button>
        ) : null}
      </div>

      <div className="flex items-center gap-3 lg:hidden">
        <SearchField value={searchValue} onChange={setSearchValue} />
        <Sheet open={mobileOpen} onOpenChange={handleMobileOpenChange}>
          <SheetTrigger render={<Button variant="outline" className="shrink-0" />}>
            <FilterIcon aria-hidden="true" />
            Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Filter professionals</SheetTitle>
              <SheetDescription>
                Refine the directory results and sorting.
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 space-y-5 overflow-y-auto p-6">
              <div className="space-y-2">
                <Label htmlFor="mobile-status-filter">Status</Label>
                <Select
                  value={draftStatus}
                  onValueChange={(value) =>
                    setDraftStatus(
                      value === "ACTIVE" || value === "INACTIVE"
                        ? value
                        : allValue,
                    )
                  }
                >
                  <SelectTrigger id="mobile-status-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={allValue}>All statuses</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile-department-filter">Department</Label>
                <Select
                  value={draftDepartment}
                  onValueChange={(value) =>
                    setDraftDepartment(value ?? allValue)
                  }
                  disabled={departmentsLoading || departmentsError}
                >
                  <SelectTrigger id="mobile-department-filter">
                    <SelectValue
                      placeholder={
                        departmentsLoading
                          ? "Loading departments..."
                          : departmentsError
                            ? "Departments unavailable"
                            : "All departments"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={allValue}>All departments</SelectItem>
                    {departments.map((department) => (
                      <SelectItem
                        key={department.id}
                        value={String(department.id)}
                      >
                        {department.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile-position-filter">Position</Label>
                <Select
                  value={draftPosition}
                  onValueChange={(value) =>
                    setDraftPosition(value ?? allValue)
                  }
                  disabled={positionsLoading || positionsError}
                >
                  <SelectTrigger id="mobile-position-filter">
                    <SelectValue
                      placeholder={
                        positionsLoading
                          ? "Loading positions..."
                          : positionsError
                            ? "Positions unavailable"
                            : "All positions"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={allValue}>All positions</SelectItem>
                    {positions.map((position) => (
                      <SelectItem key={position.id} value={String(position.id)}>
                        {position.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile-sort-filter">Sort by</Label>
                <Select
                  value={draftSort}
                  onValueChange={(value) => {
                    if (value) setDraftSort(value as ProfessionalSort)
                  }}
                >
                  <SelectTrigger id="mobile-sort-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mobileSortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <SheetFooter>
              <Button variant="outline" onClick={clearMobileDrafts}>
                Clear
              </Button>
              <Button onClick={applyMobileFilters}>Apply filters</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
