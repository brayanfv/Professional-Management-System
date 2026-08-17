"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  isNavigationItemActive,
  navigationSections,
  type NavigationItem,
} from "@/lib/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/providers/auth-provider"

type SidebarNavProps = {
  collapsed?: boolean
  onNavigate?: () => void
}

const itemClassName =
  "flex min-h-10 w-full items-center gap-3 rounded-md px-3 text-sm font-medium text-text-secondary outline-none transition-[color,background-color] duration-150 ease-out hover:bg-surface-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:ring-offset-2 focus-visible:ring-offset-surface data-[active=true]:bg-primary-soft data-[active=true]:text-primary data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-60"

function SidebarNavItem({
  item,
  collapsed,
  active,
  onNavigate,
  onLogout,
}: {
  item: NavigationItem
  collapsed: boolean
  active: boolean
  onNavigate?: () => void
  onLogout: () => void
}) {
  const Icon = item.icon
  const content = (
    <>
      <Icon className="size-4.5 shrink-0" aria-hidden="true" />
      <span className={cn(collapsed && "sr-only")}>{item.label}</span>
    </>
  )

  if (item.action === "logout") {
    const logoutButton = (
      <button
        type="button"
        className={cn(itemClassName, collapsed && "justify-center px-0")}
        onClick={() => {
          onNavigate?.()
          onLogout()
        }}
      >
        {content}
      </button>
    )

    if (!collapsed) {
      return logoutButton
    }

    return (
      <Tooltip>
        <TooltipTrigger render={<span className="block" />}>
          {logoutButton}
        </TooltipTrigger>
        <TooltipContent side="right">Logout</TooltipContent>
      </Tooltip>
    )
  }

  if (item.disabled || !item.href) {
    const disabledItem = (
      <span
        data-disabled="true"
        aria-disabled="true"
        tabIndex={collapsed ? 0 : undefined}
        className={cn(itemClassName, collapsed && "justify-center px-0")}
      >
        {content}
      </span>
    )

    if (!collapsed) {
      return disabledItem
    }

    return (
      <Tooltip>
        <TooltipTrigger render={<span className="block" />}>
          {disabledItem}
        </TooltipTrigger>
        <TooltipContent side="right">{item.label} unavailable</TooltipContent>
      </Tooltip>
    )
  }

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger
          render={
            <Link
              href={item.href}
              data-active={active}
              aria-current={active ? "page" : undefined}
              className={cn(itemClassName, "justify-center px-0")}
              onClick={onNavigate}
            />
          }
        >
          {content}
        </TooltipTrigger>
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Link
      href={item.href}
      data-active={active}
      aria-current={active ? "page" : undefined}
      className={itemClassName}
      onClick={onNavigate}
    >
      {content}
    </Link>
  )
}

export function SidebarNav({
  collapsed = false,
  onNavigate,
}: SidebarNavProps) {
  const pathname = usePathname()
  const { signOut } = useAuth()

  return (
    <nav aria-label="Primary navigation" className="space-y-3">
      {navigationSections.map((section, sectionIndex) => (
        <div key={section.label}>
          {sectionIndex > 0 && collapsed && <Separator className="mb-3" />}
          {!collapsed && (
            <p className="mb-1.5 px-3 text-[0.6875rem] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
              {section.label}
            </p>
          )}
          <div className="space-y-1">
            {section.items.map((item) => (
              <SidebarNavItem
                key={item.label}
                item={item}
                collapsed={collapsed}
                active={isNavigationItemActive(pathname, item)}
                onNavigate={onNavigate}
                onLogout={() => void signOut()}
              />
            ))}
          </div>
        </div>
      ))}
    </nav>
  )
}
