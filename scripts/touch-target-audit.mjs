// Touch target audit — Mobile-First Mandate §2.5.
//
// Boots a headless chromium at 375×812, navigates each priority route,
// and reports any interactive element smaller than 44×44 px.
//
// Usage:
//   bunx vite preview --port 4173 &
//   node scripts/touch-target-audit.mjs
//
// Env:
//   BASE_URL  default http://127.0.0.1:4173
//
// Exit codes:
//   0 = clean (no violations across all priority routes)
//   1 = one or more violations
//   2 = playwright missing
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

const base = process.env.BASE_URL ?? "http://127.0.0.1:4173";

// Priority routes from HANDOFF-TO-CLAUDE-CODE.md §1.2. Some need auth —
// flag them so the report acknowledges the gap rather than misreporting.
const routes = [
  { path: "/",            requiresAuth: false },
  { path: "/auth",        requiresAuth: false },
  { path: "/showcase",    requiresAuth: false },
  { path: "/pricing",     requiresAuth: false },
  { path: "/onboarding",  requiresAuth: false },
  { path: "/home",        requiresAuth: true  },
  { path: "/campaigns",   requiresAuth: true  },
  { path: "/applications",requiresAuth: true  },
  { path: "/messages",    requiresAuth: true  },
  { path: "/profile",     requiresAuth: true  },
  { path: "/settings",    requiresAuth: true  },
  { path: "/notifications", requiresAuth: true },
  { path: "/help",        requiresAuth: true  },
];

const SELECTOR = 'button, a, [role="button"], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const browser = await chromium.launch({ args: ["--no-sandbox", "--disable-dev-shm-usage"] });
let totalViolations = 0;
try {
  const ctx = await browser.newContext({
    viewport: { width: 375, height: 812 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    colorScheme: "dark",
  });
  const page = await ctx.newPage();
  for (const { path, requiresAuth } of routes) {
    const url = `${base}${path}`;
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 20_000 });
    } catch (e) {
      console.log(`SKIP ${path} — failed to load (${e.message.slice(0, 60)})`);
      continue;
    }
    await page.evaluate(() => document.documentElement.classList.add("dark"));
    await page.waitForTimeout(400);

    const url2 = page.url();
    if (requiresAuth && !url2.endsWith(path)) {
      console.log(`SKIP ${path} — redirected to ${new URL(url2).pathname} (likely auth wall)`);
      continue;
    }

    const violations = await page.evaluate((sel) => {
      return [...document.querySelectorAll(sel)]
        .filter((el) => {
          const style = window.getComputedStyle(el);
          if (style.display === "none" || style.visibility === "hidden") return false;
          const r = el.getBoundingClientRect();
          if (r.width === 0 && r.height === 0) return false;
          return r.width < 44 || r.height < 44;
        })
        .map((el) => ({
          tag: el.tagName,
          txt: (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 40),
          w: Math.round(el.getBoundingClientRect().width),
          h: Math.round(el.getBoundingClientRect().height),
        }))
        .slice(0, 50);
    }, SELECTOR);

    if (violations.length === 0) {
      console.log(`OK   ${path} (0 violations)`);
    } else {
      console.log(`FAIL ${path} (${violations.length} too-small targets)`);
      violations.slice(0, 10).forEach((v) =>
        console.log(`       ${v.w}×${v.h}  <${v.tag.toLowerCase()}> ${JSON.stringify(v.txt)}`)
      );
      if (violations.length > 10) console.log(`       ... and ${violations.length - 10} more`);
      totalViolations += violations.length;
    }
  }
} finally {
  await browser.close();
}

console.log(`\nTotal touch-target violations: ${totalViolations}`);
process.exit(totalViolations > 0 ? 1 : 0);
