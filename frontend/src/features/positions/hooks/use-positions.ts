"use client"

import { useQuery } from "@tanstack/react-query"

import { positionKeys } from "@/features/positions/query-keys"
import { getPositionOptions } from "@/lib/api/positions"

const optionsStaleTime = 5 * 60_000

export function usePositions() {
  return useQuery({
    queryKey: positionKeys.options(),
    queryFn: ({ signal }) => getPositionOptions({ signal }),
    staleTime: optionsStaleTime,
  })
}
