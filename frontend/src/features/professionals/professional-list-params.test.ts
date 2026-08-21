import { describe, expect, it } from "vitest"

import {
  defaultProfessionalListParams,
  parseProfessionalListParams,
} from "@/features/professionals/professional-list-params"

describe("parseProfessionalListParams", () => {
  it("uses stable defaults when no search parameters are supplied", () => {
    expect(parseProfessionalListParams({})).toEqual(defaultProfessionalListParams)
  })

  it("accepts supported pagination, filters, sorting, and trimmed search", () => {
    expect(
      parseProfessionalListParams({
        page: "2",
        size: "50",
        search: "  Ada Lovelace  ",
        status: "ACTIVE",
        departmentId: "3",
        positionId: "7",
        sort: "createdAt,desc",
      }),
    ).toEqual({
      page: 2,
      size: 50,
      search: "Ada Lovelace",
      status: "ACTIVE",
      departmentId: 3,
      positionId: 7,
      sort: "createdAt,desc",
    })
  })

  it.each([
    ["-1", 0],
    ["abc", 0],
    ["1.5", 0],
  ])("falls back for invalid page %s", (page, expectedPage) => {
    expect(parseProfessionalListParams({ page }).page).toBe(expectedPage)
  })

  it.each(["0", "15", "100", "invalid"]) (
    "falls back for unsupported page size %s",
    (size) => {
      expect(parseProfessionalListParams({ size }).size).toBe(10)
    },
  )

  it.each(["ACTIVE", "INACTIVE"]) ("accepts status %s", (status) => {
    expect(parseProfessionalListParams({ status }).status).toBe(status)
  })

  it("drops unknown status, invalid ids, and invalid sorts", () => {
    expect(
      parseProfessionalListParams({
        status: "PENDING",
        departmentId: "0",
        positionId: "3.5",
        sort: "name,up",
      }),
    ).toMatchObject({
      status: undefined,
      departmentId: undefined,
      positionId: undefined,
      sort: "name,asc",
    })
  })

  it("uses the first value from repeated URL parameters", () => {
    expect(
      parseProfessionalListParams({
        page: ["1", "9"],
        search: ["  Grace  ", "Ignored"],
      }),
    ).toMatchObject({ page: 1, search: "Grace" })
  })
})
