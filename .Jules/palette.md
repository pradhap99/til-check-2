# Palette's Journal

## 2025-05-18 - Navigation Bar Accessibility (`aria-current` & Focus States)
**Learning:** Fixed bottom navigation links lack `aria-current="page"` and visible focus rings, making screen reader and keyboard navigation unclear.
**Action:** Always provide `aria-current={isActive ? "page" : undefined}` and `focus-visible:ring-2` on custom bottom bar navigation elements.
