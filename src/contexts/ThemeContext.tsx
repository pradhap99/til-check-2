import { ReactNode } from "react";
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes";

/**
 * ThemeProvider — wraps `next-themes` with the til. v2 policy.
 *
 * Phase A v2 spec: dark-first, no toggle. `forcedTheme="dark"` makes
 * `document.documentElement` carry `class="dark"` from first paint
 * (preventing the input-on-input contrast bug from a stale localStorage
 * "light" preference). Light variants exist for print collateral only.
 *
 * The legacy `useTheme()` + `toggleTheme()` API is preserved so existing
 * call sites (Profile, etc.) keep working. `toggleTheme` is now a no-op;
 * Phase I will wire light mode behind a Settings → Appearance switch and
 * re-enable it then.
 */
export const ThemeProvider = ({ children }: { children: ReactNode }) => (
  <NextThemesProvider
    attribute="class"
    defaultTheme="dark"
    forcedTheme="dark"
    enableSystem={false}
    disableTransitionOnChange
  >
    {children}
  </NextThemesProvider>
);

export const useTheme = () => {
  const { resolvedTheme } = useNextTheme();
  return {
    theme: (resolvedTheme === "light" ? "light" : "dark") as "dark" | "light",
    toggleTheme: () => {
      /* No-op in v2 — dark is forced. Phase I unlocks light mode. */
    },
  };
};
