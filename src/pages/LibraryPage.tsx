import { useState } from "react";
import { BookOpen, Download, Search, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useData } from "@/contexts/DataContext";

export default function LibraryPage() {
  const { libraryItems } = useData();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<typeof libraryItems[0] | null>(null);

  const categories = [...new Set(libraryItems.map(i => i.category))];

  const filtered = libraryItems.filter(item => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase()) || item.author.toLowerCase().includes(search.toLowerCase());
    const matchCat = !selectedCategory || item.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const handleRead = (item: typeof libraryItems[0]) => {
    if (item.fileUrl) {
      window.open(item.fileUrl, "_blank");
    } else {
      setPreviewItem(item);
    }
  };

  const handleDownload = (item: typeof libraryItems[0]) => {
    if (item.fileUrl) {
      const a = document.createElement("a");
      a.href = item.fileUrl;
      a.download = `${item.title}.${item.format.toLowerCase()}`;
      a.click();
    } else {
      setPreviewItem(item);
    }
  };

  return (
    <div className="container py-8">
      <div className="bg-primary text-primary-foreground rounded-sm p-6 md:p-10 mb-8">
        <div className="flex items-center gap-3 mb-3">
          <BookOpen className="w-8 h-8" />
          <h1 className="font-display font-bold text-3xl md:text-4xl">Library</h1>
        </div>
        <p className="text-primary-foreground/80 max-w-2xl">
          Your digital bookshelf of survival knowledge. Browse, read, and download essential guides, manuals, and reference materials.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search the library..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map(item => (
          <div key={item.id} className="group">
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
            <div className="mt-3 space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{item.category}</p>
              <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => handleRead(item)}>
                  <Eye className="w-3 h-3 mr-1" /> Read
                </Button>
                <Button size="sm" className="flex-1 text-xs" onClick={() => handleDownload(item)}>
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

      {/* Preview dialog for items without fileUrl */}
      <Dialog open={!!previewItem} onOpenChange={() => setPreviewItem(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">{previewItem?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>By {previewItem?.author}</span>
              <span>·</span>
              <span>{previewItem?.pages} pages</span>
              <span>·</span>
              <Badge variant="secondary" className="text-[10px]">{previewItem?.format}</Badge>
            </div>
            <p className="text-sm">{previewItem?.description}</p>
            <div className="bg-muted rounded-sm p-8 text-center">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                {previewItem?.fileUrl
                  ? "Document preview available"
                  : "No file uploaded yet. Admin can add a document URL in the admin dashboard."}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
