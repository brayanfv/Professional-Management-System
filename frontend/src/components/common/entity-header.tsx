import type { ReactNode } from "react"

type EntityHeaderProps = {
  avatar: ReactNode
  title: string
  subtitle?: ReactNode
  status?: ReactNode
  primaryAction?: ReactNode
  secondaryActions?: ReactNode
}

export function EntityHeader({
  avatar,
  title,
  subtitle,
  status,
  primaryAction,
  secondaryActions,
}: EntityHeaderProps) {
  return (
    <header className="flex flex-col gap-5 rounded-lg border border-border bg-surface p-5 shadow-card sm:p-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 items-start gap-4 sm:items-center">
        {avatar}
        <div className="min-w-0 space-y-1.5">
          <h1 className="truncate text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>
          {subtitle ? (
            <div className="text-sm text-muted-foreground">{subtitle}</div>
          ) : null}
          {status ? <div>{status}</div> : null}
        </div>
      </div>
      {primaryAction || secondaryActions ? (
        <div className="flex shrink-0 items-center gap-2 self-stretch sm:self-auto">
          {primaryAction}
          {secondaryActions}
        </div>
      ) : null}
    </header>
  )
}
