"use client"

import { useState, type CSSProperties } from "react"

import { AppSidebar } from "@/components/layout/app-sidebar"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { MobileNavigation } from "@/components/layout/mobile-navigation"
import { PageContainer } from "@/components/layout/page-container"

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const sidebarWidth = sidebarExpanded
    ? "var(--sidebar-expanded-width)"
    : "var(--sidebar-collapsed-width)"
  const shellStyle = {
    "--app-sidebar-width": sidebarWidth,
  } as CSSProperties

  return (
    <div
      className="relative min-h-dvh bg-background lg:grid lg:grid-cols-[var(--app-sidebar-width)_minmax(0,1fr)] lg:transition-[grid-template-columns] lg:duration-[220ms] lg:ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none"
      style={shellStyle}
    >
      <a
        href="#main-content"
        className="fixed top-3 left-3 z-50 -translate-y-20 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground outline-none transition-transform focus:translate-y-0 focus:ring-2 focus:ring-primary/25 focus:ring-offset-2"
      >
        Skip to main content
      </a>
      <AppSidebar
        expanded={sidebarExpanded}
        onExpandedChange={setSidebarExpanded}
      />
      <div aria-hidden="true" className="hidden lg:block" />
      <div className="relative min-h-dvh min-w-0">
        <MobileNavigation />
        <main id="main-content" tabIndex={-1} className="min-w-0">
          <PageContainer>
            <Breadcrumbs />
            {children}
          </PageContainer>
        </main>
      </div>
    </div>
  )
}
