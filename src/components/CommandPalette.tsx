import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Sparkles,
  Home,
  Compass,
  MessageSquare,
  Inbox,
  User,
  Megaphone,
  Settings as SettingsIcon,
  LineChart,
  Bookmark,
  HelpCircle,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useAuth } from "@/contexts/AuthContext";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface PaletteAction {
  id: string;
  label: string;
  hint?: string;
  icon: React.ComponentType<{ className?: string }>;
  run: () => void;
  group: "Navigate" | "AI" | "Account";
}

/**
 * CommandPalette — Cmd-K powered navigation, search and AI quick actions.
 *
 * In Phase A this ships with navigation + AI placeholders. Phase D/E will
 * extend the AI items to actually invoke aiCall() and Phase F will add
 * the debounced creators/campaigns search.
 */
const CommandPalette: React.FC<CommandPaletteProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const { role } = useAuth();

  const close = React.useCallback(() => onOpenChange(false), [onOpenChange]);
  const go = (to: string) => () => {
    close();
    navigate(to);
  };

  const actions: PaletteAction[] = React.useMemo(() => {
    const items: PaletteAction[] = [
      { id: "nav-home",       label: "Home",         hint: "Personalized feed",   icon: Home,           run: go("/home"),         group: "Navigate" },
      { id: "nav-campaigns",  label: "Campaigns",    hint: "Browse the marketplace", icon: Compass,     run: go("/campaigns"),    group: "Navigate" },
      { id: "nav-messages",   label: "Messages",     hint: "Realtime chat",       icon: MessageSquare,  run: go("/messages"),     group: "Navigate" },
      { id: "nav-applications", label: "Applications", hint: "Your active loop",  icon: Inbox,          run: go("/applications"), group: "Navigate" },
      { id: "nav-profile",    label: "Profile",      hint: "Public profile",      icon: User,           run: go("/profile"),      group: "Navigate" },
      { id: "nav-analytics",  label: "Analytics",    hint: "Performance dashboards", icon: LineChart,   run: go("/analytics"),    group: "Navigate" },
      { id: "nav-settings",   label: "Settings",     hint: "Preferences",         icon: SettingsIcon,   run: go("/settings"),     group: "Account" },
      { id: "nav-help",       label: "Help & docs",  hint: "Ask in plain English", icon: HelpCircle,    run: go("/help"),         group: "Account" },
    ];

    if (role === "brand") {
      items.splice(2, 0,
        { id: "nav-create-campaign", label: "New campaign", hint: "Draft a brief with AI", icon: Megaphone, run: go("/campaigns/create"), group: "Navigate" },
        { id: "nav-saved",           label: "Saved creators", hint: "Your shortlist",      icon: Bookmark,  run: go("/saved"),            group: "Navigate" },
      );
    }

    items.push(
      { id: "ai-draft-brief", label: "✨ Draft a brief with AI",  hint: "Llama 3.1 8B",          icon: Sparkles, run: go("/campaigns/create?ai=draft"), group: "AI" },
      { id: "ai-find-like",   label: "✨ Find creators like…",     hint: "Embedding search",     icon: Sparkles, run: go("/recommendations"),          group: "AI" },
      { id: "ai-summarize",   label: "✨ Summarize my chat",       hint: "Coming in phase F",    icon: Sparkles, run: () => {/* placeholder */},      group: "AI" },
    );

    return items;
  }, [role, navigate, close]); // eslint-disable-line react-hooks/exhaustive-deps

  const groups = ["Navigate", "AI", "Account"] as const;

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search pages, people, AI actions…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        {groups.map((g, gi) => {
          const items = actions.filter((a) => a.group === g);
          if (!items.length) return null;
          return (
            <React.Fragment key={g}>
              {gi > 0 && <CommandSeparator />}
              <CommandGroup heading={g}>
                {items.map((a) => (
                  <CommandItem key={a.id} value={`${a.label} ${a.hint ?? ""}`} onSelect={a.run}>
                    <a.icon className="size-4 text-muted-foreground" aria-hidden />
                    <span className="flex-1">{a.label}</span>
                    {a.hint && (
                      <span className="text-xs text-muted-foreground">{a.hint}</span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </React.Fragment>
          );
        })}
      </CommandList>
    </CommandDialog>
  );
};

/** Hook: bind Cmd/Ctrl-K to open state. */
export function useCommandPaletteHotkey(setOpen: (next: boolean | ((p: boolean) => boolean)) => void) {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);
}

/** Search-input trigger that opens the palette on click or Cmd-K. */
export const CommandPaletteSearchTrigger: React.FC<{ onClick: () => void; className?: string }> = ({
  onClick,
  className,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={
      "inline-flex h-10 w-full items-center gap-2 rounded-md border border-border bg-secondary/60 px-3 text-sm text-muted-foreground transition-colors duration-fast ease-out-soft hover:bg-secondary " +
      (className ?? "")
    }
  >
    <Search className="size-4" aria-hidden />
    <span className="flex-1 text-left">Search creators, campaigns, AI actions…</span>
    <kbd className="hidden sm:inline-flex items-center gap-1 rounded-sm border border-border bg-card px-1.5 py-0.5 text-[10px] font-numeric text-muted-foreground">
      ⌘K
    </kbd>
  </button>
);

export default CommandPalette;
