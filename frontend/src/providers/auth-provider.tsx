"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

import { subscribeToUnauthorized } from "@/features/auth/auth-events"
import { authStorage } from "@/features/auth/auth-storage"
import type {
  AuthenticatedUser,
  LoginRequest,
} from "@/features/auth/types"
import {
  getMe,
  login as requestLogin,
  logout as requestLogout,
} from "@/lib/api/auth"
import { ApiClientError } from "@/lib/api/client"
import { routes } from "@/lib/routes"

export type AuthStatus =
  | "loading"
  | "authenticated"
  | "unauthenticated"
  | "restore-error"

type AuthContextValue = {
  user: AuthenticatedUser | null
  status: AuthStatus
  isAuthenticated: boolean
  isLoading: boolean
  signIn: (credentials: LoginRequest) => Promise<void>
  signOut: () => Promise<void>
  retrySession: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [user, setUser] = useState<AuthenticatedUser | null>(null)
  const [status, setStatus] = useState<AuthStatus>("loading")
  const [restoreAttempt, setRestoreAttempt] = useState(0)

  const clearSession = useCallback(() => {
    authStorage.clearAccessToken()
    queryClient.clear()
    setUser(null)
    setStatus("unauthenticated")
  }, [queryClient])

  useEffect(() => {
    let active = true

    async function restoreSession() {
      await Promise.resolve()

      const accessToken = authStorage.getAccessToken()
      if (!accessToken) {
        if (active) {
          setStatus("unauthenticated")
        }
        return
      }

      try {
        const authenticatedUser = await getMe()
        if (active && authStorage.getAccessToken() === accessToken) {
          setUser(authenticatedUser)
          setStatus("authenticated")
        }
      } catch (error) {
        if (!active || authStorage.getAccessToken() !== accessToken) return

        if (error instanceof ApiClientError && error.details.status === 401) {
          clearSession()
          return
        }

        setUser(null)
        setStatus("restore-error")
      }
    }

    void restoreSession()

    return () => {
      active = false
    }
  }, [clearSession, restoreAttempt])

  useEffect(() => {
    return subscribeToUnauthorized(() => {
      clearSession()
      router.replace(routes.login)
    })
  }, [clearSession, router])

  const signIn = useCallback(async (credentials: LoginRequest) => {
    const response = await requestLogin(credentials)
    authStorage.setAccessToken(response.accessToken)
    setUser(response.user)
    setStatus("authenticated")
  }, [])

  const signOut = useCallback(async () => {
    try {
      if (authStorage.getAccessToken()) {
        await requestLogout()
      }
    } catch {
      // Stateless logout still completes locally if the backend is unavailable.
    } finally {
      clearSession()
      router.replace(routes.login)
    }
  }, [clearSession, router])

  const retrySession = useCallback(() => {
    setStatus("loading")
    setRestoreAttempt((attempt) => attempt + 1)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      isAuthenticated: status === "authenticated",
      isLoading: status === "loading",
      signIn,
      signOut,
      retrySession,
    }),
    [retrySession, signIn, signOut, status, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }

  return context
}
