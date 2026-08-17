"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getUserRoleLabel } from "@/features/auth/auth-utils"
import { useAuth } from "@/providers/auth-provider"

export function ProfileSummary() {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Your authenticated account information.
        </p>
      </div>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>
            Profile editing is not available in the current MVP.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1">
              <dt className="text-xs font-medium text-muted-foreground">Name</dt>
              <dd className="text-sm font-medium text-foreground">{user.name}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs font-medium text-muted-foreground">Email</dt>
              <dd className="text-sm font-medium text-foreground">{user.email}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs font-medium text-muted-foreground">Role</dt>
              <dd>
                <Badge variant="secondary">{getUserRoleLabel(user.role)}</Badge>
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </section>
  )
}
