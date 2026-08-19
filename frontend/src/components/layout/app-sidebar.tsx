"use client"

import { useEffect, useRef } from "react"

import { Brand } from "@/components/layout/brand"
import { SidebarNav } from "@/components/layout/sidebar-nav"
import { SidebarUser } from "@/components/layout/sidebar-user"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const CLOSE_DELAY_MS = 120

type AppSidebarProps = {
  expanded: boolean
  onExpandedChange: (expanded: boolean) => void
}

export function AppSidebar({
  expanded,
  onExpandedChange,
}: AppSidebarProps) {
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pointerInside = useRef(false)
  const focusWithin = useRef(false)
  const userMenuOpen = useRef(false)
  const interactionMode = useRef<"pointer" | "keyboard">("pointer")
  const navigationLock = useRef<"pointer" | "keyboard" | null>(null)

  function clearCloseTimer() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }

  function openSidebar() {
    if (navigationLock.current !== null) return

    clearCloseTimer()
    onExpandedChange(true)
  }

  function scheduleClose() {
    clearCloseTimer()
    closeTimer.current = setTimeout(() => {
      const hasKeyboardFocus =
        interactionMode.current === "keyboard" && focusWithin.current

      if (
        !pointerInside.current &&
        !hasKeyboardFocus &&
        !userMenuOpen.current
      ) {
        onExpandedChange(false)
      }
    }, CLOSE_DELAY_MS)
  }

  function handleNavigation(interaction: "pointer" | "keyboard") {
    navigationLock.current = interaction
    userMenuOpen.current = false
    clearCloseTimer()
    onExpandedChange(false)
  }

  function handleUserMenuOpenChange(open: boolean) {
    userMenuOpen.current = open

    if (open) {
      navigationLock.current = null
      openSidebar()
      return
    }

    scheduleClose()
  }

  useEffect(() => {
    return () => {
      clearCloseTimer()
    }
  }, [])

  return (
    <aside
      aria-label="Application sidebar"
      data-expanded={expanded}
      onMouseEnter={() => {
        pointerInside.current = true
        interactionMode.current = "pointer"
        if (navigationLock.current === "pointer") {
          navigationLock.current = null
        }
        openSidebar()
      }}
      onMouseLeave={() => {
        pointerInside.current = false
        scheduleClose()
      }}
      onPointerDownCapture={() => {
        interactionMode.current = "pointer"
      }}
      onKeyDownCapture={() => {
        interactionMode.current = "keyboard"
      }}
      onFocusCapture={(event) => {
        focusWithin.current = true
        if (
          event.target instanceof HTMLElement &&
          event.target.matches(":focus-visible")
        ) {
          interactionMode.current = "keyboard"
        }

        if (interactionMode.current === "keyboard") {
          openSidebar()
        }
      }}
      onBlurCapture={(event) => {
        if (event.currentTarget.contains(event.relatedTarget)) return

        focusWithin.current = false
        if (navigationLock.current === "keyboard") {
          navigationLock.current = null
        }

        if (
          interactionMode.current === "keyboard" &&
          !userMenuOpen.current
        ) {
          clearCloseTimer()
          onExpandedChange(false)
          return
        }

        scheduleClose()
      }}
      className={cn(
        "fixed inset-y-0 left-0 z-40 hidden min-h-dvh flex-col overflow-x-clip overflow-y-hidden border-r border-sidebar-border bg-sidebar-background text-sidebar-foreground transition-[width] duration-[220ms] ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none lg:flex",
        "w-[var(--app-sidebar-width)]",
      )}
    >
      <div className="flex h-20 shrink-0 items-center px-4">
        <Brand collapsed={!expanded} variant="sidebar" className="w-full" />
      </div>
      <Separator className="bg-sidebar-border" />
      <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-3 py-5">
        <SidebarNav
          collapsed={!expanded}
          variant="sidebar"
          onNavigate={handleNavigation}
        />
      </div>
      <div className="shrink-0 border-t border-sidebar-border px-3 py-3">
        <SidebarUser
          collapsed={!expanded}
          variant="sidebar"
          onMenuOpenChange={handleUserMenuOpenChange}
          onMenuAction={handleNavigation}
        />
      </div>
    </aside>
  )
}
