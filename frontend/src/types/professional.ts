import type { Contact } from "@/types/contact"

export type ProfessionalStatus = "ACTIVE" | "INACTIVE"

export type ProfessionalSortField = "name" | "status" | "createdAt"
export type SortDirection = "asc" | "desc"
export type ProfessionalSort = `${ProfessionalSortField},${SortDirection}`

export type ProfessionalReference = {
  id: number
  name: string
}

export type ProfessionalSummary = {
  id: number
  name: string
  birthDate: string | null
  status: ProfessionalStatus
  department: ProfessionalReference | null
  position: ProfessionalReference | null
  createdAt: string
  updatedAt: string
}

export type ProfessionalDetails = ProfessionalSummary & {
  contacts: Contact[]
}

export type UpdateProfessionalStatusRequest = {
  status: ProfessionalStatus
}

export type ProfessionalWriteRequest = {
  name: string
  birthDate: string | null
  departmentId: number | null
  positionId: number | null
}

export type CreateProfessionalRequest = ProfessionalWriteRequest
export type UpdateProfessionalRequest = ProfessionalWriteRequest

export type ProfessionalsQueryParams = {
  page: number
  size: number
  search?: string
  status?: ProfessionalStatus
  departmentId?: number
  positionId?: number
  sort?: ProfessionalSort
}

export type ProfessionalListParams = ProfessionalsQueryParams & {
  sort: ProfessionalSort
}
