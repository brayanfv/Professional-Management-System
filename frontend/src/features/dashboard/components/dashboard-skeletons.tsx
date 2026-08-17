import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardMetricsSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      aria-label="Loading dashboard summary"
      aria-busy="true"
    >
      {Array.from({ length: 4 }, (_, index) => (
        <Card key={index}>
          <CardContent className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-9 w-20" />
            </div>
            <Skeleton className="size-10" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="space-y-4" aria-label="Loading chart" aria-busy="true">
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} className="flex items-center gap-4">
          <Skeleton className="h-4 w-28 shrink-0" />
          <Skeleton
            className="h-7"
            style={{ width: `${82 - index * 10}%` }}
          />
        </div>
      ))}
    </div>
  )
}

export function RecentProfessionalsSkeleton() {
  return (
    <Card aria-label="Loading recent professionals" aria-busy="true">
      <CardHeader>
        <Skeleton className="h-5 w-44" />
        <Skeleton className="h-4 w-64 max-w-full" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={index}
            className="grid grid-cols-[minmax(0,2fr)_1fr] items-center gap-4 border-b border-border pb-4 last:border-0 last:pb-0 md:grid-cols-[minmax(0,2fr)_1fr_1fr_auto_auto]"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="size-8 shrink-0 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-4 w-20" />
            <Skeleton className="hidden h-4 w-24 md:block" />
            <Skeleton className="hidden h-6 w-16 rounded-full md:block" />
            <Skeleton className="hidden h-4 w-20 md:block" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
