"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

import {
  AuthLoadingScreen,
  AuthSessionErrorScreen,
} from "@/components/common/auth-loading-screen"
import { routes } from "@/lib/routes"
import { useAuth } from "@/providers/auth-provider"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { retrySession, status } = useAuth()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(routes.login)
    }
  }, [router, status])

  if (status === "restore-error") {
    return <AuthSessionErrorScreen onRetry={retrySession} />
  }

  if (status !== "authenticated") {
    return <AuthLoadingScreen />
  }

  return children
}
