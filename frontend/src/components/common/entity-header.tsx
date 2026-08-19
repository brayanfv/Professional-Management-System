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
    <header className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        {avatar}
        <div className="min-w-0 space-y-1">
          <h1 className="truncate text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            {title}
          </h1>
          {subtitle || status ? (
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
              {subtitle ? (
                <div className="min-w-0 truncate text-muted-foreground">
                  {subtitle}
                </div>
              ) : null}
              {status ? <div className="shrink-0">{status}</div> : null}
            </div>
          ) : null}
        </div>
      </div>
      {primaryAction || secondaryActions ? (
        <div className="flex w-full shrink-0 items-center justify-end gap-2 sm:w-auto">
          {primaryAction}
          {secondaryActions}
        </div>
      ) : null}
    </header>
  )
}
