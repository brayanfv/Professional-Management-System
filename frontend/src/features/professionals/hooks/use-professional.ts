"use client"

import { useQuery } from "@tanstack/react-query"

import { professionalKeys } from "@/features/professionals/query-keys"
import { getProfessionalById } from "@/lib/api/professionals"

export function useProfessional(id: number) {
  return useQuery({
    queryKey: professionalKeys.detail(id),
    queryFn: ({ signal }) => getProfessionalById(id, { signal }),
  })
}
