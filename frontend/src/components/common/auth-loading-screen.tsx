import { CircleAlertIcon, LoaderCircleIcon } from "lucide-react"

import { Brand } from "@/components/layout/brand"
import { Button } from "@/components/ui/button"

export function AuthLoadingScreen() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center gap-5 text-center"
      >
        <Brand />
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          <LoaderCircleIcon
            className="size-4 animate-spin motion-reduce:animate-none"
            aria-hidden="true"
          />
          Loading session...
        </span>
      </div>
    </main>
  )
}

export function AuthSessionErrorScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div
        role="alert"
        className="flex max-w-sm flex-col items-center gap-5 text-center"
      >
        <Brand />
        <CircleAlertIcon className="size-6 text-danger" aria-hidden="true" />
        <div className="space-y-1">
          <h1 className="font-semibold text-foreground">
            Unable to restore session
          </h1>
          <p className="text-sm text-muted-foreground">
            We could not verify your session. Check your connection and try
            again.
          </p>
        </div>
        <Button variant="outline" onClick={onRetry}>
          Try again
        </Button>
      </div>
    </main>
  )
}
