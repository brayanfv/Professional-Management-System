"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { positionKeys } from "@/features/positions/query-keys"
import { getPositions } from "@/lib/api/positions"
import type { PositionQueryParams } from "@/types/position"

export function usePositionList(params: PositionQueryParams) {
  return useQuery({
    queryKey: positionKeys.list(params),
    queryFn: () => getPositions(params),
    placeholderData: keepPreviousData,
  })
}
