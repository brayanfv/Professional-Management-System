import type {
  AuthenticatedUser,
  LoginRequest,
  LoginResponse,
} from "@/features/auth/types"
import { apiClient } from "@/lib/api/client"

const authEndpoints = {
  login: "/api/auth/login",
  me: "/api/auth/me",
  logout: "/api/auth/logout",
} as const

export function login(request: LoginRequest) {
  return apiClient.post<LoginResponse>(authEndpoints.login, request, {
    auth: false,
    handleUnauthorized: false,
  })
}

export function getMe() {
  return apiClient.get<AuthenticatedUser>(authEndpoints.me, {
    // Session restoration classifies 401 separately from transient failures.
    handleUnauthorized: false,
  })
}

export function logout() {
  return apiClient.post<void>(authEndpoints.logout, undefined, {
    handleUnauthorized: false,
  })
}
