import { useParams, Link } from "react-router-dom";
import { navSections } from "@/data/mockData";
import { PostCard } from "@/components/PostCard";
import { SidebarModules } from "@/components/SidebarModules";
import { useData } from "@/contexts/DataContext";

const SectionPage = () => {
  const { section, category } = useParams<{ section: string; category?: string }>();
  const { publishedPosts } = useData();
  const sectionData = navSections.find((s) => s.slug === section);

  // If section not found in nav, show all posts matching section slug (graceful fallback)
  const posts = publishedPosts.filter((p) => {
    const matchSection = p.section === section;
    const matchCategory = !category || p.category === category;
    return matchSection && matchCategory;
  });

  const categoryData = category ? sectionData?.categories.find(c => c.slug === category) : null;
  const pageTitle = categoryData?.title || sectionData?.title || section?.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()) || "Section";

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3 flex-wrap">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>›</span>
          {sectionData && <Link to={`/${section}`} className="hover:text-foreground transition-colors">{sectionData.title}</Link>}
          {categoryData && (
            <>
              <span>›</span>
              <span className="text-foreground">{categoryData.title}</span>
            </>
          )}
        </nav>
        <h1 className="font-display font-bold text-3xl md:text-4xl">{pageTitle}</h1>
        <p className="text-muted-foreground mt-2">
          Latest articles and resources in {pageTitle.toLowerCase()}.
        </p>
      </div>

      {/* Category filter pills */}
      {sectionData && !category && (
        <div className="flex flex-wrap gap-2 mb-6">
          <Link
            to={`/${section}`}
            className="category-pill bg-foreground text-background"
          >
            All
          </Link>
          {sectionData.categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/${section}/${cat.slug}`}
              className="category-pill bg-muted text-muted-foreground hover:bg-foreground hover:text-background transition-colors"
            >
              {cat.title}
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        <main>
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-muted-foreground">
              <p>No articles published yet in this section. Check back soon!</p>
            </div>
          )}
        </main>

        <div className="hidden lg:block">
          <SidebarModules />
        </div>
      </div>
    </div>
  );
};

export default SectionPage;
