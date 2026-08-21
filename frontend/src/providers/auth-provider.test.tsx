import { QueryClient } from "@tanstack/react-query"
import { act, screen, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

const authApi = vi.hoisted(() => ({
  getMe: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
}))

vi.mock("@/lib/api/auth", () => authApi)

import { ApiClientError } from "@/lib/api/client"
import { routes } from "@/lib/routes"
import { AuthProvider, useAuth } from "@/providers/auth-provider"
import { getRouterMock } from "@/test/mocks/next-navigation"
import { renderWithQueryClient } from "@/test/render"

const user = {
  id: 1,
  name: "E2E Administrator",
  email: "e2e-admin@example.test",
  role: "ADMIN" as const,
}

function AuthProbe() {
  const { signIn, signOut, status, user: currentUser } = useAuth()

  return (
    <div>
      <output aria-label="auth status">{status}</output>
      <output aria-label="user email">{currentUser?.email ?? "none"}</output>
      <button onClick={() => void signIn({ email: user.email, password: "password" })}>
        Sign in
      </button>
      <button onClick={() => void signOut()}>Sign out</button>
    </div>
  )
}

function renderAuthProvider(queryClient?: QueryClient) {
  return renderWithQueryClient(
    <AuthProvider>
      <AuthProbe />
    </AuthProvider>,
    { queryClient },
  )
}

describe("AuthProvider", () => {
  it("restores an authenticated session from /auth/me", async () => {
    authApi.getMe.mockResolvedValueOnce(user)

    renderAuthProvider()

    expect(await screen.findByRole("status", { name: "auth status" })).toHaveTextContent(
      "authenticated",
    )
    expect(screen.getByRole("status", { name: "user email" })).toHaveTextContent(
      user.email,
    )
  })

  it("treats a 401 restoration result as unauthenticated", async () => {
    authApi.getMe.mockRejectedValueOnce(
      new ApiClientError({ status: 401, code: "UNAUTHORIZED", message: "Unauthorized" }),
    )

    renderAuthProvider()

    expect(await screen.findByRole("status", { name: "auth status" })).toHaveTextContent(
      "unauthenticated",
    )
  })

  it("keeps a transient restoration failure distinct from logout", async () => {
    authApi.getMe.mockRejectedValueOnce(new Error("Network unavailable"))

    renderAuthProvider()

    expect(await screen.findByRole("status", { name: "auth status" })).toHaveTextContent(
      "restore-error",
    )
  })

  it("updates local state after sign in", async () => {
    authApi.getMe.mockRejectedValueOnce(
      new ApiClientError({ status: 401, code: "UNAUTHORIZED", message: "Unauthorized" }),
    )
    authApi.getMe.mockResolvedValueOnce(user)
    authApi.login.mockResolvedValueOnce({ user })

    renderAuthProvider()
    await screen.findByText("unauthenticated")

    await act(async () => {
      screen.getByRole("button", { name: "Sign in" }).click()
    })

    expect(screen.getByRole("status", { name: "auth status" })).toHaveTextContent(
      "authenticated",
    )
  })

  it("clears the query cache and redirects once after concurrent sign out", async () => {
    authApi.getMe.mockResolvedValueOnce(user)
    authApi.logout.mockResolvedValueOnce(undefined)
    const queryClient = new QueryClient()
    queryClient.setQueryData(["protected"], "cached")

    renderAuthProvider(queryClient)
    await screen.findByText("authenticated")

    await act(async () => {
      screen.getByRole("button", { name: "Sign out" }).click()
      screen.getByRole("button", { name: "Sign out" }).click()
    })

    await waitFor(() => {
      expect(screen.getByRole("status", { name: "auth status" })).toHaveTextContent(
        "unauthenticated",
      )
    })
    expect(authApi.logout).toHaveBeenCalledOnce()
    expect(queryClient.getQueryData(["protected"])).toBeUndefined()
    expect(getRouterMock().replace).toHaveBeenCalledWith(routes.login)
  })
})
