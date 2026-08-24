import { apiClient, type ApiReadOptions } from "@/lib/api/client"
import type {
  DashboardSummary,
  DepartmentProfessionalCount,
  PositionProfessionalCount,
  RecentProfessional,
} from "@/types/dashboard"

const dashboardPath = "/api/dashboard"

export function getDashboardSummary(options?: ApiReadOptions) {
  return apiClient.get<DashboardSummary>(`${dashboardPath}/summary`, options)
}

export function getProfessionalsByDepartment(options?: ApiReadOptions) {
  return apiClient.get<DepartmentProfessionalCount[]>(
    `${dashboardPath}/professionals-by-department`,
    options,
  )
}

export function getProfessionalsByPosition(options?: ApiReadOptions) {
  return apiClient.get<PositionProfessionalCount[]>(
    `${dashboardPath}/professionals-by-position`,
    options,
  )
}

export function getRecentProfessionals(limit: number, options?: ApiReadOptions) {
  return apiClient.get<RecentProfessional[]>(
    `${dashboardPath}/recent-professionals?limit=${limit}`,
    options,
  )
}
