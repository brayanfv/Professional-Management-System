import { expect, test } from "@playwright/test"

const admin = {
  email: process.env.PROD_SMOKE_ADMIN_EMAIL ?? "prod-drill-admin@example.test",
  password:
    process.env.PROD_SMOKE_ADMIN_PASSWORD ??
    "Drill-local-only-admin-password",
}

test("uses the restored database through the local production topology", async ({
  context,
  page,
}) => {
  await page.goto("/login")

  await expect(
    page.getByRole("heading", { name: "Welcome back" }),
  ).toBeVisible()
  await page.getByLabel("Email").fill(admin.email)
  await page
    .getByRole("textbox", { name: "Password (required)" })
    .fill(admin.password)

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
  expect(sessionCookie).toMatchObject({
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    path: "/",
  })
  await expect.poll(() =>
    page.evaluate(() => !document.cookie.includes("pm_session=")),
  ).toBe(true)

  await page.goto("/professionals?search=Backup%20Drill%20Professional")
  const professionalLink = page.getByRole("link", {
    name: "Backup Drill Professional",
  })
  await expect(professionalLink).toBeVisible()
  await professionalLink.click()
  await expect(
    page.getByRole("heading", { name: "Backup Drill Professional" }),
  ).toBeVisible()

  await page.getByRole("button", { name: "Open account menu" }).click()
  const logoutResponse = page.waitForResponse(
    (response) =>
      new URL(response.url()).pathname === "/api/auth/logout" &&
      response.request().method() === "POST",
  )
  await page.getByRole("menuitem", { name: "Logout" }).click()
  expect((await logoutResponse).status()).toBe(204)
  await expect(page).toHaveURL(/\/login$/)
})
