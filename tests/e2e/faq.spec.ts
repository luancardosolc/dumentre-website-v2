import { test, expect } from "@playwright/test";
import { selectors } from "./helpers/selectors";

test.describe("FAQ", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#faq");
  });

  test("all FAQ items are present", async ({ page }) => {
    const items = page.locator(selectors.faqItem);
    await expect(items).toHaveCount(9);
  });

  test("clicking a question expands it and updates aria-expanded", async ({ page }) => {
    const firstTrigger = page.locator(selectors.faqTrigger).first();
    await expect(firstTrigger).toHaveAttribute("aria-expanded", "false");

    await firstTrigger.click();

    await expect(firstTrigger).toHaveAttribute("aria-expanded", "true");
    const firstAnswer = page.locator(selectors.faqItem).first().locator(selectors.faqAnswer);
    await expect(firstAnswer).toBeVisible();
  });

  test("clicking an open question collapses it again", async ({ page }) => {
    const firstTrigger = page.locator(selectors.faqTrigger).first();
    await firstTrigger.click();
    await expect(firstTrigger).toHaveAttribute("aria-expanded", "true");

    await firstTrigger.click();

    await expect(firstTrigger).toHaveAttribute("aria-expanded", "false");
  });

  test("multiple FAQ items can stay open at the same time", async ({ page }) => {
    const triggers = page.locator(selectors.faqTrigger);
    const first = triggers.nth(0);
    const second = triggers.nth(1);

    await first.click();
    await second.click();

    await expect(first).toHaveAttribute("aria-expanded", "true");
    await expect(second).toHaveAttribute("aria-expanded", "true");
  });
});
