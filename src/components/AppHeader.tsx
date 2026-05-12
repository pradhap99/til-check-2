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

interface AppHeaderProps {
  /** When set, header is fixed to the top. */
  sticky?: boolean;
  /** Sample / wired notification source (Phase B will replace with realtime). */
  notifications?: NotificationItem[];
}

const AppHeader: React.FC<AppHeaderProps> = ({ sticky, notifications }) => {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const [paletteOpen, setPaletteOpen] = React.useState(false);
  useCommandPaletteHotkey(setPaletteOpen);

  const initials = React.useMemo(() => {
    const name = (user?.user_metadata as { full_name?: string } | undefined)?.full_name ?? user?.email ?? "";
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "U";
  }, [user]);

  return (
    <>
      <header
        className={
          "z-30 flex h-14 items-center gap-3 border-b border-border bg-card/85 px-3 backdrop-blur lg:pl-20 xl:pl-64 lg:pr-6 " +
          (sticky ? "sticky top-0 " : "")
        }
      >
        <Link to="/home" aria-label="til-check home" className="inline-flex items-center gap-2 lg:hidden">
          <span aria-hidden className="inline-block size-7 rounded-md bg-gradient-brand shadow-elev-1" />
        </Link>

        <div className="hidden flex-1 sm:block max-w-md">
          <CommandPaletteSearchTrigger onClick={() => setPaletteOpen(true)} />
        </div>

        <div className="flex-1 sm:hidden" />

        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          className="inline-flex size-10 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground sm:hidden"
          aria-label="Search"
        >
          <span aria-hidden>⌘K</span>
        </button>

        <NotificationCenter items={notifications} />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full p-0.5 pr-2 text-sm font-medium hover:bg-secondary"
              aria-label="Open account menu"
            >
              <Avatar className="size-8">
                <AvatarImage src={(user?.user_metadata as { avatar_url?: string } | undefined)?.avatar_url} alt="" />
                <AvatarFallback className="bg-secondary text-secondary-foreground">{initials}</AvatarFallback>
              </Avatar>
              <ChevronDown className="size-3.5 text-muted-foreground" aria-hidden />
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
