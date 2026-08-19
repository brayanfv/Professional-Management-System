"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircleIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { z } from "zod"

import { FormField, FormLabel } from "@/components/common/form-field"
import { FormMessage } from "@/components/common/form-message"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SheetFooter } from "@/components/ui/sheet"
import { getContactTypeConfig } from "@/features/contacts/contact-utils"
import {
  useCreateContact,
  useUpdateContact,
} from "@/features/contacts/hooks/use-contact-mutations"
import { ApiClientError } from "@/lib/api/client"
import { hasApiErrorCode } from "@/lib/api/errors"
import { useAppToast } from "@/providers/toast-provider"
import type { Contact, ContactType } from "@/types/contact"

const contactSchema = z
  .object({
    type: z.enum(["EMAIL", "PHONE", "MOBILE", "OTHER"]),
    value: z
      .string()
      .trim()
      .min(1, "Value is required.")
      .max(255, "Value must be 255 characters or fewer."),
    label: z
      .string()
      .trim()
      .max(80, "Label must be 80 characters or fewer."),
  })
  .superRefine((values, context) => {
    if (
      values.type === "EMAIL" &&
      !z.string().email().safeParse(values.value).success
    ) {
      context.addIssue({
        code: "custom",
        path: ["value"],
        message: "Enter a valid email address.",
      })
    }
  })

type ContactFormValues = z.infer<typeof contactSchema>

type ContactFormProps = {
  mode: "create" | "edit"
  professionalId: number
  contact?: Contact
  onSuccess: () => void
  onCancel: () => void
  onContactUnavailable: () => void
  onPendingChange: (pending: boolean) => void
  onDirtyChange: (dirty: boolean) => void
}

export function ContactForm({
  mode,
  professionalId,
  contact,
  onSuccess,
  onCancel,
  onContactUnavailable,
  onPendingChange,
  onDirtyChange,
}: ContactFormProps) {
  const toast = useAppToast()
  const createContact = useCreateContact(professionalId)
  const updateContact = useUpdateContact(professionalId)
  const [formError, setFormError] = useState<string | null>(null)
  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      type: contact?.type ?? "EMAIL",
      value: contact?.value ?? "",
      label: contact?.label ?? "",
    },
  })

  const selectedType = useWatch({ control, name: "type" })
  const isPending =
    isSubmitting || createContact.isPending || updateContact.isPending
  const isCreate = mode === "create"

  useEffect(() => {
    onPendingChange(isPending)
  }, [isPending, onPendingChange])

  useEffect(() => {
    onDirtyChange(isDirty)
  }, [isDirty, onDirtyChange])

  async function onSubmit(values: ContactFormValues) {
    setFormError(null)
    onPendingChange(true)
    const payload = {
      type: values.type,
      value: values.value.trim(),
      label: values.label.trim() || undefined,
    }

    try {
      if (isCreate) {
        await createContact.mutateAsync(payload)
        toast.success("Contact added successfully.")
      } else if (contact) {
        await updateContact.mutateAsync({ contactId: contact.id, payload })
        toast.success("Contact updated successfully.")
      }
      onSuccess()
    } catch (error) {
      if (hasApiErrorCode(error, "CONTACT_NOT_FOUND")) {
        toast.error("This contact is no longer available.")
        onContactUnavailable()
        return
      }

      if (error instanceof ApiClientError && error.details.fields) {
        for (const [field, message] of Object.entries(error.details.fields)) {
          if (field === "type" || field === "value" || field === "label") {
            setError(field, { message })
          }
        }
        setFormError("Check the contact details and try again.")
        return
      }

      setFormError("Unable to save contact. Your changes have not been saved.")
    } finally {
      onPendingChange(false)
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

        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <FormField invalid={Boolean(errors.type)} disabled={isPending}>
              <FormLabel htmlFor="contact-type" required>
                Type
              </FormLabel>
              <Select
                value={field.value}
                onValueChange={(value) => {
                  if (value) field.onChange(value as ContactType)
                }}
                disabled={isPending}
              >
                <SelectTrigger
                  id="contact-type"
                  aria-invalid={Boolean(errors.type)}
                  aria-describedby={errors.type ? "contact-type-error" : undefined}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["EMAIL", "PHONE", "MOBILE", "OTHER"] as const).map(
                    (type) => (
                      <SelectItem key={type} value={type}>
                        {getContactTypeConfig(type).label}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
              <FormMessage id="contact-type-error">
                {errors.type?.message}
              </FormMessage>
            </FormField>
          )}
        />

        <FormField invalid={Boolean(errors.value)} disabled={isPending}>
          <FormLabel htmlFor="contact-value" required>
            Value
          </FormLabel>
          <Input
            id="contact-value"
            type={selectedType === "EMAIL" ? "email" : "text"}
            inputMode={selectedType === "EMAIL" ? "email" : "text"}
            placeholder={getContactTypeConfig(selectedType).placeholder}
            className="font-medium"
            aria-invalid={Boolean(errors.value)}
            aria-describedby={errors.value ? "contact-value-error" : undefined}
            disabled={isPending}
            {...register("value")}
          />
          <FormMessage id="contact-value-error">
            {errors.value?.message}
          </FormMessage>
        </FormField>

        <FormField invalid={Boolean(errors.label)} disabled={isPending}>
          <FormLabel htmlFor="contact-label" optional>
            Label
          </FormLabel>
          <Input
            id="contact-label"
            placeholder="Professional, Personal..."
            aria-invalid={Boolean(errors.label)}
            aria-describedby={errors.label ? "contact-label-error" : undefined}
            disabled={isPending}
            {...register("label")}
          />
          <FormMessage id="contact-label-error">
            {errors.label?.message}
          </FormMessage>
        </FormField>
      </div>

      <SheetFooter className="px-5 py-4 sm:px-6 [&>button]:w-full sm:[&>button]:w-auto">
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending} aria-busy={isPending}>
          {isPending ? (
            <LoaderCircleIcon className="animate-spin motion-reduce:animate-none" />
          ) : null}
          {isPending
            ? isCreate
              ? "Adding..."
              : "Saving..."
            : isCreate
              ? "Add contact"
              : "Save changes"}
        </Button>
      </SheetFooter>
    </form>
  )
}
