## 2025-03-22 - Landmark & Active Link ARIA Standards in Mobile Bottom Navigation
**Learning:** Fixed bottom navigation components (`BottomNav` and `BrandBottomNav`) were missing landmark `aria-label`s and `aria-current="page"` attributes, making it difficult for screen reader users to identify active routes.
**Action:** Always verify that `<nav>` landmarks have descriptive labels and active `Link` components carry `aria-current="page"` in React Router layouts.
