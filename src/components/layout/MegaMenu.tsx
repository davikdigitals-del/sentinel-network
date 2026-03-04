import { Link } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import type { NavSection } from "@/data/mockData";

interface MegaMenuProps {
  section: NavSection;
  onClose: () => void;
}

export function MegaMenu({ section, onClose }: MegaMenuProps) {
  const { publishedPosts } = useData();
  const pinnedPost =
    publishedPosts.find((p) => p.section === section.slug && p.isPinned) ||
    publishedPosts.find((p) => p.section === section.slug);

  return (
    <div
      className="absolute left-0 right-0 top-full bg-card border-b border-border shadow-xl z-50 animate-slide-down"
      onMouseLeave={onClose}
    >
      <div className="container py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="section-label text-muted-foreground mb-3">Categories</h3>
            <ul className="space-y-2">
              {section.categories.map((cat) => (
                <li key={cat.slug}>
                  <Link to={`/${section.slug}/${cat.slug}`} className="text-sm font-medium text-foreground hover:text-alert transition-colors" onClick={onClose}>
                    {cat.title}
                  </Link>
                </li>
              ))}
            </ul>
            <Link to={`/${section.slug}`} className="inline-block mt-3 text-xs font-semibold text-alert hover:underline" onClick={onClose}>
              View all →
            </Link>
          </div>

          <div>
            <h3 className="section-label text-muted-foreground mb-3">Tools & Programs</h3>
            {section.tools && section.tools.length > 0 ? (
              <ul className="space-y-2">
                {section.tools.map((tool) => (
                  <li key={tool.slug}>
                    <Link to={`/${section.slug}`} className="text-sm font-medium text-foreground hover:text-alert transition-colors" onClick={onClose}>
                      {tool.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Coming soon</p>
            )}
          </div>

          <div>
            <h3 className="section-label text-muted-foreground mb-3">Featured</h3>
            <div className="bg-muted rounded p-4">
              {pinnedPost ? (
                <>
                  <p className="text-xs text-muted-foreground mb-1 uppercase font-bold">Pinned</p>
                  <Link to={`/${pinnedPost.section}/${pinnedPost.category}/${pinnedPost.id}`} className="text-sm font-semibold leading-snug hover:text-alert transition-colors" onClick={onClose}>
                    {pinnedPost.title}
                  </Link>
                  <p className="text-xs text-muted-foreground mt-1">{pinnedPost.author}</p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No featured content yet.</p>
              )}
              <Link to={`/${section.slug}`} className="inline-block mt-2 text-xs font-semibold text-alert hover:underline" onClick={onClose}>
                View all →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
