import type { LucideIcon } from "lucide-react"
import {
  BriefcaseBusinessIcon,
  Building2Icon,
  LayoutDashboardIcon,
  LogOutIcon,
  UserRoundIcon,
  UsersIcon,
} from "lucide-react"

import { routes } from "@/lib/routes"

export type NavigationItem = {
  label: string
  icon: LucideIcon
  href?: string
  action?: "logout"
  disabled?: boolean
}

export type NavigationSection = {
  label: string
  items: NavigationItem[]
}

export const navigationSections: NavigationSection[] = [
  {
    label: "Overview",
    items: [
      {
        label: "Dashboard",
        href: routes.dashboard,
        icon: LayoutDashboardIcon,
      },
    ],
  },
  {
    label: "Management",
    items: [
      {
        label: "Professionals",
        href: routes.professionals.list,
        icon: UsersIcon,
      },
      {
        label: "Departments",
        href: routes.departments,
        icon: Building2Icon,
      },
      {
        label: "Positions",
        href: routes.positions,
        icon: BriefcaseBusinessIcon,
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        label: "Profile",
        href: routes.profile,
        icon: UserRoundIcon,
      },
      {
        label: "Logout",
        icon: LogOutIcon,
        action: "logout",
      },
    ],
  },
]

export function isNavigationItemActive(
  pathname: string,
  item: NavigationItem,
) {
  if (!item.href) {
    return false
  }

  if (item.href === routes.dashboard || item.href === routes.profile) {
    return pathname === item.href
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`)
}
