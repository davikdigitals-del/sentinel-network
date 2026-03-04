import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Menu, X, ChevronDown, Globe, User } from "lucide-react";
import { navSections } from "@/data/mockData";
import { MegaMenu } from "./MegaMenu";
import { MobileDrawer } from "./MobileDrawer";
import { NotificationDropdown } from "./NotificationDropdown";
import { useAuth } from "@/contexts/AuthContext";

export function SiteHeader() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user } = useAuth();

  const activeSection = useMemo(
    () => navSections.find((section) => section.slug === activeMenu) || null,
    [activeMenu]
  );

  return (
    <>
      <div className="sticky top-0 z-50" onMouseLeave={() => setActiveMenu(null)}>
        <header className="bg-header text-header-foreground border-b border-primary/20 relative">
          <div className="container flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileOpen(true)} className="lg:hidden p-1.5 hover:bg-primary/20 rounded" aria-label="Open menu">
                <Menu className="w-5 h-5" />
              </button>
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-alert rounded-sm flex items-center justify-center">
                  <span className="font-display font-bold text-sm text-alert-foreground">PH</span>
                </div>
                <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">Preparedness Hub</span>
              </Link>
            </div>

            <nav className="hidden lg:flex items-center h-full">
              {navSections.slice(0, 6).map((section) => (
                <div key={section.slug} className="relative h-full flex items-center" onMouseEnter={() => setActiveMenu(section.slug)}>
                  <Link to={`/${section.slug}`} className="flex items-center gap-1 px-3 h-full text-sm font-medium hover:bg-primary/20 transition-colors">
                    {section.title}
                    <ChevronDown className="w-3 h-3 opacity-50" />
                  </Link>
                </div>
              ))}
            </nav>

            <div className="flex items-center gap-1">
              <button onClick={() => setSearchOpen((prev) => !prev)} className="p-2 hover:bg-primary/20 rounded transition-colors" aria-label="Search">
                <Search className="w-4 h-4" />
              </button>
              <Link to="/countries" className="p-2 hover:bg-primary/20 rounded transition-colors" aria-label="Country posts">
                <Globe className="w-4 h-4" />
              </Link>
              <NotificationDropdown />
              {user ? (
                <Link to="/dashboard" className="hidden sm:inline-flex ml-2 px-3 py-1.5 text-xs font-semibold bg-alert text-alert-foreground rounded-sm hover:opacity-90 transition-opacity items-center gap-1">
                  <User className="w-3 h-3" />
                  {user.name}
                </Link>
              ) : (
                <Link to="/login" className="hidden sm:inline-flex ml-2 px-3 py-1.5 text-xs font-semibold bg-alert text-alert-foreground rounded-sm hover:opacity-90 transition-opacity">
                  Sign In
                </Link>
              )}
            </div>
          </div>

          {activeSection && <MegaMenu section={activeSection} onClose={() => setActiveMenu(null)} />}
        </header>

        {searchOpen && (
          <div className="bg-header text-header-foreground border-t border-primary/20 animate-slide-down">
            <div className="container py-3">
              <div className="flex items-center gap-3 bg-primary/10 rounded px-3 py-2">
                <Search className="w-4 h-4 opacity-60" />
                <input type="text" placeholder="Search articles, guides, resources..." className="flex-1 bg-transparent text-sm outline-none placeholder:text-header-foreground/50" autoFocus />
                <button onClick={() => setSearchOpen(false)}>
                  <X className="w-4 h-4 opacity-60" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
