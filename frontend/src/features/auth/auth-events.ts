const UNAUTHORIZED_EVENT = "professional-management-unauthorized"

export function notifyUnauthorized() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
  }
}

export function subscribeToUnauthorized(listener: () => void) {
  if (typeof window === "undefined") {
    return () => undefined
  }

  window.addEventListener(UNAUTHORIZED_EVENT, listener)
  return () => window.removeEventListener(UNAUTHORIZED_EVENT, listener)
}
