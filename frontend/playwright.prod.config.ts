import { defineConfig, devices } from "@playwright/test"

const baseURL = process.env.PROD_SMOKE_BASE_URL ?? "https://localhost:8443"

export default defineConfig({
  testDir: "./e2e-prod",
  fullyParallel: false,
  forbidOnly: true,
  reporter: "list",
  use: {
    baseURL,
    ignoreHTTPSErrors: true,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
})
