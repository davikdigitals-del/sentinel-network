import { Link } from "react-router-dom";
import { X, ChevronRight } from "lucide-react";
import { navSections } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const { user, logout } = useAuth();

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-foreground/50 z-50" onClick={onClose} />
      <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-card z-50 overflow-y-auto animate-slide-down shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span className="font-display font-bold text-lg">Menu</span>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="py-2">
          {navSections.map((section) => (
            <div key={section.slug} className="border-b border-border">
              <button
                onClick={() => setExpanded(expanded === section.slug ? null : section.slug)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold hover:bg-muted transition-colors"
              >
                {section.title}
                <ChevronRight className={`w-4 h-4 transition-transform ${expanded === section.slug ? "rotate-90" : ""}`} />
              </button>
              {expanded === section.slug && (
                <div className="bg-muted/50 py-1 animate-fade-in">
                  {section.categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      to={`/${section.slug}/${cat.slug}`}
                      className="block px-8 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={onClose}
                    >
                      {cat.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="py-2">
            {[
              { title: "Library", to: "/library" },
              { title: "Encyclopaedia", to: "/encyclopaedia" },
              { title: "Podcasts & Videos", to: "/media" },
              { title: "Countries & Flags", to: "/countries" },
              { title: "About", to: "/about" },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block px-4 py-3 text-sm font-semibold hover:bg-muted transition-colors border-b border-border"
                onClick={onClose}
              >
                {link.title}
              </Link>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-border">
          {user ? (
            <div className="space-y-2">
              <Link
                to="/dashboard"
                className="block w-full text-center py-2.5 bg-primary text-primary-foreground rounded-sm text-sm font-semibold hover:opacity-90 transition-opacity"
                onClick={onClose}
              >
                My Dashboard
              </Link>
              <button
                onClick={() => { logout(); onClose(); }}
                className="block w-full text-center py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                to="/login"
                className="block w-full text-center py-2.5 bg-alert text-alert-foreground rounded-sm text-sm font-semibold hover:opacity-90 transition-opacity"
                onClick={onClose}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="block w-full text-center py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={onClose}
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
