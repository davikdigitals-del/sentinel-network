import { useState } from "react";
import { Play, Clock, Eye, Headphones, Video, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useData, type MediaItem } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";

function getYoutubeEmbed(url: string) {
  if (!url.includes("youtube.com") && !url.includes("youtu.be")) return null;
  const videoId = url.includes("youtu.be/")
    ? url.split("youtu.be/")[1]?.split(/[?&]/)[0]
    : new URL(url).searchParams.get("v");
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}`;
}

export default function MediaHubPage() {
  const { mediaItems } = useData();
  const { user } = useAuth();
  const [filter, setFilter] = useState<"all" | "video" | "podcast">("all");
  const [search, setSearch] = useState("");
  const [activeMedia, setActiveMedia] = useState<MediaItem | null>(null);

  const filtered = mediaItems.filter((m) => {
    const matchType = filter === "all" || m.type === filter;
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase());
    const countryCodes = m.countryCodes || [];
    const matchCountry = countryCodes.length === 0 || (user ? countryCodes.includes(user.country) : false);
    return matchType && matchSearch && matchCountry;
  });

  const embedUrl = activeMedia?.url ? getYoutubeEmbed(activeMedia.url) : null;

  return (
    <div className="container py-8">
      <h1 className="font-display font-bold text-3xl md:text-4xl mb-2">Podcasts & Videos</h1>
      <p className="text-muted-foreground mb-6">Educational media to help you prepare, learn, and stay informed.</p>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Input placeholder="Search media..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-md" />
        <div className="flex gap-2">
          {(["all", "video", "podcast"] as const).map((t) => (
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
        {filtered.map((item) => (
          <button key={item.id} className="card-news group text-left" onClick={() => setActiveMedia(item)}>
            <div className="aspect-video bg-muted relative flex items-center justify-center overflow-hidden">
              {item.thumbnail ? (
                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
              ) : item.type === "video" ? (
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
              <div className="absolute bottom-2 right-2 bg-foreground/80 text-background text-xs px-2 py-0.5 rounded">{item.duration}</div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-foreground/30">
                <div className="w-14 h-14 bg-alert rounded-full flex items-center justify-center">
                  <Play className="w-6 h-6 text-alert-foreground ml-1" />
                </div>
              </div>
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
          </button>
        ))}
      </div>

      {filtered.length === 0 && <p className="text-center text-muted-foreground py-16">No media found.</p>}

      <Dialog open={!!activeMedia} onOpenChange={() => setActiveMedia(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{activeMedia?.title}</DialogTitle>
          </DialogHeader>

          {activeMedia?.url ? (
            embedUrl ? (
              <div className="aspect-video">
                <iframe src={embedUrl} title={activeMedia.title} className="w-full h-full rounded-sm" allowFullScreen />
              </div>
            ) : activeMedia.type === "video" ? (
              <video controls className="w-full rounded-sm" src={activeMedia.url} />
            ) : (
              <audio controls className="w-full" src={activeMedia.url} />
            )
          ) : (
            <p className="text-sm text-muted-foreground">No playable URL provided yet.</p>
          )}

          {activeMedia?.url && (
            <Button asChild variant="outline" className="w-fit">
              <a href={activeMedia.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-1" /> Open in new tab
              </a>
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
