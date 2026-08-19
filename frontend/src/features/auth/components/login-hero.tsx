import {
  BriefcaseBusinessIcon,
  Building2Icon,
  CheckIcon,
} from "lucide-react"

import { Brand } from "@/components/layout/brand"

export function LoginHero() {
  return (
    <aside
      className="relative hidden h-full min-h-0 overflow-hidden border-r border-sidebar-border bg-sidebar-background px-10 py-10 text-sidebar-foreground lg:flex lg:flex-col xl:px-14 xl:py-12"
      aria-label="Professional Management workspace overview"
    >
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <Brand variant="sidebar" />

        <div className="mt-12 max-w-md space-y-4 xl:mt-16">
          <p className="text-xs font-semibold tracking-[0.16em] text-sidebar-muted uppercase">
            Organization workspace
          </p>
          <p className="text-3xl leading-tight font-semibold tracking-tight text-sidebar-foreground xl:text-4xl">
            Manage people, roles and departments from one organized workspace.
          </p>
          <p className="max-w-sm text-sm leading-6 text-sidebar-muted">
            Keep your organization structured, current and easy to navigate.
          </p>
        </div>

        <div
          className="relative mt-auto min-h-72 w-full max-w-lg self-center pt-10"
          aria-hidden="true"
        >
          <span className="absolute top-2 left-1/2 size-48 -translate-x-1/2 rounded-full border border-sidebar-border/70 bg-primary/10" />

          <div className="relative mx-auto w-[88%] rounded-xl border border-sidebar-border bg-sidebar-hover p-5 shadow-dialog">
            <div className="flex items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
                PR
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sidebar-foreground">
                  Professional
                </p>
                <p className="text-sm text-sidebar-muted">
                  Software Developer
                </p>
              </div>
              <span className="flex items-center gap-1.5 rounded-full border border-success/30 bg-success/15 px-2.5 py-1 text-xs font-medium text-success-soft">
                <CheckIcon className="size-3.5" />
                Active
              </span>
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-sidebar-border pt-4 text-sm">
              <span className="text-sidebar-muted">Department</span>
              <span className="font-medium text-sidebar-foreground">
                Technology
              </span>
            </div>
          </div>

          <div className="relative mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-sidebar-border bg-sidebar-hover px-4 py-3.5">
              <span className="mb-3 flex size-8 items-center justify-center rounded-md bg-primary/20 text-primary-foreground">
                <Building2Icon className="size-4" />
              </span>
              <p className="text-sm font-medium text-sidebar-foreground">
                Departments
              </p>
              <p className="mt-0.5 text-xs text-sidebar-muted">
                Organized teams
              </p>
            </div>
            <div className="rounded-lg border border-sidebar-border bg-sidebar-hover px-4 py-3.5">
              <span className="mb-3 flex size-8 items-center justify-center rounded-md bg-primary/20 text-primary-foreground">
                <BriefcaseBusinessIcon className="size-4" />
              </span>
              <p className="text-sm font-medium text-sidebar-foreground">
                Positions
              </p>
              <p className="mt-0.5 text-xs text-sidebar-muted">
                Defined roles
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
