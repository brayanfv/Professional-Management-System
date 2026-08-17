import { cn } from "@/lib/utils"

export function PageContainer({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[100rem] space-y-6 px-4 py-6 sm:px-6 lg:py-8 2xl:px-8",
        className,
      )}
      {...props}
    />
  )
}
