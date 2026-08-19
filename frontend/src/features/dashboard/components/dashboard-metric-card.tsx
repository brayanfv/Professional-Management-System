import type { LucideIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type MetricTone =
  | "primary"
  | "success"
  | "warning"
  | "department"
  | "position"

const iconToneClasses: Record<MetricTone, string> = {
  primary: "bg-primary-soft text-primary",
  success: "bg-success-soft text-success-foreground",
  warning: "bg-warning-soft text-warning-foreground",
  department:
    "bg-dashboard-department-soft text-dashboard-department-foreground",
  position: "bg-dashboard-position-soft text-dashboard-position-foreground",
}

type DashboardMetricCardProps = {
  label: string
  value: number
  icon: LucideIcon
  tone?: MetricTone
  supportingText: string
}

export function DashboardMetricCard({
  label,
  value,
  icon: Icon,
  tone = "primary",
  supportingText,
}: DashboardMetricCardProps) {
  return (
    <Card
      className="min-w-0 gap-0 shadow-none [--card-spacing:1.25rem]"
      aria-label={`${label}: ${value}`}
    >
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-md",
              iconToneClasses[tone],
            )}
            aria-hidden="true"
          >
            <Icon className="size-[1.125rem]" />
          </span>
          <p className="min-w-0 text-sm font-medium text-text-secondary">
            {label}
          </p>
        </div>
        <div className="space-y-0.5">
          <p className="text-[2rem] leading-none font-semibold tracking-tight text-foreground tabular-nums">
            {value.toLocaleString("en-US")}
          </p>
          <p className="text-[0.8125rem] text-muted-foreground">
            {supportingText}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
