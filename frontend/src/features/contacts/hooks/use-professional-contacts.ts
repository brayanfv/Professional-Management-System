"use client"

import { useQuery } from "@tanstack/react-query"

import { professionalKeys } from "@/features/professionals/query-keys"
import { getProfessionalContacts } from "@/lib/api/contacts"

export function useProfessionalContacts(professionalId: number) {
  return useQuery({
    queryKey: professionalKeys.contacts(professionalId),
    queryFn: () => getProfessionalContacts(professionalId),
  })
}
