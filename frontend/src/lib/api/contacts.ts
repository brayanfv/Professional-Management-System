import { apiClient } from "@/lib/api/client"
import type {
  Contact,
  CreateContactRequest,
  UpdateContactRequest,
} from "@/types/contact"

function contactsPath(professionalId: number) {
  return `/api/professionals/${professionalId}/contacts`
}

export function getProfessionalContacts(professionalId: number) {
  return apiClient.get<Contact[]>(contactsPath(professionalId))
}

export function createProfessionalContact(
  professionalId: number,
  payload: CreateContactRequest,
) {
  return apiClient.post<Contact>(contactsPath(professionalId), payload)
}

export function updateProfessionalContact(
  professionalId: number,
  contactId: number,
  payload: UpdateContactRequest,
) {
  return apiClient.put<Contact>(
    `${contactsPath(professionalId)}/${contactId}`,
    payload,
  )
}

export function deleteProfessionalContact(
  professionalId: number,
  contactId: number,
) {
  return apiClient.delete(`${contactsPath(professionalId)}/${contactId}`)
}
