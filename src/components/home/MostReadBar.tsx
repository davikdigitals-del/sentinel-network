import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import { navSections } from "@/data/mockData";

interface Post {
  id: string;
  title: string;
  section: string;
  category: string;
  viewCount: number;
}

interface MostReadBarProps {
  posts: Post[];
}

const MostReadBar = ({ posts }: MostReadBarProps) => {
  if (posts.length === 0) return null;

  return (
    <section className="border-b border-border bg-card">
      <div className="container py-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-alert" />
          <h2 className="section-label text-foreground">Most Read</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {posts.map((post, i) => {
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
  );
};

export default MostReadBar;
