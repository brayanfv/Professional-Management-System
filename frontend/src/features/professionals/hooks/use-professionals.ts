"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { professionalKeys } from "@/features/professionals/query-keys"
import { getProfessionals } from "@/lib/api/professionals"
import type { ProfessionalsQueryParams } from "@/types/professional"

export function useProfessionals(params: ProfessionalsQueryParams) {
  return useQuery({
    queryKey: professionalKeys.list(params),
    queryFn: () => getProfessionals(params),
    placeholderData: keepPreviousData,
  })
}
