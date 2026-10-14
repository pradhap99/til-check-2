## 2026-10-14 - Collapsible controls and DOM nesting
**Learning:** Nesting action buttons inside collapsible header `<button>` elements creates invalid HTML DOM nesting, triggering React DOM warnings and breaking keyboard/screen reader navigation.
**Action:** Always separate the collapsible header trigger button from auxiliary secondary actions (like Export buttons) and add `aria-expanded` and `aria-controls` for accessible screen reader feedback.
