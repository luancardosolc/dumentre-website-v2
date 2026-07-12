import { test, expect } from "@playwright/test";
import { PRODUCTION_URLS } from "./helpers/urls";
import { selectors } from "./helpers/selectors";

/**
 * @production — hits real internet URLs. Excluded from the default `npm run test:e2e` run
 * (which passes --grep-invert @production). Run explicitly with `npm run test:e2e:prod`.
 *
 * Intentionally minimal: just confirms each deployment target is up, serves the right
 * content and its core assets don't 404 — no deep interaction/navigation testing here.
 */
test.describe("Production smoke @production", () => {
  for (const url of PRODUCTION_URLS) {
    test(`${url} is up and renders the site`, async ({ page }) => {
      const response = await page.goto(url);
      expect(response?.status()).toBe(200);

      await expect(page).toHaveTitle(/Dumentre/);

      const logo = page.locator(selectors.logo).first();
      await expect(logo).toBeVisible();
      const naturalWidth = await logo.evaluate((img: HTMLImageElement) => img.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);

      const cssLink = page.locator('link[rel="stylesheet"][href*="style.css"]');
      await expect(cssLink).toHaveCount(1);
    });

    test(`${url} core assets do not 404`, async ({ page }) => {
      const failures: string[] = [];
      page.on("response", (response) => {
        const type = response.request().resourceType();
        if (["stylesheet", "script", "image"].includes(type) && response.status() >= 400) {
          failures.push(`${response.status()} ${response.url()}`);
        }
      });

      await page.goto(url);
      await page.waitForLoadState("networkidle");

      expect(failures, `Failed asset requests on ${url}: ${failures.join(", ")}`).toEqual([]);
    });

    test(`${url}/favicon.ico is a real icon, not the HTML SPA fallback`, async ({ request }) => {
      const response = await request.get(`${url}/favicon.ico`);
      expect(response.status()).toBe(200);

      const contentType = response.headers()["content-type"] ?? "";
      expect(contentType).not.toContain("text/html");
      expect(contentType).toMatch(/image\/(x-icon|vnd\.microsoft\.icon)/);

      const body = await response.body();
      expect(body.readUInt16LE(0)).toBe(0);
      expect(body.readUInt16LE(2)).toBe(1);
    });
  }
});
