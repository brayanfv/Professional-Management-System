"use client"

import { LogOutIcon, MoreVerticalIcon, UserRoundIcon } from "lucide-react"
import { useRouter } from "next/navigation"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { routes } from "@/lib/routes"
import { cn } from "@/lib/utils"
import { getInitials } from "@/lib/name"
import { useAuth } from "@/providers/auth-provider"

export function SidebarUser({ collapsed = false }: { collapsed?: boolean }) {
  const router = useRouter()
  const { signOut, user } = useAuth()

  if (!user) {
    return null
  }

  const initials = getInitials(user.name)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            aria-label="Open user menu"
            className={cn(
              "flex w-full items-center rounded-md p-2 text-left outline-none transition-colors duration-150 ease-out hover:bg-surface-secondary focus-visible:ring-2 focus-visible:ring-primary/25",
              collapsed ? "justify-center" : "gap-3",
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
              <span className="block truncate text-sm font-medium text-foreground">
                {user.name}
              </span>
              <span className="block truncate text-xs text-muted-foreground">
                {user.email}
              </span>
            </span>
            <MoreVerticalIcon
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
          </>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side={collapsed ? "right" : "top"}
        align={collapsed ? "start" : "end"}
        className="w-56"
      >
        <DropdownMenuLabel>
          <span className="block text-foreground">{user.name}</span>
          <span className="block font-normal">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push(routes.profile)}>
          <UserRoundIcon />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => void signOut()}>
          <LogOutIcon />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
