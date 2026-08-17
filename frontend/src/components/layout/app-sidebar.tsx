"use client"

import { PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react"

import { Brand } from "@/components/layout/brand"
import { SidebarNav } from "@/components/layout/sidebar-nav"
import { SidebarUser } from "@/components/layout/sidebar-user"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type AppSidebarProps = {
  collapsed: boolean
  onToggle: () => void
}

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const ToggleIcon = collapsed ? PanelLeftOpenIcon : PanelLeftCloseIcon
  const toggleLabel = collapsed ? "Expand sidebar" : "Collapse sidebar"

  const toggleButton = (
    <Button
      type="button"
      variant="ghost"
      size={collapsed ? "icon" : "default"}
      aria-label={toggleLabel}
      aria-expanded={!collapsed}
      onClick={onToggle}
      className={cn(
        "h-10",
        collapsed ? "w-full" : "w-full justify-start px-3",
      )}
    >
      <ToggleIcon className="size-4.5" />
      {!collapsed && <span>{toggleLabel}</span>}
    </Button>
  )

  return (
    <aside
      aria-label="Application sidebar"
      data-collapsed={collapsed}
      className={cn(
        "fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-border bg-surface transition-[width] duration-200 ease-out lg:flex",
        collapsed
          ? "w-[var(--sidebar-collapsed-width)]"
          : "w-[var(--sidebar-expanded-width)]",
      )}
    >
      <div className="flex h-18 shrink-0 items-center px-4">
        <Brand collapsed={collapsed} className="w-full" />
      </div>
      <Separator />
      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-5">
        <SidebarNav collapsed={collapsed} />
      </div>
      <div className="shrink-0 space-y-3 p-3">
        <Separator />
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger render={<span className="block" />}>
              {toggleButton}
            </TooltipTrigger>
            <TooltipContent side="right">{toggleLabel}</TooltipContent>
          </Tooltip>
        ) : (
          toggleButton
        )}
        <Separator />
        <SidebarUser collapsed={collapsed} />
      </div>
    </aside>
  )
}
