import type { PositionQueryParams } from "@/types/position"

export const positionKeys = {
  all: ["positions"] as const,
  lists: () => [...positionKeys.all, "list"] as const,
  list: (params: PositionQueryParams) =>
    [...positionKeys.lists(), params] as const,
  details: () => [...positionKeys.all, "detail"] as const,
  detail: (id: number) => [...positionKeys.details(), id] as const,
  options: () => [...positionKeys.all, "options"] as const,
}
