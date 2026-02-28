import { useState } from "react";
import { Plus, Edit2, Trash2, Eye, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface SitePage {
  id: string;
  title: string;
  slug: string;
  status: "published" | "draft";
  showInNav: boolean;
  content: string;
  updatedAt: string;
}

const defaultPages: SitePage[] = [
  { id: "p1", title: "Home", slug: "/", status: "published", showInNav: true, content: "", updatedAt: "2026-02-27" },
  { id: "p2", title: "About", slug: "/about", status: "published", showInNav: true, content: "", updatedAt: "2026-02-27" },
  { id: "p3", title: "Countries & Flags", slug: "/countries", status: "published", showInNav: true, content: "", updatedAt: "2026-02-27" },
  { id: "p4", title: "Library", slug: "/library", status: "published", showInNav: true, content: "", updatedAt: "2026-02-26" },
  { id: "p5", title: "Encyclopaedia", slug: "/encyclopaedia", status: "published", showInNav: true, content: "", updatedAt: "2026-02-26" },
  { id: "p6", title: "Podcasts & Videos", slug: "/media", status: "published", showInNav: true, content: "", updatedAt: "2026-02-25" },
  { id: "p7", title: "Privacy Policy", slug: "/legal/privacy", status: "published", showInNav: false, content: "", updatedAt: "2026-02-20" },
  { id: "p8", title: "Terms of Service", slug: "/legal/terms", status: "published", showInNav: false, content: "", updatedAt: "2026-02-20" },
  { id: "p9", title: "Disclaimer", slug: "/legal/disclaimer", status: "published", showInNav: false, content: "", updatedAt: "2026-02-20" },
];

export default function AdminPages() {
  const [pages, setPages] = useState<SitePage[]>(defaultPages);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<SitePage | null>(null);
  const [form, setForm] = useState<Partial<SitePage>>({ title: "", slug: "", status: "draft", showInNav: true, content: "" });

  const openCreate = () => {
    setEditing(null);
    setForm({ title: "", slug: "", status: "draft", showInNav: true, content: "" });
    setDialogOpen(true);
  };

  const openEdit = (page: SitePage) => {
    setEditing(page);
    setForm({ ...page });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editing) {
      setPages(prev => prev.map(p => p.id === editing.id ? { ...editing, ...form, updatedAt: new Date().toISOString().split("T")[0] } as SitePage : p));
    } else {
      setPages(prev => [...prev, { ...form, id: Date.now().toString(), updatedAt: new Date().toISOString().split("T")[0] } as SitePage]);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => setPages(prev => prev.filter(p => p.id !== id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="font-display text-2xl font-bold text-foreground">Pages</h2>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-1" /> New Page</Button>
      </div>

      <Card>
        <CardContent className="p-0 divide-y divide-border">
          {pages.map(page => (
            <div key={page.id} className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors group">
              <GripVertical className="w-4 h-4 text-muted-foreground/40 cursor-grab shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <Badge variant={page.status === "published" ? "default" : "secondary"} className="text-[10px]">{page.status}</Badge>
                  {page.showInNav && <Badge variant="outline" className="text-[10px]">In Nav</Badge>}
                </div>
                <p className="text-sm font-medium text-foreground">{page.title}</p>
                <p className="text-xs text-muted-foreground">{page.slug} · Updated {page.updatedAt}</p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <Button variant="ghost" size="icon" onClick={() => openEdit(page)}><Edit2 className="w-3.5 h-3.5" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(page.id)}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Page" : "New Page"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={form.title || ""} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <Label>Slug</Label>
              <Input value={form.slug || ""} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="/my-page" />
            </div>
            <div>
              <Label>Content</Label>
              <Textarea value={form.content || ""} onChange={e => setForm({ ...form, content: e.target.value })} rows={6} placeholder="Page content..." />
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch checked={form.showInNav} onCheckedChange={v => setForm({ ...form, showInNav: v })} />
                <Label>Show in navigation</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.status === "published"} onCheckedChange={v => setForm({ ...form, status: v ? "published" : "draft" })} />
                <Label>Published</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.title}>{editing ? "Save" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
