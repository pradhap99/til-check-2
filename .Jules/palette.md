## 2026-03-31 - Separate Nested Interactive Elements
**Learning:** Placing interactive controls like buttons inside an outer `<button>` violates HTML standards and breaks screen reader and keyboard access. Always separate interactive controls into sibling `<button>` elements within a container `<div>` with explicit `aria-expanded` and `aria-label` attributes.
**Action:** When creating collapsible header bars with quick actions (such as Export), structure the toggle heading and action as sibling `<button>` elements instead of nesting them.
