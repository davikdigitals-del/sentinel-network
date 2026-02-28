import { Link } from "react-router-dom";
import { navSections } from "@/data/mockData";

export function SiteFooter() {
  return (
    <footer className="bg-header text-header-foreground mt-16">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="section-label text-header-foreground/60 mb-4">Themes</h4>
            <ul className="space-y-2">
              {navSections.slice(0, 5).map((s) => (
                <li key={s.slug}>
                  <Link to={`/${s.slug}`} className="text-sm text-header-foreground/80 hover:text-header-foreground transition-colors">{s.title}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="section-label text-header-foreground/60 mb-4">Services</h4>
            <ul className="space-y-2">
              {navSections.slice(5).map((s) => (
                <li key={s.slug}>
                  <Link to={`/${s.slug}`} className="text-sm text-header-foreground/80 hover:text-header-foreground transition-colors">{s.title}</Link>
                </li>
              ))}
              <li><Link to="/media" className="text-sm text-header-foreground/80 hover:text-header-foreground transition-colors">Podcasts & Videos</Link></li>
              <li><Link to="/library" className="text-sm text-header-foreground/80 hover:text-header-foreground transition-colors">Library</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="section-label text-header-foreground/60 mb-4">More</h4>
            <ul className="space-y-2">
              {[
                { title: "Encyclopaedia", to: "/encyclopaedia" },
                { title: "Countries & Flags", to: "/countries" },
                { title: "About", to: "/about" },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-header-foreground/80 hover:text-header-foreground transition-colors">{link.title}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="section-label text-header-foreground/60 mb-4">Legal</h4>
            <ul className="space-y-2">
              {[
                { title: "Privacy Policy", to: "/legal/privacy" },
                { title: "Terms of Service", to: "/legal/terms" },
                { title: "Disclaimer", to: "/legal/disclaimer" },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-header-foreground/80 hover:text-header-foreground transition-colors">{link.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-header-foreground/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-alert rounded-sm flex items-center justify-center">
              <span className="font-display font-bold text-xs text-alert-foreground">PH</span>
            </div>
            <span className="font-display font-semibold text-sm">Preparedness Hub</span>
          </div>
          <p className="text-xs text-header-foreground/50">
            © {new Date().getFullYear()} Preparedness Hub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
