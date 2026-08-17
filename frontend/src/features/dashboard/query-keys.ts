export const dashboardKeys = {
  all: ["dashboard"] as const,
  summary: () => [...dashboardKeys.all, "summary"] as const,
  byDepartment: () => [...dashboardKeys.all, "by-department"] as const,
  byPosition: () => [...dashboardKeys.all, "by-position"] as const,
  recent: (limit: number) => [...dashboardKeys.all, "recent", limit] as const,
}
