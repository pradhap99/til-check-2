## 2026-10-12 - Bottom Navigation Accessibility & Focus Indicators
**Learning:** Fixed bottom navigation links need explicit `aria-label` on the `<nav>` landmark, `aria-current="page"` on the active tab, and `focus-visible:ring-2` styles so keyboard and screen reader users can navigate easily.
**Action:** Always include `aria-label` on `<nav>`, `aria-current="page"` for active tab links, `aria-hidden="true"` on decorative icons, and visible focus rings on navigation links.
