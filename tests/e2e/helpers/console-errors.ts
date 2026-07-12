import type { Page } from "@playwright/test";

/**
 * Attaches listeners that collect console errors and uncaught page exceptions.
 * Call this before navigating, then assert `errors.length === 0` after the interactions
 * you want to verify are clean.
 */
export function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(msg.text());
    }
  });

  page.on("pageerror", (err) => {
    errors.push(err.message);
  });

  return errors;
}

/**
 * Attaches a listener that collects failed/4xx/5xx responses for asset-style requests
 * (stylesheets, scripts, images, fonts). Ignores the navigation document itself.
 */
export function collectFailedAssetResponses(page: Page): string[] {
  const failures: string[] = [];

  page.on("response", (response) => {
    const type = response.request().resourceType();
    if (["stylesheet", "script", "image", "font"].includes(type) && response.status() >= 400) {
      failures.push(`${response.status()} ${response.url()}`);
    }
  });

  return failures;
}
