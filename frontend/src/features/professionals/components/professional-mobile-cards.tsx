import Link from "next/link"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ProfessionalActions } from "@/features/professionals/components/professional-actions"
import { ProfessionalStatusBadge } from "@/features/professionals/components/professional-status-badge"
import { getProfessionalDetailsHref } from "@/features/professionals/professional-navigation"
import { formatShortDate } from "@/lib/date"
import { getInitials } from "@/lib/name"
import type { ProfessionalSummary } from "@/types/professional"

export function ProfessionalMobileCards({
  professionals,
  returnHref,
}: {
  professionals: ProfessionalSummary[]
  returnHref: string
}) {
  return (
    <ul className="divide-y divide-border lg:hidden" aria-label="Professionals">
      {professionals.map((professional) => (
        <li key={professional.id} className="space-y-3.5 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <Avatar>
              <AvatarFallback>{getInitials(professional.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <Link
                href={getProfessionalDetailsHref(
                  professional.id,
                  returnHref,
                )}
                className="block truncate font-semibold text-foreground outline-none transition-colors hover:text-primary hover:underline focus-visible:rounded-xs focus-visible:ring-2 focus-visible:ring-primary/25"
              >
                {professional.name}
              </Link>
              <p className="truncate text-sm text-muted-foreground">
                {professional.position?.name ?? "—"}
              </p>
            </div>
            <ProfessionalActions
              professionalId={professional.id}
              returnHref={returnHref}
            />
          </div>

          <div className="flex items-center justify-between gap-4 pl-12">
            <p className="min-w-0 truncate text-sm text-text-secondary">
              {professional.department?.name ?? "—"}
            </p>
            <ProfessionalStatusBadge status={professional.status} />
          </div>
          <p className="pl-12 text-xs text-muted-foreground">
            Added {formatShortDate(professional.createdAt)}
          </p>
        </li>
      ))}
    </ul>
  )
}
