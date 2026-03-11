import { navSections } from "@/data/mockData";
import { useData } from "@/contexts/DataContext";
import HeroSection from "@/components/home/HeroSection";
import MostReadBar from "@/components/home/MostReadBar";
import SectionBlock from "@/components/home/SectionBlock";
import MediaLibrarySection from "@/components/home/MediaLibrarySection";

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
  const sidebarHeroPosts = publishedPosts
    .filter((p) => featuredPost && p.id !== featuredPost.id)
    .slice(0, 5);

  const mostRead = [...publishedPosts]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 5);

  const usedIds = new Set([
    featuredPost?.id,
    ...sidebarHeroPosts.map((p) => p.id),
  ]);

  return (
    <div className="bg-background">
      {/* ═══ TOP BANNER ═══ */}
      <div className="w-full">
        <img
          src="/images/hero-banner.jpg"
          alt="Preparedness Hub Banner"
          className="w-full h-auto object-cover"
        />
      </div>

      {/* ═══ HERO ═══ */}
      {featuredPost && (
        <HeroSection featuredPost={featuredPost} sidebarPosts={sidebarHeroPosts} />
      )}

      {/* ═══ MOST READ ═══ */}
      <MostReadBar posts={mostRead} />

      {/* ═══ SECTION BLOCKS ═══ */}
      {navSections.map((section) => {
        const sectionPosts = publishedPosts.filter(
          (p) => p.section === section.slug && !usedIds.has(p.id)
        );
        if (sectionPosts.length === 0) return null;
        return (
          <SectionBlock
            key={section.slug}
            title={section.title}
            slug={section.slug}
            posts={sectionPosts}
          />
        );
      })}

      {/* ═══ MEDIA & LIBRARY ═══ */}
      <MediaLibrarySection mediaItems={mediaItems} libraryItems={libraryItems} />
    </div>
  );
};

export default Index;
