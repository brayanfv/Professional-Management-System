"use client"

import {
  ArrowLeftIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  PowerIcon,
  Trash2Icon,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { ConfirmDialog } from "@/components/common/confirm-dialog"
import { EntityHeader } from "@/components/common/entity-header"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ContactsSection } from "@/features/contacts/components/contacts-section"
import { ProfessionalDetailsSkeleton } from "@/features/professionals/components/professional-details-skeleton"
import { ProfessionalInformation } from "@/features/professionals/components/professional-information"
import { ProfessionalStatusBadge } from "@/features/professionals/components/professional-status-badge"
import {
  useDeleteProfessional,
  useUpdateProfessionalStatus,
} from "@/features/professionals/hooks/use-professional-mutations"
import { useProfessional } from "@/features/professionals/hooks/use-professional"
import { getProfessionalEditHref } from "@/features/professionals/professional-navigation"
import { isNotFoundError } from "@/lib/api/errors"
import { getInitials } from "@/lib/name"
import { cn } from "@/lib/utils"
import { useAppToast } from "@/providers/toast-provider"

type Confirmation = "status" | "delete" | null

function ProfessionalState({
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
              ? "The professional you're looking for does not exist or may have been removed."
              : "Something went wrong while loading this professional."}
          </p>
        </div>
        <div className="flex flex-col justify-center gap-2 sm:flex-row">
          {onRetry ? (
            <Button onClick={onRetry}>Try again</Button>
          ) : null}
          <Link
            href={returnHref}
            className={buttonVariants({ variant: onRetry ? "outline" : "default" })}
          >
            Back to professionals
          </Link>
        </div>
      </div>
    </div>
  )
}

export function InvalidProfessionalState({ returnHref }: { returnHref: string }) {
  return <ProfessionalState kind="not-found" returnHref={returnHref} />
}

export function ProfessionalDetailsContent({
  professionalId,
  returnHref,
}: {
  professionalId: number
  returnHref: string
}) {
  const router = useRouter()
  const toast = useAppToast()
  const professionalQuery = useProfessional(professionalId)
  const statusMutation = useUpdateProfessionalStatus(professionalId)
  const deleteMutation = useDeleteProfessional(professionalId)
  const [confirmation, setConfirmation] = useState<Confirmation>(null)

  if (professionalQuery.isPending) {
    return <ProfessionalDetailsSkeleton />
  }

  if (professionalQuery.isError) {
    const notFound = isNotFoundError(
      professionalQuery.error,
      "PROFESSIONAL_NOT_FOUND",
    )

    return (
      <ProfessionalState
        kind={notFound ? "not-found" : "error"}
        returnHref={returnHref}
        onRetry={notFound ? undefined : () => void professionalQuery.refetch()}
      />
    )
  }

  const professional = professionalQuery.data
  const targetStatus = professional.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
  const isDeactivating = targetStatus === "INACTIVE"
  const employment = [professional.position?.name, professional.department?.name]
    .filter(Boolean)
    .join(" · ")

  async function handleStatusChange() {
    try {
      await statusMutation.mutateAsync(targetStatus)
      toast.success(
        isDeactivating
          ? "Professional deactivated successfully."
          : "Professional reactivated successfully.",
      )
      setConfirmation(null)
    } catch {
      toast.error("Unable to update this professional's status. Please try again.")
    }
  }

  async function handleDelete() {
    try {
      await deleteMutation.mutateAsync()
      toast.success("Professional deleted successfully.")
      router.replace(returnHref)
    } catch {
      toast.error("Unable to delete this professional. Please try again.")
    }
  }

  return (
    <div className="space-y-6">
      <Link
        href={returnHref}
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "-ml-3 w-fit text-muted-foreground",
        )}
      >
        <ArrowLeftIcon aria-hidden="true" />
        Back to professionals
      </Link>

      <EntityHeader
        avatar={
          <Avatar size="lg">
            <AvatarFallback>{getInitials(professional.name)}</AvatarFallback>
          </Avatar>
        }
        title={professional.name}
        subtitle={employment || "No employment assignment"}
        status={<ProfessionalStatusBadge status={professional.status} />}
        primaryAction={
          <Link
            href={getProfessionalEditHref(professional.id, returnHref)}
            className={buttonVariants({ variant: "outline" })}
          >
            <PencilIcon aria-hidden="true" />
            <span className="hidden sm:inline">Edit professional</span>
            <span className="sm:hidden">Edit</span>
          </Link>
        }
        secondaryActions={
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Professional actions"
                />
              }
            >
              <EllipsisVerticalIcon aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => setConfirmation("status")}>
                <PowerIcon aria-hidden="true" />
                {isDeactivating
                  ? "Deactivate professional"
                  : "Reactivate professional"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setConfirmation("delete")}
              >
                <Trash2Icon aria-hidden="true" />
                Delete professional
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      <ProfessionalInformation professional={professional} />

      <ContactsSection
        professionalId={professional.id}
        professionalName={professional.name}
      />

      <ConfirmDialog
        open={confirmation === "status"}
        onOpenChange={(open) => {
          if (!open) setConfirmation(null)
        }}
        title={
          isDeactivating
            ? "Deactivate professional?"
            : "Reactivate professional?"
        }
        description={
          isDeactivating
            ? `${professional.name} will no longer appear as an active professional. You can reactivate this professional later.`
            : `${professional.name} will return to active status.`
        }
        confirmLabel={isDeactivating ? "Deactivate" : "Reactivate"}
        loadingLabel={isDeactivating ? "Deactivating..." : "Reactivating..."}
        loading={statusMutation.isPending}
        onConfirm={() => void handleStatusChange()}
      />

      <ConfirmDialog
        open={confirmation === "delete"}
        onOpenChange={(open) => {
          if (!open) setConfirmation(null)
        }}
        title="Delete professional?"
        description={`${professional.name} and all associated contacts will be permanently deleted. This action cannot be undone.`}
        confirmLabel="Delete professional"
        loadingLabel="Deleting..."
        variant="destructive"
        loading={deleteMutation.isPending}
        onConfirm={() => void handleDelete()}
      />
    </div>
  )
}
