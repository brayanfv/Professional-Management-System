import { routes } from "@/lib/routes"

function withReturnContext(path: string, returnHref?: string) {
  if (!returnHref) return path

  const searchParams = new URLSearchParams({ from: returnHref })
  return `${path}?${searchParams.toString()}`
}

export function getProfessionalCreateHref(returnHref?: string) {
  return withReturnContext(routes.professionals.create, returnHref)
}

export function getProfessionalDetailsHref(
  professionalId: number,
  returnHref?: string,
) {
  return withReturnContext(
    routes.professionals.details(professionalId),
    returnHref,
  )
}

export function getProfessionalEditHref(
  professionalId: number,
  returnHref?: string,
) {
  return withReturnContext(routes.professionals.edit(professionalId), returnHref)
}

export function getProfessionalReturnHref(
  rawValue: string | string[] | undefined,
) {
  const value = Array.isArray(rawValue) ? rawValue[0] : rawValue
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return routes.professionals.list
  }

  const parsed = new URL(value, "http://professional-management.local")
  if (parsed.pathname !== routes.professionals.list) {
    return routes.professionals.list
  }

  return `${parsed.pathname}${parsed.search}`
}
