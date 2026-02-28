import { FileText, AlertTriangle, FolderTree, Eye, TrendingUp, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockPosts, emergencyAlerts, navSections } from "@/data/mockData";

const stats = [
  { label: "Total Posts", value: mockPosts.length, icon: FileText, color: "text-primary" },
  { label: "Active Alerts", value: emergencyAlerts.length, icon: AlertTriangle, color: "text-destructive" },
  { label: "Categories", value: navSections.reduce((a, s) => a + s.categories.length, 0), icon: FolderTree, color: "text-info" },
  { label: "Total Views", value: mockPosts.reduce((a, p) => a + p.viewCount, 0).toLocaleString(), icon: Eye, color: "text-success" },
];

export default function AdminDashboard() {
  const recentPosts = [...mockPosts].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()).slice(0, 5);

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-foreground">Dashboard</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-md bg-muted ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Recent Posts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentPosts.map((post) => (
              <div key={post.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground line-clamp-2">{post.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{post.section} · {post.viewCount.toLocaleString()} views</p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{post.readTime}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-destructive" /> Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {emergencyAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
                <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                  alert.priority === "high" ? "bg-destructive" : alert.priority === "medium" ? "bg-warning" : "bg-info"
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{alert.text}</p>
                  <p className="text-xs text-muted-foreground mt-1 capitalize">{alert.priority} priority</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
