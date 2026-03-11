import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { navSections, formatTimeAgo } from "@/data/mockData";

interface Post {
  id: string;
  title: string;
  standfirst: string;
  section: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: string;
  image?: string;
  viewCount: number;
  isPinned?: boolean;
}

interface HeroSectionProps {
  featuredPost: Post;
  sidebarPosts: Post[];
}

const HeroSection = ({ featuredPost, sidebarPosts }: HeroSectionProps) => {
  return (
    <section className="border-b border-border">
      <div className="container py-5">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_2fr] gap-5">
          {/* Lead story — large image + headline below */}
          <Link
            to={`/${featuredPost.section}/${featuredPost.category}/${featuredPost.id}`}
            className="group block"
          >
            <div className="aspect-[16/9] bg-muted overflow-hidden">
              {featuredPost.image && (
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                />
              )}
            </div>
            <div className="mt-3">
              <span className="category-pill bg-alert text-alert-foreground text-[10px]">
                {navSections.find((s) => s.slug === featuredPost.section)?.title || "News"}
              </span>
              <h2 className="font-display font-bold text-2xl md:text-3xl mt-2 leading-tight line-clamp-3 group-hover:text-alert transition-colors">
                {featuredPost.title}
              </h2>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {featuredPost.standfirst}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span>{featuredPost.author}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {featuredPost.readTime}
                </span>
                <span>{formatTimeAgo(featuredPost.publishedAt)}</span>
              </div>
            </div>
          </Link>

          {/* Sidebar — stacked stories with small thumbnails */}
          <div className="flex flex-col divide-y divide-border border-l border-border pl-5 hidden lg:flex">
            {sidebarPosts.map((post) => {
              const section = navSections.find((s) => s.slug === post.section);
              return (
                <Link
                  key={post.id}
                  to={`/${post.section}/${post.category}/${post.id}`}
                  className="group py-3 first:pt-0 last:pb-0"
                >
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {section?.title}
                  </span>
                  <h3 className="text-sm font-bold leading-snug mt-0.5 line-clamp-3 group-hover:text-alert transition-colors">
                    {post.title}
                  </h3>
                  <span className="text-xs text-muted-foreground mt-1 block">
                    {formatTimeAgo(post.publishedAt)}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Mobile: show sidebar posts as horizontal cards */}
          <div className="flex flex-col gap-3 lg:hidden">
            {sidebarPosts.slice(0, 2).map((post) => {
              const section = navSections.find((s) => s.slug === post.section);
              return (
                <Link
                  key={post.id}
                  to={`/${post.section}/${post.category}/${post.id}`}
                  className="group flex gap-3"
                >
                  <div className="w-28 h-20 bg-muted shrink-0 overflow-hidden">
                    {post.image && (
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {section?.title}
                    </span>
                    <h3 className="text-sm font-bold leading-snug line-clamp-2 group-hover:text-alert transition-colors">
                      {post.title}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
