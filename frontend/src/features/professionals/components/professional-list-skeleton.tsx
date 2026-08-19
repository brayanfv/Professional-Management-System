import { Skeleton } from "@/components/ui/skeleton"

export function ProfessionalListSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <div aria-label="Loading professionals" aria-busy="true">
      <div className="hidden lg:block">
        <div className="grid grid-cols-[minmax(15rem,2fr)_1fr_1fr_auto_auto_2rem] gap-6 border-b border-border px-5 py-3">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-4 w-20" />
          ))}
        </div>
        {Array.from({ length: rows }, (_, index) => (
          <div
            key={index}
            className="grid grid-cols-[minmax(15rem,2fr)_1fr_1fr_auto_auto_2rem] items-center gap-6 border-b border-border px-5 py-4 last:border-0"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="size-9 shrink-0 rounded-full" />
              <Skeleton className="h-4 w-36" />
            </div>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="size-9" />
          </div>
        ))}
      </div>

      <div className="divide-y divide-border lg:hidden">
        {Array.from({ length: Math.min(rows, 8) }, (_, index) => (
          <div key={index} className="space-y-4 p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="size-9" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>
    </div>
  )
}
