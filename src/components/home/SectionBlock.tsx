import { Link } from "react-router-dom";
import { ArrowRight, Clock, Eye } from "lucide-react";
import { formatTimeAgo } from "@/data/mockData";

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
}

interface SectionBlockProps {
  title: string;
  slug: string;
  posts: Post[];
}

const SectionBlock = ({ title, slug, posts }: SectionBlockProps) => {
  if (posts.length === 0) return null;

  const lead = posts[0];
  const sidebar = posts.slice(1, 4);
  const bottom = posts.slice(4, 7);

  return (
    <section className="border-b border-border">
      <div className="container py-6">
        {/* Section header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-lg border-l-4 border-alert pl-3">
            {title}
          </h2>
          <Link
            to={`/${slug}`}
            className="text-xs font-semibold text-alert hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Lead + sidebar grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_2fr] gap-5">
          {/* Lead story */}
          <Link
            to={`/${lead.section}/${lead.category}/${lead.id}`}
            className="group block"
          >
            <div className="aspect-[16/9] bg-muted overflow-hidden">
              {lead.image && (
                <img
                  src={lead.image}
                  alt={lead.title}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                />
              )}
            </div>
            <h3 className="article-headline text-base md:text-xl mt-3 line-clamp-2 group-hover:text-alert transition-colors">
              {lead.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {lead.standfirst}
            </p>
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span>{lead.author}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {lead.readTime}
              </span>
              <span>{formatTimeAgo(lead.publishedAt)}</span>
            </div>
          </Link>

          {/* Sidebar list */}
          {sidebar.length > 0 && (
            <div className="flex flex-col divide-y divide-border lg:border-l lg:border-border lg:pl-5">
              {sidebar.map((post) => (
                <Link
                  key={post.id}
                  to={`/${post.section}/${post.category}/${post.id}`}
                  className="group py-3 first:pt-0 last:pb-0"
                >
                  <h4 className="text-sm font-bold leading-snug line-clamp-2 group-hover:text-alert transition-colors">
                    {post.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                    <span>{formatTimeAgo(post.publishedAt)}</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {(post.viewCount / 1000).toFixed(1)}k
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Bottom row — additional stories as horizontal cards */}
        {bottom.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5 pt-5 border-t border-border">
            {bottom.map((post) => (
              <Link
                key={post.id}
                to={`/${post.section}/${post.category}/${post.id}`}
                className="group flex gap-3"
              >
                <div className="w-24 h-16 bg-muted shrink-0 overflow-hidden">
                  {post.image && (
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <h4 className="text-sm font-bold leading-snug line-clamp-2 group-hover:text-alert transition-colors">
                    {post.title}
                  </h4>
                  <span className="text-xs text-muted-foreground mt-1">
                    {formatTimeAgo(post.publishedAt)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SectionBlock;
