export type ContactType = "EMAIL" | "PHONE" | "MOBILE" | "OTHER"

export type Contact = {
  id: number
  type: ContactType
  value: string
  label: string | null
  createdAt: string
  updatedAt: string
}

export type CreateContactRequest = {
  type: ContactType
  value: string
  label?: string
}

export type UpdateContactRequest = CreateContactRequest
