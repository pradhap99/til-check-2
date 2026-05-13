import * as React from "react";
import CommandPalette, { useCommandPaletteHotkey } from "@/components/CommandPalette";

/**
 * GlobalCommandPalette — mount once at the app root so Cmd/Ctrl-K
 * works on every authenticated route regardless of which layout wraps
 * the page. Existing surfaces can still mount their own AppHeader with
 * a visible search trigger; this one provides the keyboard fallback.
 */
const GlobalCommandPalette: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  useCommandPaletteHotkey(setOpen);
  return <CommandPalette open={open} onOpenChange={setOpen} />;
};

export default GlobalCommandPalette;
