"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircleIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import { FormField, FormLabel } from "@/components/common/form-field"
import { FormMessage } from "@/components/common/form-message"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SheetFooter } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import type { ManagementEntity } from "@/features/management/components/management-entity-list"
import {
  managementEntitySchema,
  type ManagementEntityFormValues,
} from "@/features/management/management-entity-schema"
import { ApiClientError } from "@/lib/api/client"
import { hasApiErrorCode } from "@/lib/api/errors"
import { useAppToast } from "@/providers/toast-provider"
import type { ManagementEntityRequest } from "@/types/management"

export type ManagementFeatureFormProps = {
  mode: "create" | "edit"
  entity?: ManagementEntity
  onSave: (payload: ManagementEntityRequest) => Promise<ManagementEntity>
  isPending: boolean
  onSuccess: () => void
  onUnavailable: () => void
  onRequestClose: () => void
  onDirtyChange: (dirty: boolean) => void
  onPendingChange: (pending: boolean) => void
}

export function ManagementEntityForm({
  mode,
  entity,
  entityName,
  duplicateCode,
  notFoundCode,
  duplicateMessage,
  unavailableMessage,
  createSuccessMessage,
  updateSuccessMessage,
  onSave,
  isPending: mutationPending,
  onSuccess,
  onUnavailable,
  onRequestClose,
  onDirtyChange,
  onPendingChange,
}: ManagementFeatureFormProps & {
  entityName: string
  duplicateCode: string
  notFoundCode: string
  duplicateMessage: string
  unavailableMessage: string
  createSuccessMessage: string
  updateSuccessMessage: string
}) {
  const toast = useAppToast()
  const [formError, setFormError] = useState<string | null>(null)
  const isCreate = mode === "create"
  const {
    register,
    handleSubmit,
    reset,
    setError,
    setFocus,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ManagementEntityFormValues>({
    resolver: zodResolver(managementEntitySchema),
    defaultValues: {
      name: entity?.name ?? "",
      description: entity?.description ?? "",
    },
  })
  const isPending = isSubmitting || mutationPending

  useEffect(() => onDirtyChange(isDirty), [isDirty, onDirtyChange])
  useEffect(() => onPendingChange(isPending), [isPending, onPendingChange])

  async function onSubmit(values: ManagementEntityFormValues) {
    setFormError(null)
    const payload = {
      name: values.name.trim(),
      description: values.description.trim() || null,
    }

    try {
      await onSave(payload)
      reset(values)
      toast.success(isCreate ? createSuccessMessage : updateSuccessMessage)
      onSuccess()
    } catch (error) {
      if (hasApiErrorCode(error, duplicateCode)) {
        setError("name", { type: "server", message: duplicateMessage })
        setFocus("name")
        return
      }

      if (hasApiErrorCode(error, notFoundCode)) {
        toast.error(unavailableMessage)
        onUnavailable()
        return
      }

      if (error instanceof ApiClientError && error.details.fields) {
        let firstField: "name" | "description" | null = null
        let unknownField = false

        for (const [field, message] of Object.entries(error.details.fields)) {
          if (field === "name" || field === "description") {
            setError(field, { type: "server", message })
            firstField ??= field
          } else {
            unknownField = true
          }
        }

        if (firstField) setFocus(firstField)
        if (!firstField || unknownField) {
          setFormError(`Check the ${entityName} information and try again.`)
        }
        return
      }

      setFormError(`Unable to save ${entityName}. Your changes have not been saved.`)
    }
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex min-h-0 flex-1 flex-col"
    >
      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5">
        {formError ? (
          <div
            className="rounded-md border border-danger/25 bg-danger-soft px-3 py-2.5 text-sm text-danger-foreground"
            role="alert"
          >
            {formError}
          </div>
        ) : null}

        <FormField invalid={Boolean(errors.name)} disabled={isPending}>
          <FormLabel htmlFor={`${entityName}-name`} required>
            Name
          </FormLabel>
          <Input
            id={`${entityName}-name`}
            placeholder={`Enter ${entityName} name`}
            maxLength={120}
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${entityName}-name-error` : undefined}
            disabled={isPending}
            {...register("name")}
          />
          <FormMessage id={`${entityName}-name-error`}>
            {errors.name?.message}
          </FormMessage>
        </FormField>

        <FormField invalid={Boolean(errors.description)} disabled={isPending}>
          <FormLabel htmlFor={`${entityName}-description`} optional>
            Description
          </FormLabel>
          <Textarea
            id={`${entityName}-description`}
            placeholder={`Describe this ${entityName}`}
            maxLength={500}
            aria-invalid={Boolean(errors.description)}
            aria-describedby={
              errors.description ? `${entityName}-description-error` : undefined
            }
            disabled={isPending}
            {...register("description")}
          />
          <FormMessage id={`${entityName}-description-error`}>
            {errors.description?.message}
          </FormMessage>
        </FormField>
      </div>

      <SheetFooter className="px-5 py-4 sm:px-6 [&>button]:w-full sm:[&>button]:w-auto">
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={onRequestClose}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending} aria-busy={isPending}>
          {isPending ? (
            <LoaderCircleIcon className="animate-spin motion-reduce:animate-none" />
          ) : null}
          {isPending
            ? isCreate
              ? "Creating..."
              : "Saving..."
            : isCreate
              ? `Create ${entityName}`
              : "Save changes"}
        </Button>
      </SheetFooter>
    </form>
  )
}
