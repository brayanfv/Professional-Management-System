import { defineConfig, devices } from "@playwright/test"

const frontendPort = 3001
const baseURL = process.env.E2E_BASE_URL ?? `http://127.0.0.1:${frontendPort}`
const apiURL = process.env.E2E_API_URL ?? "http://127.0.0.1:8081"

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: `npm run build && npm run start -- --port ${frontendPort}`,
        url: `${baseURL}/login`,
    reuseExistingServer: false,
        timeout: 120_000,
        env: {
          NEXT_PUBLIC_API_URL: apiURL,
        },
      },
})
