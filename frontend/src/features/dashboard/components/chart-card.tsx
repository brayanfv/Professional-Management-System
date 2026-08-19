import { CircleAlertIcon } from "lucide-react"
import type { ReactNode } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChartSkeleton } from "@/features/dashboard/components/dashboard-skeletons"

type ChartCardProps = {
  title: string
  description?: string
  isLoading: boolean
  isError: boolean
  isEmpty: boolean
  emptyMessage: string
  onRetry: () => void
  children: ReactNode
}

export function ChartCard({
  title,
  description,
  isLoading,
  isError,
  isEmpty,
  emptyMessage,
  onRetry,
  children,
}: ChartCardProps) {
  return (
    <Card className="min-w-0 gap-0 shadow-none [--card-spacing:1.25rem]">
      <CardHeader className="pb-4">
        <CardTitle>{title}</CardTitle>
        {description ? (
          <CardDescription>{description}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="min-h-0">
        {isLoading ? <ChartSkeleton /> : null}
        {!isLoading && isError ? (
          <div
            className="flex min-h-44 flex-col items-center justify-center gap-3 rounded-md border border-danger/20 bg-danger-soft/40 px-6 text-center"
            role="alert"
          >
            <CircleAlertIcon
              className="size-5 text-danger"
              aria-hidden="true"
            />
            <p className="text-sm font-medium text-danger-foreground">
              Unable to load this chart.
            </p>
            <Button variant="outline" size="sm" onClick={onRetry}>
              Try again
            </Button>
          </div>
        ) : null}
        {!isLoading && !isError && isEmpty ? (
          <div className="flex min-h-44 items-center justify-center rounded-md border border-dashed border-border px-6 text-center">
            <p className="text-sm text-muted-foreground">{emptyMessage}</p>
          </div>
        ) : null}
        {!isLoading && !isError && !isEmpty ? children : null}
      </CardContent>
    </Card>
  )
}
