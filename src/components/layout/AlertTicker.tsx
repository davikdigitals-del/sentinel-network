import { AlertTriangle } from "lucide-react";

interface Alert {
  id: string;
  text: string;
  priority: "high" | "medium" | "low";
}

export function AlertTicker({ alerts }: { alerts: Alert[] }) {
  const highPriority = alerts.filter((a) => a.priority === "high");
  const displayAlerts = highPriority.length > 0 ? highPriority : alerts.slice(0, 1);

  if (displayAlerts.length === 0) return null;

  return (
    <div className="bg-alert text-alert-foreground overflow-hidden">
      <div className="container flex items-center h-8 gap-3">
        <div className="flex items-center gap-1.5 shrink-0">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span className="text-xs font-bold uppercase tracking-wide">Breaking</span>
        </div>
        <div className="overflow-hidden flex-1">
          <div className="flex gap-16 animate-ticker whitespace-nowrap">
            {[...displayAlerts, ...displayAlerts].map((alert, i) => (
              <span key={`${alert.id}-${i}`} className="text-xs font-medium">
                {alert.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
