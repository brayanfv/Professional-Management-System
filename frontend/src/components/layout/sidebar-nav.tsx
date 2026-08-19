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

type SidebarNavProps = {
  collapsed?: boolean
  onNavigate?: (interaction: "pointer" | "keyboard") => void
  variant?: "default" | "sidebar"
}

const defaultItemClassName =
  "flex min-h-10 w-full items-center gap-3 rounded-md px-3 text-sm font-medium text-text-secondary outline-none transition-[color,background-color] duration-150 ease-out hover:bg-surface-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:ring-offset-2 focus-visible:ring-offset-surface data-[active=true]:bg-primary-soft data-[active=true]:font-semibold data-[active=true]:text-primary data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-60"

const sidebarItemClassName =
  "flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-sidebar-muted outline-none transition-[color,background-color] duration-150 ease-out hover:bg-sidebar-hover hover:text-sidebar-foreground focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar-background data-[active=true]:bg-sidebar-active data-[active=true]:font-semibold data-[active=true]:text-sidebar-active-foreground data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-60"

function SidebarNavItem({
  item,
  collapsed,
  active,
  onNavigate,
  variant,
}: {
  item: NavigationItem
  collapsed: boolean
  active: boolean
  onNavigate?: (interaction: "pointer" | "keyboard") => void
  variant: "default" | "sidebar"
}) {
  const Icon = item.icon
  const itemClassName =
    variant === "sidebar" ? sidebarItemClassName : defaultItemClassName
  const content = (
    <>
      <Icon className="size-4.5 shrink-0" aria-hidden="true" />
      <span
        className={cn(
          "min-w-0 overflow-hidden whitespace-nowrap transition-[max-width,opacity,transform] duration-150 ease-out motion-reduce:transition-none",
          collapsed
            ? "max-w-0 -translate-x-1 opacity-0"
            : "max-w-40 translate-x-0 opacity-100",
        )}
      >
        {item.label}
      </span>
    </>
  )

  if (item.disabled || !item.href) {
    const disabledItem = (
      <span
        data-disabled="true"
        aria-disabled="true"
        tabIndex={collapsed ? 0 : undefined}
        className={cn(
          itemClassName,
          collapsed && "justify-center gap-0 px-0",
        )}
      >
        {content}
      </span>
    )

    return (
      <Tooltip
        disabled={!collapsed}
        disableHoverablePopup
      >
        <TooltipTrigger render={<span className="block" />}>
          {disabledItem}
        </TooltipTrigger>
        {collapsed ? (
          <TooltipContent side="right">{item.label} unavailable</TooltipContent>
        ) : null}
      </Tooltip>
    )
  }

  return (
    <Tooltip
      disabled={!collapsed}
      disableHoverablePopup
    >
      <TooltipTrigger
        render={
          <Link
            href={item.href}
            data-active={active}
            aria-current={active ? "page" : undefined}
            className={cn(
              itemClassName,
              collapsed && "justify-center gap-0 px-0",
            )}
            onClick={(event) =>
              onNavigate?.(event.detail === 0 ? "keyboard" : "pointer")
            }
          />
        }
      >
        {content}
      </TooltipTrigger>
      {collapsed ? <TooltipContent side="right">{item.label}</TooltipContent> : null}
    </Tooltip>
  )
}

export function SidebarNav({
  collapsed = false,
  onNavigate,
  variant = "default",
}: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav aria-label="Primary navigation" className="min-w-0 space-y-0">
      {navigationSections.map((section, sectionIndex) => (
        <div key={section.label}>
          {sectionIndex > 0 ? (
            <Separator
              className={cn(
                collapsed ? "my-4" : "my-5",
                variant === "sidebar" && "bg-sidebar-border",
              )}
            />
          ) : null}
          {!collapsed && (
            <p
              className={cn(
                "mb-2 px-3 text-[0.6875rem] font-semibold tracking-[0.1em] uppercase",
                variant === "sidebar" ? "text-sidebar-muted" : "text-muted-foreground",
              )}
            >
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
                variant={variant}
              />
            ))}
          </div>
        </div>
      ))}
    </nav>
  )
}
