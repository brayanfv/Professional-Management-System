"use client"

import { PageHeader } from "@/components/common/page-header"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { getUserRoleLabel } from "@/features/auth/auth-utils"
import { getInitials } from "@/lib/name"
import { useAuth } from "@/providers/auth-provider"

export function ProfileSummary() {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  const roleLabel = getUserRoleLabel(user.role)

  return (
    <section className="w-full max-w-3xl space-y-5 sm:space-y-6">
      <PageHeader
        title="Profile"
        description="Your account information and access details."
      />

      <Card className="gap-0 py-0 shadow-none">
        <CardContent className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:gap-5 sm:px-6">
          <Avatar className="size-16 border-primary/20" aria-hidden="true">
            <AvatarFallback className="text-lg">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-xl font-semibold tracking-tight text-foreground">
              {user.name}
            </h2>
            <p className="mt-0.5 break-all text-sm text-muted-foreground sm:truncate">
              {user.email}
            </p>
            <Badge variant="secondary" className="mt-3">
              {roleLabel}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="gap-0 py-0 shadow-none">
        <div className="border-b border-border px-5 py-4 sm:px-6">
          <h2 className="text-base font-semibold text-foreground">
            Account information
          </h2>
        </div>
        <CardContent className="px-5 py-1 sm:px-6">
          <dl className="divide-y divide-border">
            <div className="grid gap-1 py-3.5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:items-center sm:gap-4">
              <dt className="text-xs font-medium text-muted-foreground sm:text-sm">
                Name
              </dt>
              <dd className="text-sm font-medium text-foreground">
                {user.name}
              </dd>
            </div>
            <div className="grid gap-1 py-3.5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:items-center sm:gap-4">
              <dt className="text-xs font-medium text-muted-foreground sm:text-sm">
                Email
              </dt>
              <dd className="break-all text-sm font-medium text-foreground">
                {user.email}
              </dd>
            </div>
            <div className="grid gap-1 py-3.5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:items-center sm:gap-4">
              <dt className="text-xs font-medium text-muted-foreground sm:text-sm">
                Role
              </dt>
              <dd>
                <Badge variant="secondary">{roleLabel}</Badge>
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </section>
  )
}
