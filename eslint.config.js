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
    },
  },
);
