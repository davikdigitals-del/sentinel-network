import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";

interface MediaItem {
  id: string;
  title: string;
  type: string;
  thumbnail?: string;
  duration?: string;
  author?: string;
}

interface LibraryItem {
  id: string;
  title: string;
  author?: string;
  format?: string;
  pages?: number;
  coverImageUrl?: string;
}

interface MediaLibrarySectionProps {
  mediaItems: MediaItem[];
  libraryItems: LibraryItem[];
}

const MediaLibrarySection = ({ mediaItems, libraryItems }: MediaLibrarySectionProps) => {
  if (mediaItems.length === 0 && libraryItems.length === 0) return null;

  return (
    <section className="bg-card border-b border-border">
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Podcasts & Videos */}
          {mediaItems.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-lg border-l-4 border-alert pl-3">
                  Podcasts & Videos
                </h2>
                <Link
                  to="/media"
                  className="text-xs font-semibold text-alert hover:underline flex items-center gap-1"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-3">
                {mediaItems.slice(0, 4).map((item) => (
                  <Link key={item.id} to="/media" className="group flex gap-3">
                    <div className="w-28 h-20 bg-muted shrink-0 overflow-hidden relative">
                      {item.thumbnail && (
                        <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="w-6 h-6 text-card fill-card/80" />
                      </div>
                    </div>
                    <div className="min-w-0 flex flex-col justify-center">
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {item.type}
                      </span>
                      <h4 className="text-sm font-bold line-clamp-2 group-hover:text-alert transition-colors">
                        {item.title}
                      </h4>
                      <span className="text-xs text-muted-foreground mt-0.5">
                        {item.duration} · {item.author}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Library */}
          {libraryItems.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-lg border-l-4 border-alert pl-3">
                  Library
                </h2>
                <Link
                  to="/library"
                  className="text-xs font-semibold text-alert hover:underline flex items-center gap-1"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-3">
                {libraryItems.slice(0, 4).map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-20 bg-primary/10 shrink-0 overflow-hidden flex items-center justify-center">
                      {item.coverImageUrl ? (
                        <img src={item.coverImageUrl} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] text-muted-foreground font-semibold">
                          {item.format}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex flex-col justify-center">
                      <h4 className="text-sm font-bold line-clamp-2">{item.title}</h4>
                      <span className="text-xs text-muted-foreground">
                        {item.author} · {item.pages} pages
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MediaLibrarySection;
