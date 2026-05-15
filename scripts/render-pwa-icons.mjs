// One-shot renderer for the PWA icon set: 192, 512, and apple-touch (180).
// Renders public/logo-mark.svg onto a #0A0A0A rounded square. Run after
// the logo files change: `node scripts/render-pwa-icons.mjs`.

const candidates = [
  "playwright",
  process.env.PLAYWRIGHT_MODULE_PATH,
  process.env.PLAYWRIGHT_NODE_MODULES && `${process.env.PLAYWRIGHT_NODE_MODULES}/playwright/index.mjs`,
].filter(Boolean);

let chromium;
let lastErr;
for (const spec of candidates) {
  try { ({ chromium } = await import(spec)); break; }
  catch (e) { lastErr = e; }
}
if (!chromium) {
  console.error("playwright not found");
  if (lastErr) console.error(lastErr.message);
  process.exit(2);
}

const fs = await import("node:fs/promises");
const svg = await fs.readFile("public/logo-mark.svg", "utf8");

const icons = [
  { size: 180, out: "public/apple-touch-icon.png", radius: 0.18 },
  { size: 192, out: "public/icon-192.png",         radius: 0.18 },
  { size: 512, out: "public/icon-512.png",         radius: 0.18 },
];

const browser = await chromium.launch({ args: ["--no-sandbox", "--disable-dev-shm-usage"] });
try {
  for (const { size, out, radius } of icons) {
    const html = `<!doctype html>
<html><head><style>
  html, body { margin: 0; padding: 0; width: ${size}px; height: ${size}px; background: transparent; }
  .icon {
    width: ${size}px; height: ${size}px;
    background: #0A0A0A;
    border-radius: ${Math.round(size * radius)}px;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
  }
  .icon svg { width: 76%; height: 76%; }
</style></head>
<body><div class="icon">${svg}</div></body></html>`;
    const ctx = await browser.newContext({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.setContent(html, { waitUntil: "networkidle" });
    await page.screenshot({ path: out, omitBackground: false });
    await ctx.close();
    console.log(`✓ wrote ${out}`);
  }
} finally {
  await browser.close();
}
