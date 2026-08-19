"use client"

import { useRef } from "react"
import { LogOutIcon, MoreVerticalIcon, UserRoundIcon } from "lucide-react"
import { useRouter } from "next/navigation"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { routes } from "@/lib/routes"
import { cn } from "@/lib/utils"
import { getInitials } from "@/lib/name"
import { useAuth } from "@/providers/auth-provider"

type SidebarUserProps = {
  collapsed?: boolean
  variant?: "default" | "sidebar"
  onMenuOpenChange?: (open: boolean) => void
  onMenuAction?: (interaction: "pointer" | "keyboard") => void
}

export function SidebarUser({
  collapsed = false,
  variant = "default",
  onMenuOpenChange,
  onMenuAction,
}: SidebarUserProps) {
  const router = useRouter()
  const { signOut, user } = useAuth()
  const suppressPointerFocusRestore = useRef(false)

  if (!user) {
    return null
  }

  const initials = getInitials(user.name)
  const isSidebar = variant === "sidebar"

  function handleMenuAction(
    interaction: "pointer" | "keyboard",
    action: () => void,
  ) {
    suppressPointerFocusRestore.current = interaction === "pointer"
    onMenuAction?.(interaction)
    action()
  }

  return (
    <DropdownMenu
      onOpenChange={(open) => {
        if (open) {
          suppressPointerFocusRestore.current = false
        }

        onMenuOpenChange?.(open)
      }}
    >
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            aria-label="Open account menu"
            className={cn(
              "flex w-full items-center rounded-lg p-2 text-left outline-none transition-[background-color,color] duration-150 ease-out",
              isSidebar
                ? "text-sidebar-foreground hover:bg-sidebar-hover focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar-background"
                : "hover:bg-surface-secondary focus-visible:ring-2 focus-visible:ring-primary/25",
              collapsed ? "min-h-11 justify-center" : "min-h-12 gap-3",
            )}
          />
        }
      >
        <Avatar size="sm">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        {!collapsed && (
          <>
            <span className="min-w-0 flex-1">
              <span
                className={cn(
                  "block truncate text-sm font-medium",
                  isSidebar ? "text-sidebar-foreground" : "text-foreground",
                )}
              >
                {user.name}
              </span>
              <span
                className={cn(
                  "block truncate text-xs",
                  isSidebar ? "text-sidebar-muted" : "text-muted-foreground",
                )}
              >
                {user.email}
              </span>
            </span>
            <MoreVerticalIcon
              className={cn(
                "size-4 shrink-0",
                isSidebar ? "text-sidebar-muted" : "text-muted-foreground",
              )}
              aria-hidden="true"
            />
          </>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        finalFocus={() =>
          suppressPointerFocusRestore.current ? false : true
        }
        side={collapsed ? "right" : "top"}
        align={collapsed ? "start" : "end"}
        className="w-56"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <span className="block truncate text-foreground">{user.name}</span>
            <span className="block truncate font-normal">{user.email}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(event) => {
              handleMenuAction(
                event.detail === 0 ? "keyboard" : "pointer",
                () => router.push(routes.profile),
              )
            }}
          >
            <UserRoundIcon />
            Profile
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={(event) => {
            handleMenuAction(
              event.detail === 0 ? "keyboard" : "pointer",
              () => void signOut(),
            )
          }}
        >
          <LogOutIcon />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
