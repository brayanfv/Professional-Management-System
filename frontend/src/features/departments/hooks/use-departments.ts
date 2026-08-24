"use client"

import { useQuery } from "@tanstack/react-query"

import { departmentKeys } from "@/features/departments/query-keys"
import { getDepartmentOptions } from "@/lib/api/departments"

const optionsStaleTime = 5 * 60_000

export function useDepartments() {
  return useQuery({
    queryKey: departmentKeys.options(),
    queryFn: ({ signal }) => getDepartmentOptions({ signal }),
    staleTime: optionsStaleTime,
  })
}
