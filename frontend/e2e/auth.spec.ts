import { expect, test } from "@playwright/test"

const e2eAdmin = {
  email: process.env.E2E_ADMIN_EMAIL ?? "e2e-admin@example.test",
  password: process.env.E2E_ADMIN_PASSWORD ?? "E2E-admin-only-ChangeMe1!",
}

test("authenticates with an HttpOnly session and signs out", async ({
  context,
  page,
}) => {
  await page.goto("/login")

  await expect(
    page.getByRole("heading", { name: "Welcome back" }),
  ).toBeVisible()
  await page.getByLabel("Email").fill(e2eAdmin.email)
  await page.getByRole("textbox", { name: "Password (required)" }).fill(e2eAdmin.password)
  const loginResponse = page.waitForResponse(
    (response) =>
      new URL(response.url()).pathname === "/api/auth/login" &&
      response.request().method() === "POST",
  )
  await page.getByRole("button", { name: "Sign in" }).click()
  expect((await loginResponse).status()).toBe(200)

  await expect(page).toHaveURL(/\/dashboard$/)
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible()

  const sessionCookie = (await context.cookies()).find(
    (cookie) => cookie.name === "pm_session",
  )
  expect(sessionCookie).toMatchObject({ httpOnly: true, sameSite: "Lax" })
  const csrfCookie = (await context.cookies()).find(
    (cookie) => cookie.name === "XSRF-TOKEN",
  )
  expect(csrfCookie).toMatchObject({
    httpOnly: false,
    path: "/",
  })
  await expect.poll(() =>
    page.evaluate(() => {
      const tokenCookie = document.cookie
        .split(";")
        .map((value) => value.trim())
        .find((value) => value.startsWith("XSRF-TOKEN="))

      return Boolean(tokenCookie?.slice("XSRF-TOKEN=".length))
    }),
  ).toBe(true)

  await page.getByRole("button", { name: "Open account menu" }).click()
  const logoutResponse = page.waitForResponse(
    (response) =>
      new URL(response.url()).pathname === "/api/auth/logout" &&
      response.request().method() === "POST",
  )
  await page.getByRole("menuitem", { name: "Logout" }).click()
  const logoutRequest = await logoutResponse
  expect(logoutRequest.status()).toBe(204)

  await expect(page).toHaveURL(/\/login$/)
  await expect(
    page.getByRole("heading", { name: "Welcome back" }),
  ).toBeVisible()
  expect((await context.cookies()).some((cookie) => cookie.name === "pm_session")).toBe(
    false,
  )
})
