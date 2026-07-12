/**
 * Centralized selectors for markup that isn't reliably reachable via role/text locators
 * (documented in docs/testing/site-discovery.md). Keep this list short — prefer
 * page.getByRole()/getByText() at the call site whenever possible.
 */
export const selectors = {
  logo: 'img[alt="Logo Dumentre"]',
  mobileNavToggle: ".mobile-nav-toggle",
  navMenu: ".nav-menu",
  navCtaWrapper: ".nav-cta-wrapper",
  mainHeader: ".main-header",
  whatsappIcon: 'img[src*="whatsapp.svg"]',
  faqItem: ".faq-item",
  faqTrigger: ".faq-trigger",
  faqAnswer: ".faq-answer",
} as const;

export const NAV_SECTIONS = [
  { label: "Problemas", hash: "#problemas" },
  { label: "Soluções", hash: "#solucoes" },
  { label: "Comece Pequeno", hash: "#produtos-entrada" },
  { label: "Como Funciona", hash: "#como-funciona" },
  { label: "Diferenciais", hash: "#diferenciais" },
  { label: "FAQ", hash: "#faq" },
] as const;
