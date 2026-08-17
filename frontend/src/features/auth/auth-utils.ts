import type { UserRole } from "@/features/auth/types"

export function getUserRoleLabel(role: UserRole) {
  const labels: Record<UserRole, string> = {
    ADMIN: "Administrator",
  }

  return labels[role]
}
