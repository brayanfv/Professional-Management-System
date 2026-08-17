"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { professionalKeys } from "@/features/professionals/query-keys"
import {
  createProfessionalContact,
  deleteProfessionalContact,
  updateProfessionalContact,
} from "@/lib/api/contacts"
import type {
  CreateContactRequest,
  UpdateContactRequest,
} from "@/types/contact"

function useInvalidateProfessionalContacts(professionalId: number) {
  const queryClient = useQueryClient()

  return async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: professionalKeys.contacts(professionalId),
      }),
      queryClient.invalidateQueries({
        queryKey: professionalKeys.detail(professionalId),
      }),
    ])
  }
}

export function useCreateContact(professionalId: number) {
  const invalidate = useInvalidateProfessionalContacts(professionalId)

  return useMutation({
    mutationFn: (payload: CreateContactRequest) =>
      createProfessionalContact(professionalId, payload),
    onSuccess: invalidate,
  })
}

export function useUpdateContact(professionalId: number) {
  const invalidate = useInvalidateProfessionalContacts(professionalId)

  return useMutation({
    mutationFn: ({
      contactId,
      payload,
    }: {
      contactId: number
      payload: UpdateContactRequest
    }) => updateProfessionalContact(professionalId, contactId, payload),
    onSuccess: invalidate,
  })
}

export function useDeleteContact(professionalId: number) {
  const invalidate = useInvalidateProfessionalContacts(professionalId)

  return useMutation({
    mutationFn: (contactId: number) =>
      deleteProfessionalContact(professionalId, contactId),
    onSuccess: invalidate,
  })
}
