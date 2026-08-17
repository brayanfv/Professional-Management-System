import type { ProfessionalStatus } from "@/types/professional"

export type DashboardSummary = {
  totalProfessionals: number
  activeProfessionals: number
  inactiveProfessionals: number
  totalDepartments: number
  totalPositions: number
}

export type DepartmentProfessionalCount = {
  departmentId: number
  departmentName: string
  count: number
}

export type PositionProfessionalCount = {
  positionId: number
  positionName: string
  count: number
}

export type IdName = {
  id: number
  name: string
}

export type RecentProfessional = {
  id: number
  name: string
  status: ProfessionalStatus
  department: IdName | null
  position: IdName | null
  createdAt: string
}
