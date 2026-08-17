import type { DepartmentQueryParams } from "@/types/department"

export const departmentKeys = {
  all: ["departments"] as const,
  lists: () => [...departmentKeys.all, "list"] as const,
  list: (params: DepartmentQueryParams) =>
    [...departmentKeys.lists(), params] as const,
  details: () => [...departmentKeys.all, "detail"] as const,
  detail: (id: number) => [...departmentKeys.details(), id] as const,
  options: () => [...departmentKeys.all, "options"] as const,
}
