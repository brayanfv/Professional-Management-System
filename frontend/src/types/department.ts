import type {
  ManagementEntityQueryParams,
  ManagementEntityRequest,
} from "@/types/management"

export type Department = {
  id: number
  name: string
  description: string | null
  createdAt: string
  updatedAt: string
}

export type DepartmentRequest = ManagementEntityRequest
export type DepartmentQueryParams = ManagementEntityQueryParams
