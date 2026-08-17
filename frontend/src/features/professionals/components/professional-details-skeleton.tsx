import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function InformationCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-44" />
      </CardHeader>
      <CardContent className="grid gap-5 sm:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-4 w-36 max-w-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function ProfessionalDetailsSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading professional">
      <Skeleton className="h-5 w-40" />
      <div className="flex flex-col gap-5 rounded-lg border border-border bg-surface p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="size-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-56 max-w-[60vw]" />
            <Skeleton className="h-4 w-48 max-w-[50vw]" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="size-10" />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <InformationCardSkeleton />
        <InformationCardSkeleton />
      </div>
      <Card>
        <CardHeader className="border-b border-border">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-14 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
