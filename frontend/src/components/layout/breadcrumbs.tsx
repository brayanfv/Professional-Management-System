"use client"

import { ChevronRightIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { routes } from "@/lib/routes"

type BreadcrumbItem = {
  label: string
  href?: string
}

function getBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const topLevelRoutes: readonly string[] = [
    routes.dashboard,
    routes.professionals.list,
    routes.departments,
    routes.positions,
    routes.profile,
  ]

  if (topLevelRoutes.includes(pathname)) {
    return []
  }

  if (pathname.startsWith(`${routes.professionals.list}/`)) {
    const items: BreadcrumbItem[] = [
      { label: "Professionals", href: routes.professionals.list },
    ]

    if (pathname === routes.professionals.create) {
      return [...items, { label: "New professional" }]
    }

    if (/^\/professionals\/[^/]+\/edit$/.test(pathname)) {
      return [...items, { label: "Edit professional" }]
    }

    if (/^\/professionals\/[^/]+$/.test(pathname)) {
      return [...items, { label: "Professional details" }]
    }
  }

  return []
}

export function Breadcrumbs() {
  const pathname = usePathname()
  const items = getBreadcrumbs(pathname)

  if (items.length === 0) {
    return null
  }

  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex min-w-0 items-center gap-1.5 overflow-hidden text-sm text-muted-foreground">
        {items.map((item, index) => {
          const current = index === items.length - 1

          return (
            <li
              key={`${item.label}-${index}`}
              className="flex min-w-0 items-center gap-1.5"
            >
              {index > 0 && (
                <ChevronRightIcon
                  className="size-3.5 shrink-0"
                  aria-hidden="true"
                />
              )}
              {item.href && !current ? (
                <Link
                  href={item.href}
                  className="truncate rounded-xs outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/25"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={current ? "page" : undefined}
                  className="truncate font-medium text-text-secondary"
                >
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
