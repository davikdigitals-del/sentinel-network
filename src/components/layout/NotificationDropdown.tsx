import { useState } from "react";
import { Bell, Check, CheckCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { formatTimeAgo } from "@/data/mockData";
import { Button } from "@/components/ui/button";

export function NotificationDropdown() {
  const { notifications, markNotificationRead, markAllNotificationsRead, unreadCount } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 hover:bg-primary/20 rounded transition-colors relative"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 bg-alert text-alert-foreground text-[10px] font-bold rounded-full flex items-center justify-center px-1">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-sm shadow-xl z-50 animate-slide-down">
            <div className="flex items-center justify-between p-3 border-b border-border">
              <h3 className="font-display font-bold text-sm text-foreground">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <>
                    <span className="text-xs text-alert font-semibold">{unreadCount} new</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs px-2"
                      onClick={() => markAllNotificationsRead()}
                    >
                      <CheckCheck className="w-3 h-3 mr-1" /> Mark all read
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto divide-y divide-border">
              {notifications.length === 0 && (
                <p className="p-4 text-sm text-muted-foreground text-center">No notifications</p>
              )}
              {notifications.map(n => (
                <div
                  key={n.id}
                  className={`p-3 hover:bg-muted/50 transition-colors cursor-pointer ${!n.read ? "bg-alert/5" : ""}`}
                  onClick={() => { markNotificationRead(n.id); }}
                >
                  <div className="flex items-start gap-2">
                    <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!n.read ? "bg-alert" : "bg-muted"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{n.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatTimeAgo(n.timestamp)}</p>
                    </div>
                    {!n.read && <Check className="w-3 h-3 text-muted-foreground mt-1 shrink-0" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
