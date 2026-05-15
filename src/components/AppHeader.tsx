import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, User as UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import CommandPalette, { CommandPaletteSearchTrigger, useCommandPaletteHotkey } from "@/components/CommandPalette";
import NotificationCenter, { type NotificationItem } from "@/components/NotificationCenter";

/**
 * AppHeader — top header for authenticated routes.
 *
 * Mobile (default): logo (→ /home) · notifications bell · avatar menu
 *   No search input, no nav links. Search is a floating action or top-of-feed input.
 *   Nav lives in the bottom nav (§2.2).
 *
 * Desktop (md+): adds the search-trigger (Cmd-K). Same chrome.
 *
 * Sticky to the top of the viewport with `pt-[env(safe-area-inset-top)]`
 * so it clears the iPhone notch.
 */
interface AppHeaderProps {
  /** Sticks to the top of the viewport. Default true. */
  sticky?: boolean;
  /** Sample / wired notification source (Phase B will replace with realtime). */
  notifications?: NotificationItem[];
}

const AppHeader: React.FC<AppHeaderProps> = ({ sticky = true, notifications }) => {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const [paletteOpen, setPaletteOpen] = React.useState(false);
  useCommandPaletteHotkey(setPaletteOpen);

  const initials = React.useMemo(() => {
    const name = (user?.user_metadata as { full_name?: string } | undefined)?.full_name ?? user?.email ?? "";
    return (
      name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join("") || "U"
    );
  }, [user]);

  if (!user) return null;

  return (
    <>
      <header
        className={
          "z-30 flex h-14 items-center gap-2 border-b border-border bg-card/85 backdrop-blur px-3 " +
          "pt-[env(safe-area-inset-top)] " +
          (sticky ? "sticky top-0 " : "")
        }
      >
        <Link to="/home" aria-label="til. home" className="inline-flex items-center min-h-11 min-w-11 -ml-1 px-2">
          <img src="/logo.svg" alt="til" className="h-7 w-auto" />
        </Link>

        <div className="hidden md:block flex-1 max-w-md">
          <CommandPaletteSearchTrigger onClick={() => setPaletteOpen(true)} />
        </div>

        <div className="flex-1" />

        <NotificationCenter items={notifications} />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full p-0.5 pr-2 min-h-11 min-w-11 text-sm font-medium hover:bg-secondary"
              aria-label="Open account menu"
            >
              <Avatar className="size-9">
                <AvatarImage src={(user?.user_metadata as { avatar_url?: string } | undefined)?.avatar_url} alt="" />
                <AvatarFallback className="bg-secondary text-secondary-foreground">{initials}</AvatarFallback>
              </Avatar>
              <ChevronDown className="size-3.5 text-muted-foreground hidden sm:inline" aria-hidden />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col">
                <span className="text-sm font-medium truncate">
                  {(user?.user_metadata as { full_name?: string } | undefined)?.full_name ?? user?.email ?? "Signed in"}
                </span>
                {role && (
                  <span className="text-xs text-muted-foreground capitalize">{role}</span>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => navigate("/profile")}>
              <UserIcon className="size-4" aria-hidden /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => navigate("/settings")}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={async () => {
                await signOut();
                navigate("/auth");
              }}
            >
              <LogOut className="size-4" aria-hidden /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </>
  );
};

export default AppHeader;
