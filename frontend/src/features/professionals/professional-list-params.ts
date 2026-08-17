import { routes } from "@/lib/routes"
import type {
  ProfessionalListParams,
  ProfessionalSort,
  ProfessionalSortField,
  ProfessionalStatus,
  SortDirection,
} from "@/types/professional"

export const defaultProfessionalListParams: ProfessionalListParams = {
  page: 0,
  size: 10,
  sort: "name,asc",
}

const supportedPageSizes = new Set([10, 20, 50])
const supportedStatuses = new Set<ProfessionalStatus>(["ACTIVE", "INACTIVE"])
const supportedSortFields = new Set<ProfessionalSortField>([
  "name",
  "status",
  "createdAt",
])
const supportedSortDirections = new Set<SortDirection>(["asc", "desc"])

export type RawProfessionalSearchParams = Record<
  string,
  string | string[] | undefined
>

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function parseNonNegativeInteger(value: string | undefined, fallback: number) {
  if (!value || !/^\d+$/.test(value)) {
    return fallback
  }

  const parsed = Number(value)
  return Number.isSafeInteger(parsed) ? parsed : fallback
}

function parsePositiveId(value: string | undefined) {
  if (!value || !/^\d+$/.test(value)) {
    return undefined
  }

  const parsed = Number(value)
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : undefined
}

function parseSort(value: string | undefined): ProfessionalSort {
  if (!value) {
    return defaultProfessionalListParams.sort
  }

  const [field, direction, extra] = value.split(",")
  if (
    extra !== undefined ||
    !supportedSortFields.has(field as ProfessionalSortField) ||
    !supportedSortDirections.has(direction as SortDirection)
  ) {
    return defaultProfessionalListParams.sort
  }

  return `${field},${direction}` as ProfessionalSort
}

export function parseProfessionalListParams(
  rawParams: RawProfessionalSearchParams,
): ProfessionalListParams {
  const requestedSize = parseNonNegativeInteger(
    firstValue(rawParams.size),
    defaultProfessionalListParams.size,
  )
  const rawSearch = firstValue(rawParams.search)?.trim()
  const rawStatus = firstValue(rawParams.status)

  return {
    page: parseNonNegativeInteger(
      firstValue(rawParams.page),
      defaultProfessionalListParams.page,
    ),
    size: supportedPageSizes.has(requestedSize)
      ? requestedSize
      : defaultProfessionalListParams.size,
    search: rawSearch || undefined,
    status: supportedStatuses.has(rawStatus as ProfessionalStatus)
      ? (rawStatus as ProfessionalStatus)
      : undefined,
    departmentId: parsePositiveId(firstValue(rawParams.departmentId)),
    positionId: parsePositiveId(firstValue(rawParams.positionId)),
    sort: parseSort(firstValue(rawParams.sort)),
  }
}

export function getProfessionalsListHref(params: ProfessionalListParams) {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    size: String(params.size),
    sort: params.sort,
  })

  if (params.search) {
    searchParams.set("search", params.search)
  }
  if (params.status) {
    searchParams.set("status", params.status)
  }
  if (params.departmentId !== undefined) {
    searchParams.set("departmentId", String(params.departmentId))
  }
  if (params.positionId !== undefined) {
    searchParams.set("positionId", String(params.positionId))
  }

  return `${routes.professionals.list}?${searchParams.toString()}`
}

export function getSortParts(sort: ProfessionalSort) {
  const [field, direction] = sort.split(",") as [
    ProfessionalSortField,
    SortDirection,
  ]

  return { field, direction }
}

export function getNextSort(
  currentSort: ProfessionalSort,
  field: ProfessionalSortField,
): ProfessionalSort {
  const current = getSortParts(currentSort)
  const direction =
    current.field === field && current.direction === "asc" ? "desc" : "asc"

  return `${field},${direction}`
}

export function hasProfessionalFilters(params: ProfessionalListParams) {
  return Boolean(
    params.search ||
      params.status ||
      params.departmentId ||
      params.positionId,
  )
}
