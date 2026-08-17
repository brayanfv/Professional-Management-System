"use client"

import { AppSidebar } from "@/components/layout/app-sidebar"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { MobileNavigation } from "@/components/layout/mobile-navigation"
import { PageContainer } from "@/components/layout/page-container"
import { useSidebarState } from "@/hooks/use-sidebar-state"
import { cn } from "@/lib/utils"

export function AppShell({ children }: { children: React.ReactNode }) {
  const { collapsed, toggle } = useSidebarState()

  return (
    <div className="min-h-dvh bg-background">
      <a
        href="#main-content"
        className="fixed top-3 left-3 z-50 -translate-y-20 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground outline-none transition-transform focus:translate-y-0 focus:ring-2 focus:ring-primary/25 focus:ring-offset-2"
      >
        Skip to main content
      </a>
      <AppSidebar collapsed={collapsed} onToggle={toggle} />
      <div
        className={cn(
          "min-h-dvh transition-[padding-left] duration-200 ease-out",
          collapsed
            ? "lg:pl-[var(--sidebar-collapsed-width)]"
            : "lg:pl-[var(--sidebar-expanded-width)]",
        )}
      >
        <MobileNavigation />
        <main id="main-content" tabIndex={-1}>
          <PageContainer>
            <Breadcrumbs />
            {children}
          </PageContainer>
        </main>
      </div>
    </div>
  )
}
