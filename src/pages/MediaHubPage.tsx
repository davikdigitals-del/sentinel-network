import { useState } from "react";
import { Play, Download, Clock, Eye, Headphones, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface MediaItem {
  id: string;
  title: string;
  description: string;
  type: "podcast" | "video";
  duration: string;
  views: number;
  publishedAt: string;
  thumbnail?: string;
  author: string;
  tags: string[];
}

export const mockMediaItems: MediaItem[] = [
  { id: "v1", title: "Emergency Preparedness 101: Getting Started", description: "A beginner's guide to building your emergency preparedness plan from scratch.", type: "video", duration: "24:15", views: 12400, publishedAt: "2026-02-25", author: "Sarah Mitchell", tags: ["beginner", "planning"] },
  { id: "p1", title: "Survival Mindset: Building Mental Resilience", description: "Psychologist Dr. Rachel Green discusses mental preparedness strategies.", type: "podcast", duration: "45:30", views: 8900, publishedAt: "2026-02-24", author: "Dr. Rachel Green", tags: ["mental-health", "resilience"] },
  { id: "v2", title: "How to Build a 72-Hour Emergency Kit", description: "Step-by-step video guide to assembling the essential emergency kit.", type: "video", duration: "18:42", views: 23100, publishedAt: "2026-02-22", author: "Captain David Hughes", tags: ["kit", "essentials"] },
  { id: "p2", title: "NATO Civil Preparedness Explained", description: "Understanding what NATO's civilian readiness framework means for you.", type: "podcast", duration: "38:20", views: 6700, publishedAt: "2026-02-20", author: "James Crawford", tags: ["NATO", "policy"] },
  { id: "v3", title: "Water Purification Methods Demonstrated", description: "Practical demonstration of 5 water purification techniques.", type: "video", duration: "15:33", views: 31500, publishedAt: "2026-02-18", author: "Dr. Emily Rogers", tags: ["water", "purification"] },
  { id: "p3", title: "Community Resilience: Learning from Past Disasters", description: "Case studies of communities that thrived during crisis situations.", type: "podcast", duration: "52:10", views: 5400, publishedAt: "2026-02-15", author: "Tom Barrett", tags: ["community", "resilience"] },
];

export default function MediaHubPage() {
  const [filter, setFilter] = useState<"all" | "video" | "podcast">("all");
  const [search, setSearch] = useState("");

  const filtered = mockMediaItems.filter(m => {
    const matchType = filter === "all" || m.type === filter;
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="container py-8">
      <h1 className="font-display font-bold text-3xl md:text-4xl mb-2">Podcasts & Videos</h1>
      <p className="text-muted-foreground mb-6">Educational media to help you prepare, learn, and stay informed.</p>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Input placeholder="Search media..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-md" />
        <div className="flex gap-2">
          {(["all", "video", "podcast"] as const).map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`category-pill transition-colors ${filter === t ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-foreground hover:text-background"}`}
            >
              {t === "all" ? "All" : t === "video" ? "Videos" : "Podcasts"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(item => (
          <div key={item.id} className="card-news group">
            {/* Thumbnail */}
            <div className="aspect-video bg-muted relative flex items-center justify-center">
              {item.type === "video" ? (
                <Video className="w-8 h-8 text-muted-foreground" />
              ) : (
                <Headphones className="w-8 h-8 text-muted-foreground" />
              )}
              <div className="absolute top-2 left-2">
                <Badge className={item.type === "video" ? "bg-alert text-alert-foreground" : "bg-primary text-primary-foreground"}>
                  {item.type === "video" ? <Video className="w-3 h-3 mr-1" /> : <Headphones className="w-3 h-3 mr-1" />}
                  {item.type}
                </Badge>
              </div>
              <div className="absolute bottom-2 right-2 bg-foreground/80 text-background text-xs px-2 py-0.5 rounded">
                {item.duration}
              </div>
              <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-foreground/30">
                <div className="w-14 h-14 bg-alert rounded-full flex items-center justify-center">
                  <Play className="w-6 h-6 text-alert-foreground ml-1" />
                </div>
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-display font-bold text-base line-clamp-2 group-hover:text-alert transition-colors">{item.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
              <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                <span>{item.author}</span>
                <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{(item.views / 1000).toFixed(1)}k</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{item.duration}</span>
              </div>
              <Button size="sm" variant="outline" className="w-full mt-3 text-xs">
                <Download className="w-3 h-3 mr-1" /> Download
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
