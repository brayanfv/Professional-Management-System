import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function InformationCardSkeleton() {
  return (
    <Card className="gap-0 py-0 shadow-none">
      <CardHeader className="border-b border-border px-4 py-3 !pb-3 sm:px-5 sm:py-3.5 sm:!pb-3.5">
        <Skeleton className="h-5 w-44" />
      </CardHeader>
      <CardContent className="grid gap-x-5 gap-y-4 px-4 py-4 sm:grid-cols-2 sm:px-5">
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
    <div
      className="-mt-1 space-y-4 lg:-mt-2 lg:space-y-5"
      aria-busy="true"
      aria-label="Loading professional"
    >
      <Skeleton className="h-5 w-40" />
      <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="size-12 rounded-full sm:size-13" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-56 max-w-[60vw]" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-48 max-w-[42vw]" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="size-9" />
        </div>
      </div>
      <div className="grid gap-4 lg:gap-5 xl:grid-cols-2">
        <InformationCardSkeleton />
        <InformationCardSkeleton />
      </div>
      <Card className="gap-0 py-0 shadow-none">
        <CardHeader className="border-b border-border px-4 py-3 !pb-3 sm:px-5 sm:py-3.5 sm:!pb-3.5">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </CardHeader>
        <CardContent className="space-y-0 px-4 py-0 sm:px-5">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="flex items-center gap-4 border-b border-border py-2.5 last:border-0">
              <Skeleton className="size-10 shrink-0 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-48 max-w-full" />
              </div>
              <Skeleton className="size-9" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
