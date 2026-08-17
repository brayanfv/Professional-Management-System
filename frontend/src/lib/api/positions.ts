import { apiClient } from "@/lib/api/client"
import { getAllPaginatedOptions } from "@/lib/api/paginated-options"
import type { PageResponse } from "@/types/pagination"
import type {
  Position,
  PositionQueryParams,
  PositionRequest,
} from "@/types/position"

function listPath(params: PositionQueryParams) {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    size: String(params.size),
    sort: params.sort,
  })
  if (params.search) searchParams.set("search", params.search)
  return `/api/positions?${searchParams.toString()}`
}

export function getPositions(params: PositionQueryParams) {
  return apiClient.get<PageResponse<Position>>(listPath(params))
}

export function getPositionOptions() {
  return getAllPaginatedOptions<Position>("/api/positions")
}

export function getPositionById(id: number) {
  return apiClient.get<Position>(`/api/positions/${id}`)
}

export function createPosition(payload: PositionRequest) {
  return apiClient.post<Position>("/api/positions", payload)
}

export function updatePosition(id: number, payload: PositionRequest) {
  return apiClient.put<Position>(`/api/positions/${id}`, payload)
}

export function deletePosition(id: number) {
  return apiClient.delete(`/api/positions/${id}`)
}
