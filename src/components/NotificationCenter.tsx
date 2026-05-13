import * as React from "react";
import { Bell, CheckCheck, Inbox } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StatusPill } from "@/components/ui/status-pill";
import { cn } from "@/lib/utils";

export interface NotificationItem {
  id: string;
  title: string;
  body?: string;
  /** ISO timestamp. */
  createdAt: string;
  read: boolean;
  href?: string;
  tone?: "neutral" | "success" | "warning" | "info";
}

interface NotificationCenterProps {
  /** Source items. Phase B will wire this to Supabase realtime. */
  items?: NotificationItem[];
  /** Mark all read. */
  onMarkAllRead?: () => void;
  /** Click a single notification. */
  onSelect?: (item: NotificationItem) => void;
}

function relativeTime(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.floor(ms / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(iso).toLocaleDateString();
}

const toneToPill: Record<NonNullable<NotificationItem["tone"]>, React.ComponentProps<typeof StatusPill>["tone"]> = {
  neutral: "neutral",
  success: "live",
  warning: "pending",
  info: "info",
};

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  items = [],
  onMarkAllRead,
  onSelect,
}) => {
  const unread = items.filter((i) => !i.read).length;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ""}`}
          className="relative"
        >
          <Bell aria-hidden />
          {unread > 0 && (
            <span
              aria-hidden
              className="absolute right-2 top-2 inline-flex h-2 w-2 rounded-full bg-status-hot ring-2 ring-card"
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[360px] p-0 border-border shadow-elev-3"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="text-sm font-semibold tracking-tight">Notifications</p>
          {unread > 0 && onMarkAllRead && (
            <button
              type="button"
              onClick={onMarkAllRead}
              className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              <CheckCheck className="size-3.5" aria-hidden /> Mark all read
            </button>
          )}
        </div>
        <ScrollArea className="max-h-[420px]">
          {items.length === 0 ? (
            <EmptyState
              size="sm"
              title="You're all caught up"
              description="When something happens, it'll show up here."
              illustration={
                <div className="inline-flex size-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                  <Inbox aria-hidden />
                </div>
              }
            />
          ) : (
            <ul className="divide-y divide-border">
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onSelect?.(item)}
                    className={cn(
                      "block w-full px-4 py-3 text-left transition-colors duration-fast ease-out-soft hover:bg-secondary/60",
                      !item.read && "bg-primary/[0.04]",
                    )}
                  >
                    <div className="flex items-start gap-2">
                      {!item.read && (
                        <span aria-hidden className="mt-1 inline-block size-1.5 rounded-full bg-champagne" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium truncate">{item.title}</p>
                          <span className="font-numeric text-xs text-muted-foreground shrink-0" data-numeric="true">
                            {relativeTime(item.createdAt)}
                          </span>
                        </div>
                        {item.body && (
                          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                            {item.body}
                          </p>
                        )}
                        {item.tone && item.tone !== "neutral" && (
                          <StatusPill
                            tone={toneToPill[item.tone]}
                            size="sm"
                            className="mt-1.5"
                          >
                            {item.tone}
                          </StatusPill>
                        )}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
