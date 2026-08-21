import { z } from "zod"

export const contactSchema = z
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

export type ContactFormValues = z.infer<typeof contactSchema>
