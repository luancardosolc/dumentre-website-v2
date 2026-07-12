import { test, expect } from "@playwright/test";
import { collectFailedAssetResponses } from "./helpers/console-errors";
import { selectors } from "./helpers/selectors";

test.describe("Assets", () => {
  test("logo loads with a valid natural width", async ({ page }) => {
    await page.goto("/");

    const logo = page.locator(selectors.logo).first();
    const naturalWidth = await logo.evaluate((img: HTMLImageElement) => img.naturalWidth);
    expect(naturalWidth).toBeGreaterThan(0);
  });

  test("WhatsApp icon loads in all its instances", async ({ page }) => {
    await page.goto("/");

    const icons = page.locator(selectors.whatsappIcon);
    const count = await icons.count();
    expect(count).toBeGreaterThanOrEqual(3);

    for (let i = 0; i < count; i++) {
      const naturalWidth = await icons.nth(i).evaluate((img: HTMLImageElement) => img.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }
  });

  test("no main asset (css/js/images) returns an error status", async ({ page }) => {
    const failedAssets = collectFailedAssetResponses(page);

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    expect(failedAssets, `Failed asset requests: ${failedAssets.join(", ")}`).toEqual([]);
  });
});
