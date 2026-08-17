"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { dashboardKeys } from "@/features/dashboard/query-keys"
import { departmentKeys } from "@/features/departments/query-keys"
import { professionalKeys } from "@/features/professionals/query-keys"
import {
  createDepartment,
  deleteDepartment,
  updateDepartment,
} from "@/lib/api/departments"
import type { DepartmentRequest } from "@/types/department"

async function invalidateDepartmentConsumers(
  queryClient: ReturnType<typeof useQueryClient>,
  professionalReferencesChanged: boolean,
) {
  const invalidations = [
    queryClient.invalidateQueries({ queryKey: departmentKeys.all }),
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

export function useCreateDepartment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: DepartmentRequest) => createDepartment(payload),
    onSuccess: () => invalidateDepartmentConsumers(queryClient, false),
  })
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: DepartmentRequest }) =>
      updateDepartment(id, payload),
    onSuccess: () => invalidateDepartmentConsumers(queryClient, true),
  })
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteDepartment(id),
    onSuccess: () => invalidateDepartmentConsumers(queryClient, false),
  })
}
