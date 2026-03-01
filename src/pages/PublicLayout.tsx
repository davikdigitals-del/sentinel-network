import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { AlertTicker } from "@/components/layout/AlertTicker";
import { Outlet } from "react-router-dom";
import { useData } from "@/contexts/DataContext";

export default function PublicLayout() {
  const { banner, alerts } = useData();

  return (
    <div className="min-h-screen flex flex-col">
      {banner.enabled && (
        <AlertTicker alerts={alerts.length > 0 ? alerts : [{ id: "banner", text: banner.text, priority: banner.priority }]} />
      )}
      <SiteHeader />
      <div className="flex-1">
        <Outlet />
      </div>
      <SiteFooter />
    </div>
  );
}
