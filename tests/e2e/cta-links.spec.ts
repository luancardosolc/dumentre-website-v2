import { test, expect } from "@playwright/test";
import { WHATSAPP_NUMBER, CONTACT_EMAIL } from "./helpers/urls";

/**
 * These tests only ever read link attributes (href/target/rel) — they never click a WhatsApp
 * or mailto: link, since that would try to open an external app/tab outside the site.
 */
test.describe("CTA links", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("hero WhatsApp button has correct href, target and rel", async ({ page }) => {
    const heroWhatsapp = page.locator(".hero-actions").getByRole("link", { name: /Falar no WhatsApp/i });
    await expect(heroWhatsapp).toHaveAttribute("href", new RegExp(`^https://wa\\.me/${WHATSAPP_NUMBER}`));
    await expect(heroWhatsapp).toHaveAttribute("target", "_blank");
    await expect(heroWhatsapp).toHaveAttribute("rel", /noopener/);
  });

  test("hero email button has correct mailto href", async ({ page }) => {
    const heroEmail = page.locator(".hero-actions").getByRole("link", { name: /Enviar e-mail/i });
    await expect(heroEmail).toHaveAttribute("href", new RegExp(`^mailto:${CONTACT_EMAIL}`));
  });

  test("header WhatsApp CTA has correct href, target and rel", async ({ page }) => {
    // Uses a CSS locator instead of getByRole: on mobile viewports the header CTA lives
    // inside the closed mobile menu, which is `visibility: hidden` (see mobile-menu.spec.ts)
    // and therefore excluded from the accessibility tree — getByRole would find nothing even
    // though the link and its attributes are perfectly present in the DOM.
    const headerWhatsapp = page.locator(".nav-cta-wrapper a");
    await expect(headerWhatsapp).toHaveAttribute("href", new RegExp(`^https://wa\\.me/${WHATSAPP_NUMBER}`));
    await expect(headerWhatsapp).toHaveAttribute("target", "_blank");
    await expect(headerWhatsapp).toHaveAttribute("rel", /noopener/);
  });

  test("final CTA section has WhatsApp and email links with correct attributes", async ({ page }) => {
    const finalCta = page.locator(".final-cta-section");

    const finalWhatsapp = finalCta.getByRole("link", { name: /Falar no WhatsApp/i });
    await expect(finalWhatsapp).toHaveAttribute("href", new RegExp(`^https://wa\\.me/${WHATSAPP_NUMBER}`));
    await expect(finalWhatsapp).toHaveAttribute("target", "_blank");
    await expect(finalWhatsapp).toHaveAttribute("rel", /noopener/);

    const finalEmail = finalCta.getByRole("link", { name: /Enviar e-mail/i });
    await expect(finalEmail).toHaveAttribute("href", new RegExp(`^mailto:${CONTACT_EMAIL}`));
  });

  test("all wa.me links share the same phone number and open in a new tab", async ({ page }) => {
    const waLinks = page.locator('a[href*="wa.me"]');
    const count = await waLinks.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const link = waLinks.nth(i);
      await expect(link).toHaveAttribute("href", new RegExp(`wa\\.me/${WHATSAPP_NUMBER}`));
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", /noopener/);
    }
  });

  test("footer phone link points to wa.me without a prefilled message", async ({ page }) => {
    const footerPhone = page.locator("footer").getByRole("link", { name: "+55 11 93621-7352" });
    await expect(footerPhone).toHaveAttribute("href", `https://wa.me/${WHATSAPP_NUMBER}`);
  });

  test("no wa.me or mailto link is actually navigated to when reading attributes", async ({ page }) => {
    const urlBefore = page.url();
    const waLinks = page.locator('a[href*="wa.me"]');
    await waLinks.first().getAttribute("href");
    expect(page.url()).toBe(urlBefore);
  });
});
