import { test, expect } from "@playwright/test";
import { NAV_SECTIONS } from "./helpers/selectors";

test.describe("Navigation", () => {
  // The desktop nav (with the visible link list) is hidden by CSS under 900px; mobile
  // navigation is covered separately in mobile-menu.spec.ts.
  test.skip(({ isMobile }) => isMobile, "Desktop-only: header nav list is hidden on mobile");

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  for (const section of NAV_SECTIONS) {
    test(`header link "${section.label}" navigates to ${section.hash}`, async ({ page }) => {
      const link = page.locator("nav.nav-menu").getByRole("link", { name: section.label, exact: true });
      await link.click();

      await expect(page).toHaveURL(new RegExp(`\\${section.hash}$`));

      const target = page.locator(section.hash);
      await expect(target).toBeInViewport();
    });
  }

  test("active-nav class follows the clicked section", async ({ page }) => {
    const solucoesLink = page.locator("nav.nav-menu").getByRole("link", { name: "Soluções", exact: true });
    await solucoesLink.click();

    await expect(solucoesLink).toHaveClass(/active-nav/);

    const problemasLink = page.locator("nav.nav-menu").getByRole("link", { name: "Problemas", exact: true });
    await expect(problemasLink).not.toHaveClass(/active-nav/);
  });

  test("footer links resolve to the same real sections", async ({ page }) => {
    for (const section of NAV_SECTIONS.filter((s) => s.label !== "Comece Pequeno")) {
      const target = page.locator(section.hash);
      await expect(target).toHaveCount(1);
    }

    // Footer uses a slightly different label for the FAQ link; confirm it points at #faq too.
    const footerFaqLink = page.locator("footer").getByRole("link", { name: "Perguntas Frequentes" });
    await expect(footerFaqLink).toHaveAttribute("href", "#faq");
  });
});
