"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { dashboardKeys } from "@/features/dashboard/query-keys"
import { professionalKeys } from "@/features/professionals/query-keys"
import {
  createProfessional,
  deleteProfessional,
  updateProfessional,
  updateProfessionalStatus,
} from "@/lib/api/professionals"
import type {
  CreateProfessionalRequest,
  ProfessionalStatus,
  UpdateProfessionalRequest,
} from "@/types/professional"

export function useCreateProfessional() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateProfessionalRequest) =>
      createProfessional(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: professionalKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: dashboardKeys.all }),
      ])
    },
  })
}

export function useUpdateProfessional(professionalId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateProfessionalRequest) =>
      updateProfessional(professionalId, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: professionalKeys.detail(professionalId),
        }),
        queryClient.invalidateQueries({ queryKey: professionalKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: dashboardKeys.all }),
      ])
    },
  })
}

export function useUpdateProfessionalStatus(professionalId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (status: ProfessionalStatus) =>
      updateProfessionalStatus(professionalId, { status }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: professionalKeys.detail(professionalId),
        }),
        queryClient.invalidateQueries({ queryKey: professionalKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: dashboardKeys.summary() }),
        queryClient.invalidateQueries({ queryKey: dashboardKeys.recent(5) }),
      ])
    },
  })
}

export function useDeleteProfessional(professionalId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deleteProfessional(professionalId),
    onSuccess: async () => {
      queryClient.removeQueries({
        queryKey: professionalKeys.detail(professionalId),
      })
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: professionalKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: dashboardKeys.all }),
      ])
    },
  })
}
