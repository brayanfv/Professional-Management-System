"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { departmentKeys } from "@/features/departments/query-keys"
import { getDepartments } from "@/lib/api/departments"
import type { DepartmentQueryParams } from "@/types/department"

export function useDepartmentList(params: DepartmentQueryParams) {
  return useQuery({
    queryKey: departmentKeys.list(params),
    queryFn: () => getDepartments(params),
    placeholderData: keepPreviousData,
  })
}
