import { z } from "zod"

export const managementEntitySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(120, "Name must be 120 characters or fewer."),
  description: z
    .string()
    .trim()
    .max(500, "Description must be 500 characters or fewer."),
})

export type ManagementEntityFormValues = z.infer<typeof managementEntitySchema>
