## 2025-05-18 - Avoid Nested Buttons in Header Triggers
**Learning:** Placing interactive elements (such as an "Export" button) inside an outer toggle `<button>` causes invalid HTML (`validateDOMNesting`), breaking screen readers, keyboard navigation, and event bubbling.
**Action:** Always structure card header actions as sibling elements inside a standard container element, giving collapsible triggers appropriate `aria-expanded` and `aria-controls` attributes.
