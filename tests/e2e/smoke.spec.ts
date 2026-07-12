import { test, expect } from "@playwright/test";
import { collectConsoleErrors, collectFailedAssetResponses } from "./helpers/console-errors";
import { selectors } from "./helpers/selectors";

test.describe("Smoke", () => {
  test("home page loads with correct title, meta and no console errors", async ({ page }) => {
    const consoleErrors = collectConsoleErrors(page);
    const failedAssets = collectFailedAssetResponses(page);

    const response = await page.goto("/");
    expect(response?.status()).toBe(200);

    await expect(page).toHaveTitle(/Dumentre/);

    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute("content", /.+/);

    expect(consoleErrors, `Console errors found: ${consoleErrors.join(", ")}`).toEqual([]);
    expect(failedAssets, `Failed asset requests: ${failedAssets.join(", ")}`).toEqual([]);
  });

  test("stylesheet and script are loaded", async ({ page }) => {
    await page.goto("/");

    const cssHref = await page.locator('link[rel="stylesheet"][href*="style.css"]').getAttribute("href");
    expect(cssHref).toBeTruthy();

    const jsSrc = await page.locator('script[src*="script.js"]').getAttribute("src");
    expect(jsSrc).toBeTruthy();

    // Confirm the stylesheet actually applied (body should not be unstyled/default white bg).
    const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bodyBg).not.toBe("rgba(0, 0, 0, 0)");
    expect(bodyBg).not.toBe("");
  });

  test("logo is visible and loaded", async ({ page }) => {
    await page.goto("/");

    const logo = page.locator(selectors.logo).first();
    await expect(logo).toBeVisible();

    const naturalWidth = await logo.evaluate((img: HTMLImageElement) => img.naturalWidth);
    expect(naturalWidth).toBeGreaterThan(0);
  });
});
