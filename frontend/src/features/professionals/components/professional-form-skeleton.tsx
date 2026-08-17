import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function FormSectionSkeleton({ fields }: { fields: number }) {
  return (
    <Card>
      <CardHeader className="border-b border-border">
        <Skeleton className="h-5 w-44" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </CardHeader>
      <CardContent className="grid gap-5 sm:grid-cols-2">
        {Array.from({ length: fields }, (_, index) => (
          <div key={index} className={index === 0 ? "space-y-2 sm:col-span-2" : "space-y-2"}>
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
      className="max-w-4xl space-y-6"
      aria-busy="true"
      aria-label="Loading professional form"
    >
      <Skeleton className="h-5 w-52" />
      <div className="space-y-2">
        <Skeleton className="h-9 w-52" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <FormSectionSkeleton fields={2} />
      <FormSectionSkeleton fields={2} />
      <div className="flex justify-end gap-3">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  )
}
