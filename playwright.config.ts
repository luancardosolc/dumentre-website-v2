import { defineConfig, devices } from "@playwright/test";

const PORT = 8799;
const BASE_URL = `http://127.0.0.1:${PORT}`;

/**
 * Production tests (tagged @production) hit real internet URLs and are excluded from the
 * default local run via `grepInvert`. Run them explicitly with `npm run test:e2e:prod`.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // A single python dev server + 3 browser projects running concurrently on a dev machine can
  // occasionally push a locator past the default timeout under load; 1 retry locally (2 in CI)
  // absorbs that without masking real failures (which reproduce even after a retry).
  retries: process.env.CI ? 2 : 1,
  reporter: [["html"], ["list"]],

  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 10_000,
  },
  expect: {
    timeout: 8_000,
  },

  projects: [
    {
      name: "chromium-desktop",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      // 375x667 — iPhone SE-class viewport, the smallest common mobile breakpoint.
      name: "chromium-mobile",
      use: { ...devices["Pixel 5"], viewport: { width: 375, height: 667 } },
    },
    {
      // 390x844 — modern iPhone-class viewport, tested on WebKit for engine coverage.
      name: "webkit-mobile",
      use: { ...devices["iPhone 13"], viewport: { width: 390, height: 844 } },
    },
  ],

  webServer: {
    command: `python -m http.server ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
