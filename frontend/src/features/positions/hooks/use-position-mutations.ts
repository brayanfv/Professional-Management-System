"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { dashboardKeys } from "@/features/dashboard/query-keys"
import { positionKeys } from "@/features/positions/query-keys"
import { professionalKeys } from "@/features/professionals/query-keys"
import {
  createPosition,
  deletePosition,
  updatePosition,
} from "@/lib/api/positions"
import type { PositionRequest } from "@/types/position"

async function invalidatePositionConsumers(
  queryClient: ReturnType<typeof useQueryClient>,
  professionalReferencesChanged: boolean,
) {
  const invalidations = [
    queryClient.invalidateQueries({ queryKey: positionKeys.all }),
    queryClient.invalidateQueries({ queryKey: dashboardKeys.all }),
  ]

  if (professionalReferencesChanged) {
    invalidations.push(
      queryClient.invalidateQueries({ queryKey: professionalKeys.lists() }),
      queryClient.invalidateQueries({ queryKey: professionalKeys.details() }),
    )
  }

  await Promise.all(invalidations)
}

export function useCreatePosition() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: PositionRequest) => createPosition(payload),
    onSuccess: () => invalidatePositionConsumers(queryClient, false),
  })
}

export function useUpdatePosition() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PositionRequest }) =>
      updatePosition(id, payload),
    onSuccess: () => invalidatePositionConsumers(queryClient, true),
  })
}

export function useDeletePosition() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deletePosition(id),
    onSuccess: () => invalidatePositionConsumers(queryClient, false),
  })
}
