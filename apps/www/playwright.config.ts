import { defineConfig, devices } from "@playwright/test";

const PORT = 3000;
const baseURL = `http://localhost:${PORT}`;

/**
 * Playwright E2E config for the JSON Crack web app.
 * Tests live in src/__tests__/e2e so Jest ignores them (see jest.config.ts).
 */
export default defineConfig({
  testDir: "./src/__tests__/e2e",
  testMatch: "**/*.e2e.{ts,tsx}",
  // Run serially: all tests share one dev server, and parallel workers contend
  // for it (slow cold compiles, late-mounting modals) which makes runs flaky.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
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
  webServer: {
    command: "pnpm dev",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
