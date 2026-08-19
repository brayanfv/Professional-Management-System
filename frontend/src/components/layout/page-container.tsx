import { cn } from "@/lib/utils"

export function PageContainer({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mx-auto min-w-0 w-full max-w-[100rem] space-y-6 px-4 pt-6 pb-10 sm:px-6 sm:pb-12 lg:pt-8 2xl:px-8",
        className,
      )}
      {...props}
    />
  )
}
