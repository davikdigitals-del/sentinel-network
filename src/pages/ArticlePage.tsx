import { useParams, Link } from "react-router-dom";
import { Clock, Eye, Share2, ChevronRight, Tag } from "lucide-react";
import { mockPosts, navSections, formatDate, formatTimeAgo } from "@/data/mockData";
import { PostCard } from "@/components/PostCard";
import { SidebarModules } from "@/components/SidebarModules";

const ArticlePage = () => {
  const { section, category, id } = useParams();
  const post = mockPosts.find((p) => p.id === id);
  const sectionData = navSections.find((s) => s.slug === section);
  const categoryData = sectionData?.categories.find((c) => c.slug === category);

  if (!post) {
    return (
      <div className="container py-16 text-center">
        <h1 className="font-display font-bold text-3xl mb-4">Article Not Found</h1>
        <Link to="/" className="text-alert hover:underline">Return home</Link>
      </div>
    );
  }

  const relatedPosts = mockPosts.filter((p) => p.id !== post.id && p.section === post.section).slice(0, 3);

  return (
    <div className="container py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6 flex-wrap">
        <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to={`/${section}`} className="hover:text-foreground transition-colors">
          {sectionData?.title}
        </Link>
        {categoryData && (
          <>
            <ChevronRight className="w-3 h-3" />
            <Link to={`/${section}/${category}`} className="hover:text-foreground transition-colors">
              {categoryData.title}
            </Link>
          </>
        )}
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        <article>
          {/* Section label */}
          <span className="section-label text-alert">{sectionData?.title}</span>

          {/* Headline */}
          <h1 className="article-headline text-3xl md:text-4xl mt-2">{post.title}</h1>

          {/* Standfirst */}
          <p className="article-standfirst text-lg mt-3">{post.standfirst}</p>

          {/* Byline */}
          <div className="flex flex-wrap items-center gap-4 mt-4 py-4 border-y border-border text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{post.author}</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{post.readTime}</span>
            <span>Published {formatDate(post.publishedAt)}</span>
            <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{post.viewCount.toLocaleString()} views</span>
            <button className="ml-auto flex items-center gap-1 hover:text-alert transition-colors">
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
          </div>

          {/* Hero image placeholder */}
          <div className="aspect-[16/9] bg-muted rounded-sm mt-6 flex items-center justify-center">
            <span className="text-sm text-muted-foreground">Article image</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2 italic">Image caption — Source: Preparedness Hub</p>

          {/* Article body (mock) */}
          <div className="prose prose-sm max-w-none mt-8 space-y-4">
            <p className="text-base leading-relaxed">
              This article provides comprehensive guidance on the topic of {post.title.toLowerCase()}. 
              In an era of increasing uncertainty, being prepared is not just advisable — it's essential.
            </p>
            <h2 className="font-display font-bold text-xl mt-8 mb-3">Key Points</h2>
            <ul className="list-disc pl-5 space-y-2 text-base">
              <li>Understanding the current threat landscape and risk assessment</li>
              <li>Practical steps for immediate implementation</li>
              <li>Long-term strategies for sustained preparedness</li>
              <li>Resources and tools for further learning</li>
            </ul>
            <h2 className="font-display font-bold text-xl mt-8 mb-3">Detailed Analysis</h2>
            <p className="text-base leading-relaxed">
              Experts recommend a systematic approach to preparedness that begins with understanding your local risks 
              and extends to building resilient community networks. This guide walks through each step with practical, 
              actionable advice.
            </p>
            <p className="text-base leading-relaxed">
              Whether you're just beginning your preparedness journey or looking to refine existing plans, 
              the principles outlined here will help you build a comprehensive strategy that protects your family 
              and contributes to community resilience.
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 mt-8 pt-6 border-t border-border">
            <Tag className="w-4 h-4 text-muted-foreground" />
            {post.tags.map((tag) => (
              <span key={tag} className="category-pill bg-muted text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>

          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-10 pt-8 border-t border-border">
              <h3 className="font-display font-bold text-xl mb-4">Related Articles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {relatedPosts.map((p) => (
                  <PostCard key={p.id} post={p} />
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Sidebar */}
        <div className="hidden lg:block">
          <SidebarModules />
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
