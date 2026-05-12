// Phase A — visual smoke test for the /showcase route.
//
// Usage:
//   bunx vite preview --port 4173 &
//   bun add -d playwright   # or: npx playwright install chromium
//   node scripts/showcase-screenshot.mjs
//
// Env overrides:
//   SHOWCASE_URL       default http://127.0.0.1:4173/showcase
//   SHOWCASE_MODE      dark | light                       (default dark)
//   SHOWCASE_VIEWPORT  desktop | mobile                   (default desktop)
//   SHOWCASE_OUT       output path                        (default showcase-<mode>.png)
//
// Resolves playwright from the project first, then falls back to a global
// install under NODE_PATH or PLAYWRIGHT_NODE_MODULES so this works in
// sandboxes where chromium ships pre-baked under a non-standard prefix.

const candidates = [
  "playwright",
  process.env.PLAYWRIGHT_MODULE_PATH,
  process.env.PLAYWRIGHT_NODE_MODULES && `${process.env.PLAYWRIGHT_NODE_MODULES}/playwright/index.mjs`,
].filter(Boolean);

let chromium;
let lastErr;
for (const spec of candidates) {
  try {
    ({ chromium } = await import(spec));
    break;
  } catch (e) {
    lastErr = e;
  }
}
if (!chromium) {
  console.error("playwright not found. Try: bun add -d playwright && bunx playwright install chromium");
  if (lastErr) console.error(lastErr.message);
  process.exit(2);
}

const url = process.env.SHOWCASE_URL ?? "http://127.0.0.1:4173/showcase";
const mode = (process.env.SHOWCASE_MODE ?? "dark").toLowerCase();
const out = process.env.SHOWCASE_OUT ?? `showcase-${mode}.png`;
const viewport = (process.env.SHOWCASE_VIEWPORT ?? "desktop").toLowerCase();

const sizes = {
  desktop: { width: 1280, height: 800, deviceScaleFactor: 2 },
  mobile:  { width: 390,  height: 844, deviceScaleFactor: 2 },
};

const browser = await chromium.launch({
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
try {
  const ctx = await browser.newContext({
    viewport: sizes[viewport],
    deviceScaleFactor: sizes[viewport].deviceScaleFactor,
    colorScheme: mode === "light" ? "light" : "dark",
  });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 });
  await page.evaluate((m) => {
    if (m === "light") document.documentElement.classList.remove("dark");
    else document.documentElement.classList.add("dark");
  }, mode);
  await page.waitForTimeout(800);
  await page.screenshot({ path: out, fullPage: true });
  console.log(`✓ wrote ${out} (${mode}, ${viewport})`);
} finally {
  await browser.close();
}
