import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Download, Search, Filter, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const libraryItems = [
  { id: "lib1", title: "Complete Emergency Planning Guide", author: "Dr. Sarah Mitchell", category: "Emergency Planning", pages: 124, format: "PDF", description: "Comprehensive guide covering all aspects of emergency planning for families and communities.", tags: ["planning", "family", "emergency"], coverColor: "bg-primary" },
  { id: "lib2", title: "Water Purification Methods & Storage", author: "James Crawford", category: "Water Safety", pages: 68, format: "PDF", description: "Everything you need to know about water purification, storage, and rationing during emergencies.", tags: ["water", "purification", "survival"], coverColor: "bg-info" },
  { id: "lib3", title: "First Aid Field Manual", author: "Dr. Mark Thompson", category: "First Aid", pages: 156, format: "PDF", description: "Military-grade first aid techniques adapted for civilian emergency use.", tags: ["first-aid", "medical", "field"], coverColor: "bg-alert" },
  { id: "lib4", title: "Urban Survival Handbook", author: "Captain David Hughes", category: "Urban Survival", pages: 210, format: "PDF", description: "Survival strategies specifically designed for urban environments during crisis situations.", tags: ["urban", "survival", "city"], coverColor: "bg-success" },
  { id: "lib5", title: "Emergency Communication Systems", author: "Tom Barrett", category: "Communication", pages: 92, format: "PDF", description: "Guide to alternative communication methods when digital infrastructure fails.", tags: ["radio", "communication", "mesh"], coverColor: "bg-warning" },
  { id: "lib6", title: "Food Storage & Rationing Guide", author: "Lisa Chen", category: "Food & Rations", pages: 88, format: "PDF", description: "How to build, maintain, and rotate food supplies for long-term survival.", tags: ["food", "storage", "rations"], coverColor: "bg-category-directives" },
  { id: "lib7", title: "Mental Health in Crisis Situations", author: "Dr. Rachel Green", category: "Mental Health", pages: 145, format: "PDF", description: "Psychological resilience strategies for maintaining mental health during emergencies.", tags: ["mental-health", "resilience", "psychology"], coverColor: "bg-category-health" },
  { id: "lib8", title: "NATO Civil Preparedness Standards", author: "Helena Voss", category: "Official Documents", pages: 78, format: "PDF", description: "Simplified guide to NATO's civilian preparedness requirements and standards.", tags: ["NATO", "standards", "official"], coverColor: "bg-category-directives" },
];

const categories = [...new Set(libraryItems.map(i => i.category))];

export default function LibraryPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filtered = libraryItems.filter(item => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase()) || item.author.toLowerCase().includes(search.toLowerCase());
    const matchCat = !selectedCategory || item.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="container py-8">
      {/* Header - Library feel */}
      <div className="bg-primary text-primary-foreground rounded-sm p-6 md:p-10 mb-8">
        <div className="flex items-center gap-3 mb-3">
          <BookOpen className="w-8 h-8" />
          <h1 className="font-display font-bold text-3xl md:text-4xl">Library</h1>
        </div>
        <p className="text-primary-foreground/80 max-w-2xl">
          Your digital bookshelf of survival knowledge. Browse, read, and download essential guides, manuals, and reference materials.
        </p>
      </div>

      {/* Search & filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search the library..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`category-pill transition-colors ${!selectedCategory ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-foreground hover:text-background"}`}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`category-pill transition-colors ${selectedCategory === cat ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:bg-foreground hover:text-background"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Book grid - library style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map(item => (
          <div key={item.id} className="group">
            {/* Book cover */}
            <div className={`${item.coverColor} rounded-sm aspect-[3/4] p-5 flex flex-col justify-between text-primary-foreground relative overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow`}>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-foreground/20" />
              <div className="relative z-10">
                <Badge variant="secondary" className="text-[10px] mb-2">{item.format}</Badge>
                <h3 className="font-display font-bold text-lg leading-tight">{item.title}</h3>
              </div>
              <div className="relative z-10">
                <p className="text-sm opacity-80">{item.author}</p>
                <p className="text-xs opacity-60">{item.pages} pages</p>
              </div>
            </div>
            {/* Info below */}
            <div className="mt-3 space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{item.category}</p>
              <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 text-xs">
                  <BookOpen className="w-3 h-3 mr-1" /> Read
                </Button>
                <Button size="sm" className="flex-1 text-xs">
                  <Download className="w-3 h-3 mr-1" /> Download
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-16">No items found in the library.</p>
      )}
    </div>
  );
}
