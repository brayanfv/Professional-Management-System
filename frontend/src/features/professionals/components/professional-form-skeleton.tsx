import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function FormSectionSkeleton({
  layout,
}: {
  layout: "personal" | "organization"
}) {
  const personal = layout === "personal"

  return (
    <Card className="gap-0 py-0 shadow-none">
      <CardHeader className="border-b border-border px-4 py-3 !pb-3 sm:px-5 sm:py-3.5 sm:!pb-3.5">
        <Skeleton className="h-5 w-44" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </CardHeader>
      <CardContent
        className={
          personal
            ? "grid gap-4 px-4 py-4 md:grid-cols-3 md:gap-5 sm:px-5 sm:py-5"
            : "grid gap-4 px-4 py-4 md:grid-cols-2 md:gap-5 sm:px-5 sm:py-5"
        }
      >
        {Array.from({ length: 2 }, (_, index) => (
          <div
            key={index}
            className={
              personal && index === 0 ? "space-y-2 md:col-span-2" : "space-y-2"
            }
          >
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function ProfessionalFormSkeleton() {
  return (
    <div
      className="mx-auto w-full max-w-5xl space-y-5"
      aria-busy="true"
      aria-label="Loading professional form"
    >
      <Skeleton className="h-5 w-52" />
      <div className="space-y-2">
        <Skeleton className="h-9 w-52" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <FormSectionSkeleton layout="personal" />
      <FormSectionSkeleton layout="organization" />
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Skeleton className="h-10 w-full sm:w-24" />
        <Skeleton className="h-10 w-full sm:w-32" />
      </div>
    </div>
  )
}
