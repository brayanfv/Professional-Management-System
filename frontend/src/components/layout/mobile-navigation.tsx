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
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-surface px-4 lg:hidden">
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
        <SheetContent side="left" className="max-w-80 p-0 sm:max-w-80">
          <SheetHeader className="h-18 justify-center p-4 pr-14">
            <SheetTitle className="sr-only">Application navigation</SheetTitle>
            <SheetDescription className="sr-only">
              Navigate between application areas.
            </SheetDescription>
            <Brand />
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
            <SidebarNav onNavigate={() => setOpen(false)} />
          </div>
          <div className="space-y-3 border-t border-border p-4">
            <SidebarUser />
          </div>
        </SheetContent>
      </Sheet>
      <Separator orientation="vertical" className="h-6 self-auto" />
      <Brand />
    </header>
  )
}
