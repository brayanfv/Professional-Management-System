"use client"

import { MenuIcon } from "lucide-react"
import { useState } from "react"

import { Brand } from "@/components/layout/brand"
import { SidebarNav } from "@/components/layout/sidebar-nav"
import { SidebarUser } from "@/components/layout/sidebar-user"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function MobileNavigation() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-20 flex h-[calc(4rem+env(safe-area-inset-top))] items-center gap-3 border-b border-border bg-surface px-4 pt-[env(safe-area-inset-top)] lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Open navigation"
              className="shrink-0"
            />
          }
        >
          <MenuIcon />
        </SheetTrigger>
        <SheetContent
          side="left"
          className="border-sidebar-border bg-sidebar-background p-0 text-sidebar-foreground [&>[data-slot=sheet-close]]:top-[calc(0.75rem+env(safe-area-inset-top))] [&>[data-slot=sheet-close]]:text-sidebar-muted [&>[data-slot=sheet-close]]:hover:bg-sidebar-hover [&>[data-slot=sheet-close]]:hover:text-sidebar-foreground [&>[data-slot=sheet-close]]:focus-visible:ring-primary/70 [&>[data-slot=sheet-close]]:focus-visible:ring-offset-sidebar-background"
          style={{ width: "min(88vw, 22rem)", maxWidth: "22rem" }}
        >
          <SheetHeader className="min-h-18 justify-center border-sidebar-border px-4 pt-[calc(1rem+env(safe-area-inset-top))] pb-4 pr-14">
            <SheetTitle className="sr-only">Application navigation</SheetTitle>
            <SheetDescription className="sr-only">
              Navigate between application areas.
            </SheetDescription>
            <Brand variant="sidebar" />
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
            <SidebarNav
              variant="sidebar"
              onNavigate={() => setOpen(false)}
            />
          </div>
          <div className="space-y-3 border-t border-sidebar-border px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <SidebarUser
              variant="sidebar"
              onMenuAction={() => setOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
      <Separator orientation="vertical" className="h-6 self-auto" />
      <Brand />
    </header>
  )
}
