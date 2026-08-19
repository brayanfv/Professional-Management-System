"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeftIcon, LoaderCircleIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

import {
  Combobox,
  type ComboboxOption,
} from "@/components/common/combobox"
import { ConfirmDialog } from "@/components/common/confirm-dialog"
import { FormField, FormLabel } from "@/components/common/form-field"
import { FormMessage } from "@/components/common/form-message"
import { FormSection } from "@/components/common/form-section"
import { PageHeader } from "@/components/common/page-header"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDepartments } from "@/features/departments/hooks/use-departments"
import { usePositions } from "@/features/positions/hooks/use-positions"
import {
  useCreateProfessional,
  useUpdateProfessional,
} from "@/features/professionals/hooks/use-professional-mutations"
import { getProfessionalDetailsHref } from "@/features/professionals/professional-navigation"
import { ApiClientError } from "@/lib/api/client"
import { hasApiErrorCode } from "@/lib/api/errors"
import { cn } from "@/lib/utils"
import { useAppToast } from "@/providers/toast-provider"
import type { ProfessionalDetails } from "@/types/professional"

function isValidDateOnly(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return false

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(Date.UTC(year, month - 1, day))

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  )
}

function getLocalDateString(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const professionalSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Full name is required.")
    .max(150, "Full name must be 150 characters or fewer."),
  birthDate: z
    .string()
    .refine(
      (value) => !value || isValidDateOnly(value),
      "Enter a valid birth date.",
    )
    .refine(
      (value) => !value || value < getLocalDateString(new Date()),
      "Birth date must be in the past.",
    ),
  departmentId: z.number().int().positive().nullable(),
  positionId: z.number().int().positive().nullable(),
})

type ProfessionalFormValues = z.infer<typeof professionalSchema>

type ProfessionalFormProps = {
  mode: "create" | "edit"
  initialData?: ProfessionalDetails
  professionalId?: number
  returnHref: string
  cancelHref: string
}

const fieldNames = [
  "name",
  "birthDate",
  "departmentId",
  "positionId",
] as const

type ProfessionalFieldName = (typeof fieldNames)[number]

function isProfessionalFieldName(value: string): value is ProfessionalFieldName {
  return fieldNames.includes(value as ProfessionalFieldName)
}

function buildOptions(
  data: Array<{ id: number; name: string }> | undefined,
  current: { id: number; name: string } | null | undefined,
): ComboboxOption[] {
  const options = (data ?? []).map((item) => ({
    value: String(item.id),
    label: item.name,
  }))

  if (current && !options.some((option) => option.value === String(current.id))) {
    options.unshift({ value: String(current.id), label: current.name })
  }

  return options
}

