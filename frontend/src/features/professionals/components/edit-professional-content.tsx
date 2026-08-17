"use client"

import Link from "next/link"

import { Button, buttonVariants } from "@/components/ui/button"
import { ProfessionalForm } from "@/features/professionals/components/professional-form"
import { ProfessionalFormSkeleton } from "@/features/professionals/components/professional-form-skeleton"
import { useProfessional } from "@/features/professionals/hooks/use-professional"
import { isNotFoundError } from "@/lib/api/errors"

function EditState({
  kind,
  returnHref,
  onRetry,
}: {
  kind: "not-found" | "error"
  returnHref: string
  onRetry?: () => void
}) {
  const notFound = kind === "not-found"

  return (
    <div className="flex min-h-[28rem] items-center justify-center">
      <div className="max-w-md space-y-5 text-center" role={notFound ? undefined : "alert"}>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {notFound ? "Professional not found" : "Unable to load professional"}
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            {notFound
              ? "The professional you're trying to edit does not exist or may have been removed."
              : "Something went wrong while preparing this form."}
          </p>
        </div>
        <div className="flex flex-col justify-center gap-2 sm:flex-row">
          {onRetry ? <Button onClick={onRetry}>Try again</Button> : null}
          <Link
            href={returnHref}
            className={buttonVariants({
              variant: onRetry ? "outline" : "default",
            })}
          >
            Back to professionals
          </Link>
        </div>
      </div>
    </div>
  )
}

export function InvalidEditProfessionalState({
  returnHref,
}: {
  returnHref: string
}) {
  return <EditState kind="not-found" returnHref={returnHref} />
}

export function EditProfessionalContent({
  professionalId,
  returnHref,
  cancelHref,
}: {
  professionalId: number
  returnHref: string
  cancelHref: string
}) {
  const professionalQuery = useProfessional(professionalId)

  if (professionalQuery.isPending) {
    return <ProfessionalFormSkeleton />
  }

  if (professionalQuery.isError) {
    const notFound = isNotFoundError(
      professionalQuery.error,
      "PROFESSIONAL_NOT_FOUND",
    )

    return (
      <EditState
        kind={notFound ? "not-found" : "error"}
        returnHref={returnHref}
        onRetry={notFound ? undefined : () => void professionalQuery.refetch()}
      />
    )
  }

  return (
    <ProfessionalForm
      mode="edit"
      professionalId={professionalId}
      initialData={professionalQuery.data}
      returnHref={returnHref}
      cancelHref={cancelHref}
    />
  )
}
