"use client"

import { Toast } from "@base-ui/react/toast"
import { CheckCircle2Icon, CircleAlertIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function ToastList() {
  const { toasts } = Toast.useToastManager()

  return toasts.map((toast) => {
    const isError = toast.type === "error"
    const Icon = isError ? CircleAlertIcon : CheckCircle2Icon

    return (
      <Toast.Root
        key={toast.id}
        toast={toast}
        swipeDirection="right"
        className={cn(
          "relative w-full rounded-lg border bg-surface text-foreground shadow-dropdown outline-none transition-[transform,opacity] duration-200 ease-out [transform:translateX(var(--toast-swipe-movement-x))] data-ending-style:translate-x-4 data-ending-style:opacity-0 data-limited:hidden data-starting-style:translate-y-2 data-starting-style:opacity-0",
          isError ? "border-danger/25" : "border-success/25",
        )}
      >
        <Toast.Content className="flex items-start gap-3 p-4">
          <Icon
            className={cn(
              "mt-0.5 size-5 shrink-0",
              isError ? "text-danger" : "text-success",
            )}
            aria-hidden="true"
          />
          <div className="min-w-0 flex-1 space-y-0.5">
            <Toast.Title className="text-sm font-semibold" />
            <Toast.Description className="text-sm text-muted-foreground" />
          </div>
          <Toast.Close className="flex size-10 shrink-0 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-surface-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/25 sm:size-8">
            <XIcon className="size-4" aria-hidden="true" />
            <span className="sr-only">Dismiss notification</span>
          </Toast.Close>
        </Toast.Content>
      </Toast.Root>
    )
  })
}

export function AppToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <Toast.Provider timeout={5000} limit={3}>
      {children}
      <Toast.Portal>
        <Toast.Viewport className="fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-[100] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3 outline-none sm:right-6 sm:bottom-6">
          <ToastList />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  )
}

export function useAppToast() {
  const manager = Toast.useToastManager()

  return {
    success(description: string) {
      manager.add({
        title: "Success",
        description,
        type: "success",
        priority: "low",
      })
    },
    error(description: string, title = "Something went wrong") {
      manager.add({
        title,
        description,
        type: "error",
        priority: "high",
      })
    },
  }
}
