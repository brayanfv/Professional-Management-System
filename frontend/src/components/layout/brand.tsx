import { cn } from "@/lib/utils"

type BrandProps = {
  collapsed?: boolean
  className?: string
  variant?: "default" | "sidebar"
}

export function Brand({
  collapsed = false,
  className,
  variant = "default",
}: BrandProps) {
  const isSidebar = variant === "sidebar"

  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-3",
        collapsed && "justify-center",
        className,
      )}
    >
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-md text-sm font-semibold",
          isSidebar
            ? "size-10 bg-primary text-primary-foreground"
            : "size-9 bg-primary-soft text-primary",
        )}
      >
        PM
      </span>
      {!collapsed && (
        <span
          className={cn(
            "min-w-0 text-sm leading-4 font-semibold",
            isSidebar ? "text-sidebar-foreground" : "text-foreground",
          )}
        >
          <span className="block">Professional</span>
          <span className="block">Management</span>
        </span>
      )}
    </div>
  )
}
