import { Link } from "react-router-dom";
import type { NavSection } from "@/data/mockData";

interface MegaMenuProps {
  section: NavSection;
  onClose: () => void;
}

export function MegaMenu({ section, onClose }: MegaMenuProps) {
  return (
    <div
      className="mega-menu-panel animate-slide-down"
      onMouseEnter={() => {}}
      onMouseLeave={onClose}
    >
      <div className="container py-6">
        <div className="grid grid-cols-3 gap-8">
          {/* Column A: Categories */}
          <div>
            <h3 className="section-label text-muted-foreground mb-3">Categories</h3>
            <ul className="space-y-2">
              {section.categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to={`/${section.slug}/${cat.slug}`}
                    className="text-sm font-medium text-foreground hover:text-alert transition-colors"
                    onClick={onClose}
                  >
                    {cat.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column B: Tools */}
          <div>
            <h3 className="section-label text-muted-foreground mb-3">Tools & Programs</h3>
            {section.tools && section.tools.length > 0 ? (
              <ul className="space-y-2">
                {section.tools.map((tool) => (
                  <li key={tool.slug}>
                    <Link
                      to={`/tools/${tool.slug}`}
                      className="text-sm font-medium text-foreground hover:text-alert transition-colors"
                      onClick={onClose}
                    >
                      {tool.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Coming soon</p>
            )}
          </div>

          {/* Column C: Featured */}
          <div>
            <h3 className="section-label text-muted-foreground mb-3">Featured</h3>
            <div className="bg-muted rounded p-4">
              <p className="text-xs text-muted-foreground mb-1">PINNED</p>
              <p className="text-sm font-semibold leading-snug">
                Latest updates and essential reading in {section.title}
              </p>
              <Link
                to={`/${section.slug}`}
                className="inline-block mt-2 text-xs font-semibold text-alert hover:underline"
                onClick={onClose}
              >
                View all →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
