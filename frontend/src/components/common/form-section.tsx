import type { ReactNode } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function FormSection({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <Card className="gap-0 py-0 shadow-none">
      <CardHeader className="border-b border-border px-4 py-3 !pb-3 sm:px-5 sm:py-3.5 sm:!pb-3.5">
        <CardTitle>{title}</CardTitle>
        {description ? (
          <CardDescription>{description}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="px-4 py-4 sm:px-5 sm:py-5">
        {children}
      </CardContent>
    </Card>
  )
}
