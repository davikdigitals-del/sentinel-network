import { Link } from "react-router-dom";
import { mockPosts, navSections, formatTimeAgo } from "@/data/mockData";
import { Eye, Clock, ArrowRight, Download, BookOpen, Radio } from "lucide-react";

export function SidebarModules() {
  const mostRead = [...mockPosts].sort((a, b) => b.viewCount - a.viewCount).slice(0, 5);
  const latestAlerts = mockPosts
    .filter((p) => p.section === "emergency-news")
    .slice(0, 4);

  return (
    <aside className="space-y-6">
      {/* Most Read */}
      <div className="sidebar-module">
        <h3 className="section-label text-alert mb-3">Most Read</h3>
        <div className="space-y-3">
          {mostRead.map((post, i) => (
            <Link
              key={post.id}
              to={`/${post.section}/${post.category}/${post.id}`}
              className="flex items-start gap-3 group"
            >
              <span className="font-display font-bold text-xl text-muted-foreground/30 w-6 text-right shrink-0">
                {i + 1}
              </span>
              <div className="min-w-0">
                <h4 className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-alert transition-colors">
                  {post.title}
                </h4>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {(post.viewCount / 1000).toFixed(1)}k
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Latest Alerts */}
      <div className="sidebar-module border-l-2 border-alert">
        <h3 className="section-label text-alert mb-3">Latest Alerts</h3>
        <div className="space-y-3">
          {latestAlerts.map((post) => (
            <Link
              key={post.id}
              to={`/${post.section}/${post.category}/${post.id}`}
              className="block group"
            >
              <h4 className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-alert transition-colors">
                {post.title}
              </h4>
              <span className="text-xs text-muted-foreground mt-0.5 block">
                {formatTimeAgo(post.publishedAt)}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="sidebar-module">
        <h3 className="section-label text-muted-foreground mb-3">Quick Access</h3>
        <div className="space-y-2">
          {[
            { icon: Download, label: "Download Checklists", to: "/resources/checklists" },
            { icon: BookOpen, label: "Survival Encyclopaedia", to: "/encyclopaedia" },
            { icon: Radio, label: "Emergency Frequencies", to: "/tools/frequencies" },
          ].map(({ icon: Icon, label, to }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-2 text-sm font-medium hover:text-alert transition-colors"
            >
              <Icon className="w-4 h-4 text-muted-foreground" />
              {label}
              <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </div>

      {/* Top Directives */}
      <div className="sidebar-module">
        <h3 className="section-label text-muted-foreground mb-3">Top Directives</h3>
        {mockPosts
          .filter((p) => p.section === "directives")
          .slice(0, 3)
          .map((post) => (
            <Link
              key={post.id}
              to={`/${post.section}/${post.category}/${post.id}`}
              className="block group mb-3 last:mb-0"
            >
              <h4 className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-alert transition-colors">
                {post.title}
              </h4>
              <span className="text-xs text-muted-foreground">{post.author}</span>
            </Link>
          ))}
      </div>
    </aside>
  );
}
