import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

const authState = vi.hoisted(() => ({
  value: {
    status: "unauthenticated" as const,
    retrySession: vi.fn(),
    signIn: vi.fn(),
  },
}))

vi.mock("@/providers/auth-provider", () => ({
  useAuth: () => authState.value,
}))

import { LoginForm } from "@/features/auth/components/login-form"
import { ApiClientError } from "@/lib/api/client"
import { routes } from "@/lib/routes"
import { getRouterMock } from "@/test/mocks/next-navigation"
import { renderWithQueryClient } from "@/test/render"

function renderLoginForm() {
  authState.value = {
    status: "unauthenticated",
    retrySession: vi.fn(),
    signIn: vi.fn(),
  }
  return renderWithQueryClient(<LoginForm />)
}

describe("LoginForm", () => {
  it("shows inline validation for empty and invalid credentials", async () => {
    const user = userEvent.setup()
    renderLoginForm()

    await user.click(screen.getByRole("button", { name: "Sign in" }))
    expect(await screen.findByText("Email is required.")).toBeVisible()
    expect(screen.getByText("Password is required.")).toBeVisible()

    await user.type(screen.getByLabelText(/^Email/), "not-an-email")
    await user.click(screen.getByRole("button", { name: "Sign in" }))
    expect(await screen.findByText("Enter a valid email address.")).toBeVisible()
  })

  it("submits valid credentials and redirects to the dashboard", async () => {
    const user = userEvent.setup()
    renderLoginForm()

    await user.type(screen.getByLabelText(/^Email/), "admin@example.test")
    await user.type(screen.getByLabelText(/^Password/), "safe-password")
    await user.click(screen.getByRole("button", { name: "Sign in" }))

    await waitFor(() => {
      expect(authState.value.signIn).toHaveBeenCalledWith({
        email: "admin@example.test",
        password: "safe-password",
      })
    })
    expect(getRouterMock().replace).toHaveBeenCalledWith(routes.dashboard)
  })

  it("shows the credential error and preserves the form", async () => {
    const user = userEvent.setup()
    renderLoginForm()
    authState.value.signIn.mockRejectedValueOnce(
      new ApiClientError({
        status: 401,
        code: "INVALID_CREDENTIALS",
        message: "Unauthorized",
      }),
    )

    await user.type(screen.getByLabelText(/^Email/), "admin@example.test")
    await user.type(screen.getByLabelText(/^Password/), "wrong-password")
    await user.click(screen.getByRole("button", { name: "Sign in" }))

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Invalid email or password.",
    )
    expect(screen.getByLabelText(/^Email/)).toHaveValue("admin@example.test")
  })

  it("disables repeated submission while sign in is pending", async () => {
    const user = userEvent.setup()
    let resolveSignIn: (() => void) | undefined
    renderLoginForm()
    authState.value.signIn.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          resolveSignIn = resolve
        }),
    )

    await user.type(screen.getByLabelText(/^Email/), "admin@example.test")
    await user.type(screen.getByLabelText(/^Password/), "safe-password")
    await user.click(screen.getByRole("button", { name: "Sign in" }))

    expect(await screen.findByRole("button", { name: "Signing in..." })).toBeDisabled()
    expect(authState.value.signIn).toHaveBeenCalledOnce()

    resolveSignIn?.()
  })

  it("exposes an accessible password visibility control", async () => {
    const user = userEvent.setup()
    renderLoginForm()
    const password = screen.getByLabelText(/^Password/)

    expect(password).toHaveAttribute("type", "password")
    await user.click(screen.getByRole("button", { name: "Show password" }))
    expect(password).toHaveAttribute("type", "text")
    expect(screen.getByRole("button", { name: "Hide password" })).toHaveAttribute(
      "aria-pressed",
      "true",
    )
  })
})
