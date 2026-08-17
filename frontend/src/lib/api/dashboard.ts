import { apiClient } from "@/lib/api/client"
import type {
  DashboardSummary,
  DepartmentProfessionalCount,
  PositionProfessionalCount,
  RecentProfessional,
} from "@/types/dashboard"

const dashboardPath = "/api/dashboard"

export function getDashboardSummary() {
  return apiClient.get<DashboardSummary>(`${dashboardPath}/summary`)
}

export function getProfessionalsByDepartment() {
  return apiClient.get<DepartmentProfessionalCount[]>(
    `${dashboardPath}/professionals-by-department`,
  )
}

export function getProfessionalsByPosition() {
  return apiClient.get<PositionProfessionalCount[]>(
    `${dashboardPath}/professionals-by-position`,
  )
}

export function getRecentProfessionals(limit: number) {
  return apiClient.get<RecentProfessional[]>(
    `${dashboardPath}/recent-professionals?limit=${limit}`,
  )
}
