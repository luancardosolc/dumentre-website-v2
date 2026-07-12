import { test, expect } from "@playwright/test";
import { selectors } from "./helpers/selectors";

/**
 * Runs only on mobile projects (chromium-mobile / webkit-mobile), which use real mobile
 * viewports via Playwright's device presets. Desktop projects skip this file entirely.
 */
test.describe("Mobile menu", () => {
  test.skip(({ isMobile }) => !isMobile, "Mobile-only: covers the hamburger menu and overlay fix");

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("hamburger is visible and desktop nav list is not", async ({ page }) => {
    await expect(page.locator(selectors.mobileNavToggle)).toBeVisible();
    await expect(page.locator("nav.nav-menu").getByRole("link", { name: "Problemas", exact: true })).not.toBeVisible();
  });

  test("opening the menu sets aria-expanded and the active class", async ({ page }) => {
    const toggle = page.locator(selectors.mobileNavToggle);
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    await toggle.click();

    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator(selectors.navMenu)).toHaveClass(/active/);
  });

  test("open menu panel fully covers the viewport below the header (overlay bug fix)", async ({ page }) => {
    const toggle = page.locator(selectors.mobileNavToggle);
    await toggle.click();

    const navMenu = page.locator(selectors.navMenu);
    await expect(navMenu).toBeVisible();
    // Opening the menu triggers a 0.3s CSS transform transition; wait for it to settle
    // before reading bounding boxes, otherwise we measure a mid-transition position.
    await expect(navMenu).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");

    const header = page.locator(selectors.mainHeader);
    const headerBox = await header.boundingBox();
    const menuBox = await navMenu.boundingBox();
    const viewport = page.viewportSize();

    expect(headerBox).not.toBeNull();
    expect(menuBox).not.toBeNull();
    expect(viewport).not.toBeNull();

    // The panel must start right where the header ends...
    expect(menuBox!.y).toBeGreaterThanOrEqual(headerBox!.y + headerBox!.height - 1);
    // ...and reach all the way down to the bottom of the real viewport (the bug this
    // regresses against made the panel collapse to its content height instead).
    expect(menuBox!.y + menuBox!.height).toBeGreaterThanOrEqual(viewport!.height - 1);
  });

  test("hero title is not visible/interactive through the open menu", async ({ page }) => {
    const heroTitle = page.getByRole("heading", { level: 1 });
    await expect(heroTitle).toBeVisible();

    await page.locator(selectors.mobileNavToggle).click();
    // Wait for the open transition to settle before checking what's on top.
    await expect(page.locator(selectors.navMenu)).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");

    // The hero heading must no longer be the topmost element at its own coordinates —
    // the opaque nav-menu panel should be covering it instead of the hero showing through.
    const stillOnTop = await heroTitle.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const topElement = document.elementFromPoint(x, y);
      return topElement === el || el.contains(topElement);
    });
    expect(stillOnTop).toBe(false);
  });

  test("clicking the toggle again (visual X) closes the menu", async ({ page }) => {
    const toggle = page.locator(selectors.mobileNavToggle);
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");

    await toggle.click();

    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator(selectors.navMenu)).not.toHaveClass(/active/);
  });

  test("clicking a nav link closes the menu", async ({ page }) => {
    const toggle = page.locator(selectors.mobileNavToggle);
    await toggle.click();

    const link = page.locator("nav.nav-menu").getByRole("link", { name: "Problemas", exact: true });
    await link.click();

    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator(selectors.navMenu)).not.toHaveClass(/active/);
  });

  test("pressing Escape closes the menu", async ({ page }) => {
    const toggle = page.locator(selectors.mobileNavToggle);
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("Escape");

    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator(selectors.navMenu)).not.toHaveClass(/active/);
  });

  test("body scroll is locked while the menu is open", async ({ page }) => {
    const toggle = page.locator(selectors.mobileNavToggle);

    const overflowBefore = await page.evaluate(() => document.body.style.overflow);
    expect(overflowBefore).toBe("");

    await toggle.click();
    const overflowOpen = await page.evaluate(() => document.body.style.overflow);
    expect(overflowOpen).toBe("hidden");

    await toggle.click();
    const overflowClosed = await page.evaluate(() => document.body.style.overflow);
    expect(overflowClosed).toBe("");
  });
});
