import { CircleAlertIcon, UserPlusIcon } from "lucide-react"
import Link from "next/link"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { RecentProfessionalsSkeleton } from "@/features/dashboard/components/dashboard-skeletons"
import { ProfessionalStatusBadge } from "@/features/professionals/components/professional-status-badge"
import { formatShortDate } from "@/lib/date"
import { getInitials } from "@/lib/name"
import { routes } from "@/lib/routes"
import type { RecentProfessional } from "@/types/dashboard"

type RecentProfessionalsProps = {
  data: RecentProfessional[] | undefined
  isLoading: boolean
  isError: boolean
  onRetry: () => void
}

function ProfessionalIdentity({
  professional,
}: {
  professional: RecentProfessional
}) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar size="sm">
        <AvatarFallback>{getInitials(professional.name)}</AvatarFallback>
      </Avatar>
      <Link
        href={routes.professionals.details(professional.id)}
        className="truncate font-medium text-foreground outline-none transition-colors hover:text-primary hover:underline focus-visible:rounded-xs focus-visible:ring-2 focus-visible:ring-primary/25"
      >
        {professional.name}
      </Link>
    </div>
  )
}

export function RecentProfessionals({
  data,
  isLoading,
  isError,
  onRetry,
}: RecentProfessionalsProps) {
  if (isLoading) {
    return <RecentProfessionalsSkeleton />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent professionals</CardTitle>
        <CardDescription>
          The latest professionals added to the organization.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isError ? (
          <div
            className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-md border border-danger/20 bg-danger-soft/40 px-6 text-center"
            role="alert"
          >
            <CircleAlertIcon
              className="size-5 text-danger"
              aria-hidden="true"
            />
            <p className="text-sm font-medium text-danger-foreground">
              Unable to load recent professionals.
            </p>
            <Button variant="outline" size="sm" onClick={onRetry}>
              Try again
            </Button>
          </div>
        ) : null}

        {!isError && data?.length === 0 ? (
          <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border px-6 text-center">
            <span className="flex size-10 items-center justify-center rounded-md bg-primary-soft text-primary">
              <UserPlusIcon className="size-5" aria-hidden="true" />
            </span>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">
                No professionals yet
              </p>
              <p className="text-sm text-muted-foreground">
                Add your first professional to start seeing organization
                insights.
              </p>
            </div>
            <Link
              href={routes.professionals.create}
              className={buttonVariants()}
            >
              Add professional
            </Link>
          </div>
        ) : null}

        {!isError && data && data.length > 0 ? (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full border-collapse text-left text-sm">
                <caption className="sr-only">
                  Five most recently added professionals
                </caption>
                <thead>
                  <tr className="border-b border-border text-xs font-medium text-muted-foreground">
                    <th scope="col" className="pb-3 pr-4 font-medium">
                      Professional
                    </th>
                    <th scope="col" className="px-4 pb-3 font-medium">
                      Department
                    </th>
                    <th scope="col" className="px-4 pb-3 font-medium">
                      Position
                    </th>
                    <th scope="col" className="px-4 pb-3 font-medium">
                      Status
                    </th>
                    <th scope="col" className="pb-3 pl-4 font-medium">
                      Added
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((professional) => (
                    <tr
                      key={professional.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="py-4 pr-4">
                        <ProfessionalIdentity professional={professional} />
                      </td>
                      <td className="px-4 py-4 text-text-secondary">
                        {professional.department?.name ?? "—"}
                      </td>
                      <td className="px-4 py-4 text-text-secondary">
                        {professional.position?.name ?? "—"}
                      </td>
                      <td className="px-4 py-4">
                        <ProfessionalStatusBadge status={professional.status} />
                      </td>
                      <td className="py-4 pl-4 whitespace-nowrap text-muted-foreground">
                        {formatShortDate(professional.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-border md:hidden">
              {data.map((professional) => (
                <li key={professional.id} className="space-y-3 py-4 first:pt-0 last:pb-0">
                  <ProfessionalIdentity professional={professional} />
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 pl-11 text-sm">
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Department</p>
                      <p className="truncate text-text-secondary">
                        {professional.department?.name ?? "—"}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Position</p>
                      <p className="truncate text-text-secondary">
                        {professional.position?.name ?? "—"}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1 text-xs text-muted-foreground">Status</p>
                      <ProfessionalStatusBadge status={professional.status} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Added</p>
                      <p className="text-text-secondary">
                        {formatShortDate(professional.createdAt)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </CardContent>
    </Card>
  )
}
