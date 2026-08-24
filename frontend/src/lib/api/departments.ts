import { apiClient, type ApiReadOptions } from "@/lib/api/client"
import { getAllPaginatedOptions } from "@/lib/api/paginated-options"
import type {
  Department,
  DepartmentQueryParams,
  DepartmentRequest,
} from "@/types/department"
import type { PageResponse } from "@/types/pagination"

function listPath(params: DepartmentQueryParams) {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    size: String(params.size),
    sort: params.sort,
  })
  if (params.search) searchParams.set("search", params.search)
  return `/api/departments?${searchParams.toString()}`
}

export function getDepartments(
  params: DepartmentQueryParams,
  options?: ApiReadOptions,
) {
  return apiClient.get<PageResponse<Department>>(listPath(params), options)
}

export function getDepartmentOptions(options?: ApiReadOptions) {
  return getAllPaginatedOptions<Department>("/api/departments", options)
}

export function getDepartmentById(id: number, options?: ApiReadOptions) {
  return apiClient.get<Department>(`/api/departments/${id}`, options)
}

export function createDepartment(payload: DepartmentRequest) {
  return apiClient.post<Department>("/api/departments", payload)
}

export function updateDepartment(id: number, payload: DepartmentRequest) {
  return apiClient.put<Department>(`/api/departments/${id}`, payload)
}

export function deleteDepartment(id: number) {
  return apiClient.delete(`/api/departments/${id}`)
}
