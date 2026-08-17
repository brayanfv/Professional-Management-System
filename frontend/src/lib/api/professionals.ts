import { apiClient } from "@/lib/api/client"
import type { PageResponse } from "@/types/pagination"
import type {
  ProfessionalDetails,
  ProfessionalSummary,
  ProfessionalsQueryParams,
  CreateProfessionalRequest,
  UpdateProfessionalRequest,
  UpdateProfessionalStatusRequest,
} from "@/types/professional"

export function getProfessionals(params: ProfessionalsQueryParams) {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    size: String(params.size),
    sort: params.sort ?? "name,asc",
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

  return apiClient.get<PageResponse<ProfessionalSummary>>(
    `/api/professionals?${searchParams.toString()}`,
  )
}

export function getProfessionalById(id: number) {
  return apiClient.get<ProfessionalDetails>(`/api/professionals/${id}`)
}

export function createProfessional(payload: CreateProfessionalRequest) {
  return apiClient.post<ProfessionalSummary>("/api/professionals", payload)
}

export function updateProfessional(
  id: number,
  payload: UpdateProfessionalRequest,
) {
  return apiClient.put<ProfessionalSummary>(
    `/api/professionals/${id}`,
    payload,
  )
}

export function updateProfessionalStatus(
  id: number,
  payload: UpdateProfessionalStatusRequest,
) {
  return apiClient.patch<ProfessionalSummary>(
    `/api/professionals/${id}/status`,
    payload,
  )
}

export function deleteProfessional(id: number) {
  return apiClient.delete(`/api/professionals/${id}`)
}
