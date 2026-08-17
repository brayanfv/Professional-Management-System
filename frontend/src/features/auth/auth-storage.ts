const ACCESS_TOKEN_KEY = "professional-management-access-token"

/**
 * MVP-only token persistence boundary. Keep browser storage access isolated here
 * so it can be replaced by an HttpOnly cookie or BFF-backed session later.
 */
export const authStorage = {
  getAccessToken() {
    if (typeof window === "undefined") {
      return null
    }

    return window.localStorage.getItem(ACCESS_TOKEN_KEY)
  },

  setAccessToken(token: string) {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(ACCESS_TOKEN_KEY, token)
    }
  },

  clearAccessToken() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(ACCESS_TOKEN_KEY)
    }
  },
}
