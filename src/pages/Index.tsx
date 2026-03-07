import { Link } from "react-router-dom";
import { ArrowRight, Clock, Eye, TrendingUp, Play } from "lucide-react";
import { navSections, formatTimeAgo } from "@/data/mockData";
import { useData } from "@/contexts/DataContext";

const Index = () => {
  const { publishedPosts, mediaItems, libraryItems, loading } = useData();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-muted-foreground">Loading…</div>
      </div>
    );
  }

  const featuredPost = publishedPosts.find((p) => p.isPinned) || publishedPosts[0];
  const secondaryFeatured = publishedPosts
    .filter((p) => featuredPost && p.id !== featuredPost.id)
    .slice(0, 2);
  const mostRead = [...publishedPosts]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 5);

  const usedIds = new Set([
    featuredPost?.id,
    ...secondaryFeatured.map((p) => p.id),
  ]);

  return (
    <div className="bg-background">
      {/* ═══ HERO BLOCK ═══ */}
      {featuredPost && (
        <section className="border-b border-border">
          <div className="container py-5">
            <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-5">
              {/* Main featured — image on top, text below */}
              <Link
                to={`/${featuredPost.section}/${featuredPost.category}/${featuredPost.id}`}
                className="group block"
              >
                <div className="aspect-[16/9] bg-muted rounded-sm overflow-hidden">
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
                  <h2 className="article-headline text-xl md:text-2xl mt-2 line-clamp-3 group-hover:text-alert transition-colors">
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

              {/* Right column: 2 stacked horizontal stories */}
              <div className="flex flex-col gap-4">
                {secondaryFeatured.map((post) => {
                  const section = navSections.find((s) => s.slug === post.section);
                  return (
                    <Link
                      key={post.id}
                      to={`/${post.section}/${post.category}/${post.id}`}
                      className="group block"
                    >
                      <div className="aspect-[16/9] bg-muted rounded-sm overflow-hidden">
                        {post.image && (
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                          />
                        )}
                      </div>
                      <div className="mt-2">
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                          {section?.title}
                        </span>
                        <h3 className="text-sm font-bold leading-tight mt-0.5 line-clamp-2 group-hover:text-alert transition-colors">
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
      )}

      {/* ═══ MOST READ — horizontal numbered ═══ */}
      {mostRead.length > 0 && (
        <section className="border-b border-border bg-card">
          <div className="container py-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-alert" />
              <h2 className="section-label text-foreground">Most Read</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {mostRead.map((post, i) => {
                const section = navSections.find((s) => s.slug === post.section);
                return (
                  <Link
                    key={post.id}
                    to={`/${post.section}/${post.category}/${post.id}`}
                    className="group flex gap-3"
                  >
                    <span className="font-display font-black text-3xl text-muted-foreground/20 shrink-0 leading-none">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {section?.title}
                      </span>
                      <h4 className="text-sm font-semibold leading-snug line-clamp-3 group-hover:text-alert transition-colors mt-0.5">
                        {post.title}
                      </h4>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══ SECTION-BY-SECTION BLOCKS ═══ */}
      {navSections.map((section) => {
        const sectionPosts = publishedPosts.filter(
          (p) => p.section === section.slug && !usedIds.has(p.id)
        );
        if (sectionPosts.length === 0) return null;

        const lead = sectionPosts[0];
        const rest = sectionPosts.slice(1, 5);

        return (
          <section key={section.slug} className="border-b border-border">
            <div className="container py-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-bold text-lg border-b-2 border-alert pb-1">
                  {section.title}
                </h2>
                <Link
                  to={`/${section.slug}`}
                  className="text-xs font-semibold text-alert hover:underline flex items-center gap-1"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-5">
                {/* Lead story */}
                <Link
                  to={`/${lead.section}/${lead.category}/${lead.id}`}
                  className="group block"
                >
                  <div className="aspect-[16/9] bg-muted rounded-sm overflow-hidden">
                    {lead.image && (
                      <img
                        src={lead.image}
                        alt={lead.title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                    )}
                  </div>
                  <h3 className="article-headline text-base md:text-lg mt-3 line-clamp-2 group-hover:text-alert transition-colors">
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

                {/* Right: list of smaller stories */}
                <div className="flex flex-col divide-y divide-border">
                  {rest.map((post) => (
                    <Link
                      key={post.id}
                      to={`/${post.section}/${post.category}/${post.id}`}
                      className="group flex gap-4 py-3 first:pt-0 last:pb-0"
                    >
                      <div className="w-28 h-20 md:w-36 md:h-24 bg-muted rounded-sm shrink-0 overflow-hidden">
                        {post.image && (
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex flex-col justify-center min-w-0">
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
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* ═══ MEDIA & LIBRARY HIGHLIGHT ═══ */}
      <section className="bg-card">
        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {mediaItems.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display font-bold text-lg border-b-2 border-alert pb-1">
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
                    <Link
                      key={item.id}
                      to="/media"
                      className="group flex gap-3"
                    >
                      <div className="w-28 h-20 bg-muted rounded-sm shrink-0 overflow-hidden relative">
                        {item.thumbnail && (
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
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

            {libraryItems.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display font-bold text-lg border-b-2 border-alert pb-1">
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
                      <div className="w-16 h-20 bg-primary/10 rounded-sm shrink-0 overflow-hidden flex items-center justify-center">
                        {item.coverImageUrl ? (
                          <img
                            src={item.coverImageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[10px] text-muted-foreground font-semibold">
                            {item.format}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex flex-col justify-center">
                        <h4 className="text-sm font-bold line-clamp-2">
                          {item.title}
                        </h4>
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
    </div>
  );
};

export default Index;
