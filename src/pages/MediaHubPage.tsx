import { useState } from "react";
import { Play, Clock, Eye, Headphones, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useData } from "@/contexts/DataContext";

export default function MediaHubPage() {
  const { mediaItems } = useData();
  const [filter, setFilter] = useState<"all" | "video" | "podcast">("all");
  const [search, setSearch] = useState("");

  const filtered = mediaItems.filter(m => {
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
            <div className="aspect-video bg-muted relative flex items-center justify-center">
              {item.type === "video" ? <Video className="w-8 h-8 text-muted-foreground" /> : <Headphones className="w-8 h-8 text-muted-foreground" />}
              <div className="absolute top-2 left-2">
                <Badge className={item.type === "video" ? "bg-alert text-alert-foreground" : "bg-primary text-primary-foreground"}>
                  {item.type === "video" ? <Video className="w-3 h-3 mr-1" /> : <Headphones className="w-3 h-3 mr-1" />}
                  {item.type}
                </Badge>
              </div>
              <div className="absolute bottom-2 right-2 bg-foreground/80 text-background text-xs px-2 py-0.5 rounded">{item.duration}</div>
              {item.url ? (
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-foreground/30">
                  <div className="w-14 h-14 bg-alert rounded-full flex items-center justify-center">
                    <Play className="w-6 h-6 text-alert-foreground ml-1" />
                  </div>
                </a>
              ) : (
                <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-foreground/30">
                  <div className="w-14 h-14 bg-alert rounded-full flex items-center justify-center">
                    <Play className="w-6 h-6 text-alert-foreground ml-1" />
                  </div>
                </button>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-display font-bold text-base line-clamp-2 group-hover:text-alert transition-colors">{item.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
              <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                <span>{item.author}</span>
                <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{(item.views / 1000).toFixed(1)}k</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{item.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <p className="text-center text-muted-foreground py-16">No media found.</p>}
    </div>
  );
}
