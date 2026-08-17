"use client"

import { useQuery } from "@tanstack/react-query"

import { departmentKeys } from "@/features/departments/query-keys"
import { getDepartmentOptions } from "@/lib/api/departments"

export function useDepartments() {
  return useQuery({
    queryKey: departmentKeys.options(),
    queryFn: getDepartmentOptions,
  })
}
