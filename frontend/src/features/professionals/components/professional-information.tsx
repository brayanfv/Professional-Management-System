import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ProfessionalStatusBadge } from "@/features/professionals/components/professional-status-badge"
import { formatDateOnly, formatShortDate } from "@/lib/date"
import type { ProfessionalDetails } from "@/types/professional"

function DefinitionItem({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm leading-5 font-medium text-foreground">
        {children}
      </dd>
    </div>
  )
}

export function ProfessionalInformation({
  professional,
}: {
  professional: ProfessionalDetails
}) {
  return (
    <div className="grid gap-4 lg:gap-5 xl:grid-cols-2">
      <Card className="gap-0 py-0 shadow-none">
        <CardHeader className="border-b border-border px-4 py-3 !pb-3 sm:px-5 sm:py-3.5 sm:!pb-3.5">
          <CardTitle>Personal information</CardTitle>
        </CardHeader>
        <CardContent className="px-4 py-4 sm:px-5">
          <dl className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
            <DefinitionItem label="Full name">
              {professional.name}
            </DefinitionItem>
            <DefinitionItem label="Birth date">
              {professional.birthDate
                ? formatDateOnly(professional.birthDate)
                : "Not provided"}
            </DefinitionItem>
            <DefinitionItem label="Created">
              {formatShortDate(professional.createdAt)}
            </DefinitionItem>
            <DefinitionItem label="Last updated">
              {formatShortDate(professional.updatedAt)}
            </DefinitionItem>
          </dl>
        </CardContent>
      </Card>

      <Card className="gap-0 py-0 shadow-none">
        <CardHeader className="border-b border-border px-4 py-3 !pb-3 sm:px-5 sm:py-3.5 sm:!pb-3.5">
          <CardTitle>Employment information</CardTitle>
        </CardHeader>
        <CardContent className="px-4 py-4 sm:px-5">
          <dl className="grid gap-x-5 gap-y-4 sm:grid-cols-2 2xl:grid-cols-3">
            <DefinitionItem label="Department">
              {professional.department?.name ?? "—"}
            </DefinitionItem>
            <DefinitionItem label="Position">
              {professional.position?.name ?? "—"}
            </DefinitionItem>
            <DefinitionItem label="Status">
              <ProfessionalStatusBadge status={professional.status} />
            </DefinitionItem>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
