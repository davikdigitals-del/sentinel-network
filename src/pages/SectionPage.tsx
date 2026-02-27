import { useParams, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { mockPosts, navSections } from "@/data/mockData";
import { PostCard } from "@/components/PostCard";
import { SidebarModules } from "@/components/SidebarModules";

const SectionPage = () => {
  const { section } = useParams<{ section: string }>();
  const sectionData = navSections.find((s) => s.slug === section);
  const posts = mockPosts.filter((p) => p.section === section);

  if (!sectionData) {
    return (
      <div className="container py-16 text-center">
        <h1 className="font-display font-bold text-3xl mb-4">Section Not Found</h1>
        <Link to="/" className="text-alert hover:underline">Return home</Link>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl md:text-4xl">{sectionData.title}</h1>
        <p className="text-muted-foreground mt-2">
          Latest articles and resources in {sectionData.title.toLowerCase()}.
        </p>
      </div>

      {/* Category filter pills */}
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
              <p>No articles published yet in this section.</p>
            </div>
          )}

          {/* Pagination placeholder */}
          <div className="flex justify-center gap-2 mt-8">
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                className={`w-8 h-8 rounded-sm text-sm font-medium transition-colors ${
                  page === 1 ? "bg-foreground text-background" : "bg-muted hover:bg-foreground hover:text-background"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </main>

        <div className="hidden lg:block">
          <SidebarModules />
        </div>
      </div>
    </div>
  );
};

export default SectionPage;
