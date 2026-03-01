import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { navSections } from "@/data/mockData";
import { PostCard } from "@/components/PostCard";
import { SidebarModules } from "@/components/SidebarModules";
import { useData } from "@/contexts/DataContext";

const Index = () => {
  const { publishedPosts, banner, alerts } = useData();
  const featuredPost = publishedPosts.find((p) => p.isPinned) || publishedPosts[0];
  const secondaryFeatured = publishedPosts.filter((p) => featuredPost && p.id !== featuredPost.id).slice(0, 2);
  const latestPosts = publishedPosts.filter(
    (p) => featuredPost && p.id !== featuredPost.id && !secondaryFeatured.find((s) => s.id === p.id)
  );

  return (
    <div>
      {/* Hero Banner — clean, no overlay text */}
      <section className="relative w-full h-[280px] md:h-[380px] overflow-hidden">
        <img
          src="/images/hero-banner.jpg"
          alt="Preparedness Hub"
          className="w-full h-full object-cover"
        />
      </section>

      {/* Featured posts */}
      {featuredPost && (
        <section className="bg-card border-b border-border">
          <div className="container py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <PostCard post={featuredPost} variant="hero" />
              </div>
              <div className="flex flex-col gap-4">
                {secondaryFeatured.map((post) => (
                  <PostCard key={post.id} post={post} variant="horizontal" />
                ))}
                <div className="bg-alert/5 border border-alert/20 rounded-sm p-4 flex-1">
                  <h3 className="section-label text-alert mb-2">Live Updates</h3>
                  <ul className="space-y-2">
                    {publishedPosts.slice(0, 3).map((post) => (
                      <li key={post.id}>
                        <Link
                          to={`/${post.section}/${post.category}/${post.id}`}
                          className="text-sm hover:text-alert transition-colors line-clamp-2"
                        >
                          {post.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main content + sidebar */}
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          <main>
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-xl">Latest</h2>
                <Link to="/emergency-news" className="text-sm font-semibold text-alert hover:underline flex items-center gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {latestPosts.slice(0, 6).map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>

            {navSections.slice(0, 4).map((section) => {
              const sectionPosts = publishedPosts.filter((p) => p.section === section.slug);
              if (sectionPosts.length === 0) return null;
              return (
                <div key={section.slug} className="mb-10">
                  <div className="flex items-center justify-between mb-4 border-b-2 border-foreground pb-2">
                    <h2 className="font-display font-bold text-lg">{section.title}</h2>
                    <Link
                      to={`/${section.slug}`}
                      className="text-sm font-semibold text-alert hover:underline flex items-center gap-1"
                    >
                      View all <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {sectionPosts.slice(0, 4).map((post) => (
                      <PostCard key={post.id} post={post} variant="horizontal" />
                    ))}
                  </div>
                </div>
              );
            })}
          </main>

          <div className="hidden lg:block">
            <SidebarModules />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
