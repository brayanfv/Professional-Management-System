"use client"

import { useQuery } from "@tanstack/react-query"

import { dashboardKeys } from "@/features/dashboard/query-keys"
import {
  getDashboardSummary,
  getProfessionalsByDepartment,
  getProfessionalsByPosition,
  getRecentProfessionals,
} from "@/lib/api/dashboard"

export function useDashboardSummary() {
  return useQuery({
    queryKey: dashboardKeys.summary(),
    queryFn: ({ signal }) => getDashboardSummary({ signal }),
  })
}

export function useProfessionalsByDepartment() {
  return useQuery({
    queryKey: dashboardKeys.byDepartment(),
    queryFn: ({ signal }) => getProfessionalsByDepartment({ signal }),
  })
}

export function useProfessionalsByPosition() {
  return useQuery({
    queryKey: dashboardKeys.byPosition(),
    queryFn: ({ signal }) => getProfessionalsByPosition({ signal }),
  })
}

export function useRecentProfessionals(limit: number) {
  return useQuery({
    queryKey: dashboardKeys.recent(limit),
    queryFn: ({ signal }) => getRecentProfessionals(limit, { signal }),
  })
}
