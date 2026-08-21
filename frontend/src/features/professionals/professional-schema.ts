import { z } from "zod"

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

export const professionalSchema = z.object({
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

export type ProfessionalFormValues = z.infer<typeof professionalSchema>
