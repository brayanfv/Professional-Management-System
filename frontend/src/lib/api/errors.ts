import { ApiClientError } from "@/lib/api/client"

export function hasApiErrorCode(error: unknown, code: string) {
  return error instanceof ApiClientError && error.details.code === code
}

export function isNotFoundError(error: unknown, code: string) {
  return (
    error instanceof ApiClientError &&
    (error.details.status === 404 || error.details.code === code)
  )
}
