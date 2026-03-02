import { useState } from "react";
import { Plus, Search, Edit2, Trash2, Pin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { navSections } from "@/data/mockData";
import { useData, type AdminPost, type PostStatus } from "@/contexts/DataContext";
import { cn } from "@/lib/utils";

const emptyPost: Omit<AdminPost, "id"> = {
  title: "", standfirst: "", section: "", category: "", author: "",
  publishedAt: new Date().toISOString(), image: "", tags: [], viewCount: 0,
  readTime: "5 min", status: "draft", body: "",
};

export default function AdminPosts() {
  const { posts, createPost, updatePost, deletePost } = useData();
  const [search, setSearch] = useState("");
  const [filterSection, setFilterSection] = useState("all");
  const [filterStatus, setFilterStatus] = useState<"all" | PostStatus>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<AdminPost | null>(null);
  const [form, setForm] = useState(emptyPost);

  const filtered = posts.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchSection = filterSection === "all" || p.section === filterSection;
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    return matchSearch && matchSection && matchStatus;
  });

  const openCreate = () => { setEditingPost(null); setForm(emptyPost); setDialogOpen(true); };
  const openEdit = (post: AdminPost) => { setEditingPost(post); setForm({ ...post }); setDialogOpen(true); };

  const handleSave = async () => {
    if (editingPost) {
      await updatePost(editingPost.id, form);
    } else {
      await createPost(form);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => deletePost(id);
  const togglePin = (id: string) => {
    const post = posts.find(p => p.id === id);
    if (post) updatePost(id, { isPinned: !post.isPinned });
  };

  const sectionCategories = navSections.find(s => s.slug === form.section)?.categories || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="font-display text-2xl font-bold text-foreground">Posts</h2>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-1" /> New Post</Button>
      </div>

      <Card>
        <CardContent className="p-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search posts..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={filterSection} onValueChange={setFilterSection}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="All sections" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sections</SelectItem>
              {navSections.map(s => <SelectItem key={s.slug} value={s.slug}>{s.title}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={v => setFilterStatus(v as any)}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="All status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0 divide-y divide-border">
          {filtered.length === 0 && <p className="p-8 text-center text-muted-foreground">No posts found.</p>}
          {filtered.map(post => (
            <div key={post.id} className="flex items-start gap-4 p-4 hover:bg-muted/30 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  {post.isPinned && <Pin className="w-3 h-3 text-warning" />}
                  <Badge variant={post.status === "published" ? "default" : "secondary"} className="text-[10px]">{post.status}</Badge>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{post.section} / {post.category}</span>
                </div>
                <p className="text-sm font-medium text-foreground line-clamp-2">{post.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {post.author} · {post.viewCount.toLocaleString()} views · {post.readTime} · {new Date(post.publishedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => togglePin(post.id)} title="Toggle pin">
                  <Pin className={cn("w-4 h-4", post.isPinned && "text-warning fill-warning")} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => openEdit(post)}><Edit2 className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingPost ? "Edit Post" : "Create New Post"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Post title" /></div>
            <div><Label>Standfirst</Label><Textarea value={form.standfirst} onChange={e => setForm({ ...form, standfirst: e.target.value })} placeholder="Brief summary..." rows={2} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Section</Label>
                <Select value={form.section} onValueChange={v => setForm({ ...form, section: v, category: "" })}>
                  <SelectTrigger><SelectValue placeholder="Select section" /></SelectTrigger>
                  <SelectContent>{navSections.map(s => <SelectItem key={s.slug} value={s.slug}>{s.title}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Category</Label>
                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>{sectionCategories.map(c => <SelectItem key={c.slug} value={c.slug}>{c.title}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Author</Label><Input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} /></div>
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={v => setForm({ ...form, status: v as PostStatus })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>Body</Label><Textarea value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} placeholder="Full article content..." rows={8} /></div>
            <div><Label>Tags (comma-separated)</Label><Input value={form.tags.join(", ")} onChange={e => setForm({ ...form, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })} /></div>
            <div><Label>Hero Image URL</Label><Input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://..." /></div>
            <div className="flex items-center gap-3">
              <Switch checked={form.isPinned || false} onCheckedChange={v => setForm({ ...form, isPinned: v })} />
              <Label>Pin as featured</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.title || !form.section}>{editingPost ? "Save Changes" : "Create Post"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
