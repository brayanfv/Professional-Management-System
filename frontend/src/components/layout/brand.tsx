import { cn } from "@/lib/utils"

type BrandProps = {
  collapsed?: boolean
  className?: string
}

export function Brand({ collapsed = false, className }: BrandProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-3",
        collapsed && "justify-center",
        className,
      )}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary-soft text-sm font-semibold text-primary">
        PM
      </span>
      {!collapsed && (
        <span className="min-w-0 text-sm leading-4 font-semibold text-foreground">
          <span className="block">Professional</span>
          <span className="block">Management</span>
        </span>
      )}
    </div>
  )
}
