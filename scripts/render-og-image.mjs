// One-shot renderer for public/og-default.png.
// Builds a 1200×630 dark card with the til. wordmark + tagline.
// Run after the wordmark/spec changes: `node scripts/render-og-image.mjs`.

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
  } catch (e) { lastErr = e; }
}
if (!chromium) {
  console.error("playwright not found");
  if (lastErr) console.error(lastErr.message);
  process.exit(2);
}

const out = process.env.OG_OUT ?? "public/og-default.png";

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
  @import url("data:text/css,") screen;
  html, body { margin: 0; padding: 0; background: #0A0A0A; width: 1200px; height: 630px; overflow: hidden; }
  .card {
    position: relative;
    width: 1200px; height: 630px;
    background:
      radial-gradient(ellipse at 30% 20%, rgba(212,175,55,0.18) 0%, transparent 55%),
      radial-gradient(ellipse at 80% 90%, rgba(139,105,20,0.22) 0%, transparent 50%),
      #0A0A0A;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    font-family: Georgia, "Times New Roman", serif;
  }
  .wordmark {
    font-style: italic;
    font-weight: 500;
    font-size: 220px;
    line-height: 1;
    letter-spacing: -6px;
    background: linear-gradient(180deg, #F5E6A8 0%, #D4AF37 45%, #8B6914 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
    margin: 0;
    display: inline-flex;
    align-items: baseline;
  }
  .wordmark .ring {
    position: relative;
    width: 70px; height: 70px;
    margin-left: 10px;
    margin-bottom: 10px;
  }
  .wordmark .ring svg { width: 100%; height: 100%; }
  .tagline {
    margin-top: 36px;
    font-family: -apple-system, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 32px;
    letter-spacing: 0.05em;
    color: #C9A961;
    text-transform: lowercase;
  }
  .sub {
    margin-top: 14px;
    font-family: -apple-system, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
    font-size: 22px;
    color: #6B6760;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }
  .hairline {
    position: absolute;
    left: 80px; right: 80px; bottom: 80px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent);
  }
</style>
</head>
<body>
  <div class="card">
    <div class="wordmark">
      til<span class="ring">
        <svg viewBox="0 0 100 100">
          <defs>
            <linearGradient id="r" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#F5E6A8"/>
              <stop offset="45%" stop-color="#D4AF37"/>
              <stop offset="100%" stop-color="#8B6914"/>
            </linearGradient>
            <linearGradient id="c" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#E8D5A0"/>
              <stop offset="100%" stop-color="#C9A961"/>
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="42" fill="none" stroke="url(#r)" stroke-width="8"/>
          <circle cx="60" cy="50" r="28" fill="url(#c)"/>
        </svg>
      </span>
    </div>
    <div class="tagline">where brands meet people</div>
    <div class="sub">Chennai · invite-only</div>
    <div class="hairline"></div>
  </div>
</body>
</html>`;

const browser = await chromium.launch({ args: ["--no-sandbox", "--disable-dev-shm-usage"] });
try {
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.screenshot({ path: out, fullPage: false, omitBackground: false });
  console.log(`✓ wrote ${out}`);
} finally {
  await browser.close();
}
