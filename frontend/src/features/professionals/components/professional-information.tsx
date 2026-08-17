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
      <dd className="text-sm font-medium text-foreground">{children}</dd>
    </div>
  )
}

export function ProfessionalInformation({
  professional,
}: {
  professional: ProfessionalDetails
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader className="border-b border-border">
          <CardTitle>Personal information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
            <DefinitionItem label="Full name">
              {professional.name}
            </DefinitionItem>
            <DefinitionItem label="Birth date">
              {professional.birthDate
                ? formatDateOnly(professional.birthDate)
                : "Not provided"}
            </DefinitionItem>
            <DefinitionItem label="Created at">
              {formatShortDate(professional.createdAt)}
            </DefinitionItem>
            <DefinitionItem label="Updated at">
              {formatShortDate(professional.updatedAt)}
            </DefinitionItem>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b border-border">
          <CardTitle>Employment information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
            <DefinitionItem label="Department">
              {professional.department?.name ?? "Not assigned"}
            </DefinitionItem>
            <DefinitionItem label="Position">
              {professional.position?.name ?? "Not assigned"}
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