export function ProfessionalForm({
  mode,
  initialData,
  professionalId,
  returnHref,
  cancelHref,
}: ProfessionalFormProps) {
  const router = useRouter()
  const toast = useAppToast()
  const departments = useDepartments()
  const positions = usePositions()
  const createMutation = useCreateProfessional()
  const updateMutation = useUpdateProfessional(professionalId ?? 0)
  const [formError, setFormError] = useState<string | null>(null)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)
  const isCreate = mode === "create"

  const departmentOptions = useMemo(
    () => buildOptions(departments.data, initialData?.department),
    [departments.data, initialData?.department],
  )
  const positionOptions = useMemo(
    () => buildOptions(positions.data, initialData?.position),
    [positions.data, initialData?.position],
  )

  const {
    control,
    register,
    handleSubmit,
    getValues,
    reset,
    setError,
    setFocus,
    setValue,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ProfessionalFormValues>({
    resolver: zodResolver(professionalSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      birthDate: initialData?.birthDate ?? "",
      departmentId: initialData?.department?.id ?? null,
      positionId: initialData?.position?.id ?? null,
    },
  })

  const isPending =
    isSubmitting || createMutation.isPending || updateMutation.isPending

  useEffect(() => {
    if (!isDirty || isPending) return

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault()
      event.returnValue = ""
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [isDirty, isPending])

  function requestNavigation(
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) {
    if (isPending) {
      event.preventDefault()
      return
    }

    if (isDirty) {
      event.preventDefault()
      setPendingNavigation(href)
    }
  }

  function discardChanges() {
    if (!pendingNavigation) return

    const href = pendingNavigation
    reset(getValues())
    setPendingNavigation(null)
    router.push(href)
  }

  function setBackendFieldErrors(error: ApiClientError) {
    const fields = error.details.fields
    if (!fields) return false

    let firstField: ProfessionalFieldName | null = null
    let hasUnknownField = false

    for (const [field, message] of Object.entries(fields)) {
      if (isProfessionalFieldName(field)) {
        setError(field, { type: "server", message })
        firstField ??= field
      } else {
        hasUnknownField = true
      }
    }

    if (firstField) {
      setFocus(firstField)
    }
    if (hasUnknownField || !firstField) {
      setFormError("Check the professional information and try again.")
    }

    return Boolean(firstField) || hasUnknownField
  }

  async function onSubmit(values: ProfessionalFormValues) {
    setFormError(null)
    const payload = {
      name: values.name.trim(),
      birthDate: values.birthDate || null,
      departmentId: values.departmentId,
      positionId: values.positionId,
    }

    try {
      const professional = isCreate
        ? await createMutation.mutateAsync(payload)
        : await updateMutation.mutateAsync(payload)

      reset(values)
      toast.success(
        isCreate
          ? "Professional created successfully."
          : "Professional updated successfully.",
      )
      router.replace(getProfessionalDetailsHref(professional.id, returnHref))
    } catch (error) {
      if (hasApiErrorCode(error, "DEPARTMENT_NOT_FOUND")) {
        setValue("departmentId", null, { shouldDirty: true })
        setError("departmentId", {
          type: "server",
          message:
            "The selected department is no longer available. Choose another department.",
        })
        void departments.refetch()
        return
      }

      if (hasApiErrorCode(error, "POSITION_NOT_FOUND")) {
        setValue("positionId", null, { shouldDirty: true })
        setError("positionId", {
          type: "server",
          message:
            "The selected position is no longer available. Choose another position.",
        })
        void positions.refetch()
        return
      }

      if (error instanceof ApiClientError && setBackendFieldErrors(error)) {
        return
      }

      setFormError(
        "Unable to save professional. Your changes have not been saved.",
      )
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5">
      <Link
        href={cancelHref}
        onClick={(event) => requestNavigation(event, cancelHref)}
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "-ml-3 w-fit text-muted-foreground",
          isPending && "pointer-events-none opacity-60",
        )}
        aria-disabled={isPending || undefined}
      >
        <ArrowLeftIcon aria-hidden="true" />
        {isCreate ? "Back to professionals" : "Back to professional details"}
      </Link>

      <PageHeader
        title={isCreate ? "Create professional" : "Edit professional"}
        description={
          isCreate
            ? "Add a new person to your organization."
            : "Update professional information."
        }
      />

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {formError ? (
          <div
            className="rounded-md border border-danger/25 bg-danger-soft px-4 py-3 text-sm text-danger-foreground"
            role="alert"
          >
            {formError}
          </div>
        ) : null}

        <FormSection
          title="Personal information"
          description="Basic information about the professional."
        >
          <div className="grid gap-4 md:grid-cols-3 md:gap-5">
            <FormField
              className="md:col-span-2"
              invalid={Boolean(errors.name)}
              disabled={isPending}
            >
              <FormLabel htmlFor="professional-name" required>
                Full name
              </FormLabel>
              <Input
                id="professional-name"
                autoComplete="name"
                placeholder="Enter professional's full name"
                maxLength={150}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "professional-name-error" : undefined}
                disabled={isPending}
                {...register("name")}
              />
              <FormMessage id="professional-name-error">
                {errors.name?.message}
              </FormMessage>
            </FormField>

            <FormField invalid={Boolean(errors.birthDate)} disabled={isPending}>
              <FormLabel htmlFor="professional-birth-date" optional>
                Birth date
              </FormLabel>
              <Input
                id="professional-birth-date"
                type="date"
                aria-invalid={Boolean(errors.birthDate)}
                aria-describedby={
                  errors.birthDate ? "professional-birth-date-error" : undefined
                }
                disabled={isPending}
                {...register("birthDate")}
              />
              <FormMessage id="professional-birth-date-error">
                {errors.birthDate?.message}
              </FormMessage>
            </FormField>
          </div>
        </FormSection>

        <FormSection
          title="Organization"
          description="Define where this professional belongs."
        >
          <div className="grid gap-4 md:grid-cols-2 md:gap-5">
            <Controller
              control={control}
              name="departmentId"
              render={({ field }) => (
                <FormField
                  invalid={Boolean(errors.departmentId)}
                  disabled={isPending || departments.isPending}
                >
                  <FormLabel htmlFor="professional-department" optional>
                    Department
                  </FormLabel>
                  <Combobox
                    id="professional-department"
                    options={departmentOptions}
                    value={field.value === null ? null : String(field.value)}
                    onValueChange={(value) =>
                      field.onChange(value === null ? null : Number(value))
                    }
                    placeholder="Departments"
                    searchPlaceholder="Select department"
                    emptyMessage="No departments found."
                    loading={departments.isPending}
                    disabled={isPending || departments.isError}
                    invalid={Boolean(errors.departmentId)}
                    describedBy={
                      errors.departmentId
                        ? "professional-department-error"
                        : departments.isError
                          ? "professional-department-load-error"
                          : undefined
                    }
                    clearLabel="Clear department"
                  />
                  {departments.isError ? (
                    <div
                      id="professional-department-load-error"
                      className="flex items-center justify-between gap-2 text-xs text-danger-foreground"
                      role="alert"
                    >
                      <span>Unable to load departments.</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => void departments.refetch()}
                      >
                        Try again
                      </Button>
                    </div>
                  ) : null}
                  <FormMessage id="professional-department-error">
                    {errors.departmentId?.message}
                  </FormMessage>
                </FormField>
              )}
            />

            <Controller
              control={control}
              name="positionId"
              render={({ field }) => (
                <FormField
                  invalid={Boolean(errors.positionId)}
                  disabled={isPending || positions.isPending}
                >
                  <FormLabel htmlFor="professional-position" optional>
                    Position
                  </FormLabel>
                  <Combobox
                    id="professional-position"
                    options={positionOptions}
                    value={field.value === null ? null : String(field.value)}
                    onValueChange={(value) =>
                      field.onChange(value === null ? null : Number(value))
                    }
                    placeholder="Positions"
                    searchPlaceholder="Select position"
                    emptyMessage="No positions found."
                    loading={positions.isPending}
                    disabled={isPending || positions.isError}
                    invalid={Boolean(errors.positionId)}
                    describedBy={
                      errors.positionId
                        ? "professional-position-error"
                        : positions.isError
                          ? "professional-position-load-error"
                          : undefined
                    }
                    clearLabel="Clear position"
                  />
                  {positions.isError ? (
                    <div
                      id="professional-position-load-error"
                      className="flex items-center justify-between gap-2 text-xs text-danger-foreground"
                      role="alert"
                    >
                      <span>Unable to load positions.</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => void positions.refetch()}
                      >
                        Try again
                      </Button>
                    </div>
                  ) : null}
                  <FormMessage id="professional-position-error">
                    {errors.positionId?.message}
                  </FormMessage>
                </FormField>
              )}
            />
          </div>
        </FormSection>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href={cancelHref}
            onClick={(event) => requestNavigation(event, cancelHref)}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-full sm:w-auto",
              isPending && "pointer-events-none opacity-60",
            )}
            aria-disabled={isPending || undefined}
          >
            Cancel
          </Link>
          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={isPending}
            aria-busy={isPending}
          >
            {isPending ? (
              <LoaderCircleIcon className="animate-spin motion-reduce:animate-none" />
            ) : null}
            {isPending
              ? isCreate
                ? "Creating..."
                : "Saving..."
              : isCreate
                ? "Create professional"
                : "Save changes"}
          </Button>
        </div>
      </form>

      <ConfirmDialog
        open={pendingNavigation !== null}
        onOpenChange={(open) => {
          if (!open) setPendingNavigation(null)
        }}
        title="Discard changes?"
        description="You have unsaved changes. If you leave this page, your changes will be lost."
        confirmLabel="Discard changes"
        cancelLabel="Keep editing"
        variant="destructive"
        onConfirm={discardChanges}
      />
    </div>
  )
}
