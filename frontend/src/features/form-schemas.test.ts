import { describe, expect, it } from "vitest"

import { loginSchema } from "@/features/auth/login-schema"
import { contactSchema } from "@/features/contacts/contact-schema"
import { managementEntitySchema } from "@/features/management/management-entity-schema"
import { professionalSchema } from "@/features/professionals/professional-schema"

describe("form schemas", () => {
  it("validates login requirements", () => {
    expect(loginSchema.safeParse({ email: "", password: "" }).success).toBe(false)
    expect(
      loginSchema.safeParse({ email: "invalid", password: "password" }).success,
    ).toBe(false)
  })

  it("validates professional requirements and nullable organization references", () => {
    expect(
      professionalSchema.safeParse({
        name: "Ada Lovelace",
        birthDate: "2000-01-01",
        departmentId: null,
        positionId: null,
      }).success,
    ).toBe(true)
    expect(
      professionalSchema.safeParse({
        name: " ",
        birthDate: "2999-01-01",
        departmentId: -1,
        positionId: 0,
      }).success,
    ).toBe(false)
    expect(
      professionalSchema.safeParse({
        name: "A".repeat(151),
        birthDate: "2024-02-30",
        departmentId: null,
        positionId: null,
      }).success,
    ).toBe(false)
  })

  it("validates shared management entity limits", () => {
    expect(
      managementEntitySchema.safeParse({ name: "Technology", description: "" }).success,
    ).toBe(true)
    expect(
      managementEntitySchema.safeParse({
        name: " ",
        description: "D".repeat(501),
      }).success,
    ).toBe(false)
  })

  it("validates type-aware contact values", () => {
    expect(
      contactSchema.safeParse({ type: "EMAIL", value: "name@example.test", label: "Work" })
        .success,
    ).toBe(true)
    expect(
      contactSchema.safeParse({ type: "EMAIL", value: "not-an-email", label: "" }).success,
    ).toBe(false)
    expect(
      contactSchema.safeParse({ type: "PHONE", value: "+1 555 123 4567", label: "" })
        .success,
    ).toBe(true)
  })
})
