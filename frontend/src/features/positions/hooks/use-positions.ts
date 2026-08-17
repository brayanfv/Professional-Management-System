"use client"

import { useQuery } from "@tanstack/react-query"

import { positionKeys } from "@/features/positions/query-keys"
import { getPositionOptions } from "@/lib/api/positions"

export function usePositions() {
  return useQuery({
    queryKey: positionKeys.options(),
    queryFn: getPositionOptions,
  })
}
