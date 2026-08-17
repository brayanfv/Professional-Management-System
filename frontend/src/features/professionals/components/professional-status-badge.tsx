import { Badge } from "@/components/ui/badge"
import type { ProfessionalStatus } from "@/types/professional"

const statusConfig: Record<
  ProfessionalStatus,
  { label: string; variant: "success" | "neutral" }
> = {
  ACTIVE: { label: "Active", variant: "success" },
  INACTIVE: { label: "Inactive", variant: "neutral" },
}

export function ProfessionalStatusBadge({
  status,
}: {
  status: ProfessionalStatus
}) {
  const config = statusConfig[status]

  return <Badge variant={config.variant}>{config.label}</Badge>
}
