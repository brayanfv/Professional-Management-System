import type {
  ManagementEntityQueryParams,
  ManagementEntityRequest,
} from "@/types/management"

export type Position = {
  id: number
  name: string
  description: string | null
  createdAt: string
  updatedAt: string
}

export type PositionRequest = ManagementEntityRequest
export type PositionQueryParams = ManagementEntityQueryParams
