import type { LucideIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type MetricTone = "primary" | "success" | "neutral"

const iconToneClasses: Record<MetricTone, string> = {
  primary: "bg-primary-soft text-primary",
  success: "bg-success-soft text-success-foreground",
  neutral: "bg-surface-secondary text-text-secondary",
}

type DashboardMetricCardProps = {
  label: string
  value: number
  icon: LucideIcon
  tone?: MetricTone
}

export function DashboardMetricCard({
  label,
  value,
  icon: Icon,
  tone = "primary",
}: DashboardMetricCardProps) {
  return (
    <Card className="min-w-0" aria-label={`${label}: ${value}`}>
      <CardContent className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-3xl font-semibold tracking-tight text-foreground tabular-nums">
            {value.toLocaleString("en-US")}
          </p>
        </div>
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-md",
            iconToneClasses[tone],
          )}
          aria-hidden="true"
        >
          <Icon className="size-5" />
        </span>
      </CardContent>
    </Card>
  )
}
