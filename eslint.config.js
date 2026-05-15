import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
      // Phase A debt — pre-existing `any` usage in legacy pages.
      // Re-elevate to "error" page-by-page in phases C–I as each surface
      // is rebuilt.
      "@typescript-eslint/no-explicit-any": "warn",
      // Phase A debt — one occurrence in brand/PostCampaign; fixed when
      // the create-campaign flow is rebuilt in phase E.
      "no-constant-binary-expression": "warn",
      // §1.4 guard — ban hex color literals in JS/TS source.
      // Use CSS variables (hsl(var(--token))) or Tailwind classes that
      // reference the tokens. The palette source lives in
      // src/styles/tokens.css.
      "no-restricted-syntax": [
        "error",
        {
          selector: "Literal[value=/^#[0-9a-fA-F]{3,8}$/]",
          message:
            "Hex color literals are banned in JS/TS. Use design tokens (hsl(var(--token))) or Tailwind classes.",
        },
      ],
    },
  },
  {
    /* recharts attribute selectors target SVG output by colour string
       (e.g. [stroke='#ccc']) — they are pattern matchers, not values. */
    files: ["src/components/ui/chart.tsx"],
    rules: { "no-restricted-syntax": "off" },
  },
);
