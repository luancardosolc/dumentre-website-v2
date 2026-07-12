#!/usr/bin/env node
/**
 * Static build for Cloudflare Pages: copies only the files the published site actually
 * needs into dist/, so dev-only files (tests/, docs/, package.json, playwright.config.ts,
 * tsconfig.json, node_modules/, reports) never ship to production.
 *
 * The file list below was derived from a real inventory of index.html (img/link/script/
 * meta og:image/twitter:image/JSON-LD) and site.webmanifest (icons), not guessed — see
 * docs/testing/README.md for how to re-check it after editing index.html.
 *
 * Node.js standard library only — no dependencies.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");

// Every file the published site references locally, confirmed by grepping index.html for
// img/link/script src|href, meta og:image/twitter:image, JSON-LD logo/image, and
// site.webmanifest for its icon entries. Nothing here is guessed.
const PUBLIC_FILES = [
  "index.html",
  "style.css",
  "script.js",
  "dumentre-logo-white-letters.png",
  "assets/icons/brands/whatsapp.svg",
  "favicon.ico",
  "favicon-16x16.png",
  "favicon-32x32.png",
  "apple-touch-icon.png",
  "android-chrome-192x192.png",
  "android-chrome-512x512.png",
  "site.webmanifest",
];

function fail(message) {
  console.error(`\n[build-static] ERROR: ${message}\n`);
  process.exit(1);
}

function main() {
  // 1. Verify every referenced file actually exists before touching dist/, so a broken
  //    reference fails loudly instead of silently shipping an incomplete site.
  const missing = PUBLIC_FILES.filter((relPath) => !fs.existsSync(path.join(ROOT, relPath)));
  if (missing.length > 0) {
    fail(`Referenced file(s) not found on disk, aborting build:\n  - ${missing.join("\n  - ")}`);
  }

  // 2. Remove and recreate dist/.
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  // 3. Copy each file, preserving subdirectories (e.g. assets/icons/brands/).
  for (const relPath of PUBLIC_FILES) {
    const src = path.join(ROOT, relPath);
    const dest = path.join(DIST, relPath);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }

  console.log(`[build-static] Copied ${PUBLIC_FILES.length} files to ${path.relative(ROOT, DIST)}/:`);
  for (const relPath of PUBLIC_FILES) {
    console.log(`  - ${relPath}`);
  }
}

main();
