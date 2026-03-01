import { useState } from "react";
import { Plus, Edit2, Trash2, BookOpen, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LibraryItem {
  id: string;
  title: string;
  author: string;
  category: string;
  pages: number;
  format: string;
  description: string;
  fileUrl: string;
}

const initialItems: LibraryItem[] = [
  { id: "lib1", title: "Complete Emergency Planning Guide", author: "Dr. Sarah Mitchell", category: "Emergency Planning", pages: 124, format: "PDF", description: "Comprehensive guide covering all aspects of emergency planning.", fileUrl: "" },
  { id: "lib2", title: "Water Purification Methods & Storage", author: "James Crawford", category: "Water Safety", pages: 68, format: "PDF", description: "Everything about water purification and storage.", fileUrl: "" },
  { id: "lib3", title: "First Aid Field Manual", author: "Dr. Mark Thompson", category: "First Aid", pages: 156, format: "PDF", description: "Military-grade first aid techniques for civilian use.", fileUrl: "" },
  { id: "lib4", title: "Urban Survival Handbook", author: "Captain David Hughes", category: "Urban Survival", pages: 210, format: "PDF", description: "Survival strategies for urban environments.", fileUrl: "" },
];

const categories = ["Emergency Planning", "Water Safety", "First Aid", "Urban Survival", "Communication", "Food & Rations", "Mental Health", "Official Documents"];

const emptyItem: Omit<LibraryItem, "id"> = { title: "", author: "", category: "", pages: 0, format: "PDF", description: "", fileUrl: "" };

export default function AdminLibrary() {
  const [items, setItems] = useState<LibraryItem[]>(initialItems);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<LibraryItem | null>(null);
  const [form, setForm] = useState(emptyItem);
  const [search, setSearch] = useState("");

  const filtered = items.filter(i => i.title.toLowerCase().includes(search.toLowerCase()));

  const openCreate = () => { setEditing(null); setForm(emptyItem); setDialogOpen(true); };
  const openEdit = (item: LibraryItem) => { setEditing(item); setForm(item); setDialogOpen(true); };

  const handleSave = () => {
    if (editing) {
      setItems(prev => prev.map(i => i.id === editing.id ? { ...form, id: editing.id } : i));
    } else {
      setItems(prev => [{ ...form, id: Date.now().toString() }, ...prev]);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => setItems(prev => prev.filter(i => i.id !== id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="font-display text-2xl font-bold text-foreground">Library Management</h2>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-1" /> Add Document</Button>
      </div>

      <div className="relative max-w-md">
        <Input placeholder="Search documents..." value={search} onChange={e => setSearch(e.target.value)} className="pl-3" />
      </div>

      <Card>
        <CardContent className="p-0 divide-y divide-border">
          {filtered.length === 0 && <p className="p-8 text-center text-muted-foreground">No documents found.</p>}
          {filtered.map(item => (
            <div key={item.id} className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
              <div className="w-10 h-12 bg-primary rounded-sm flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.author} · {item.pages} pages · {item.format}</p>
              </div>
              <Badge variant="secondary" className="text-[10px] shrink-0">{item.category}</Badge>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => openEdit(item)}><Edit2 className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Edit Document" : "Add Document"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
            <div><Label>Author</Label><Input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Pages</Label><Input type="number" value={form.pages} onChange={e => setForm({ ...form, pages: parseInt(e.target.value) || 0 })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Format</Label>
                <Select value={form.format} onValueChange={v => setForm({ ...form, format: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="DOCX">DOCX</SelectItem>
                    <SelectItem value="EPUB">EPUB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>File URL</Label><Input value={form.fileUrl} onChange={e => setForm({ ...form, fileUrl: e.target.value })} placeholder="Upload or paste URL" /></div>
            </div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.title}>{editing ? "Save" : "Add Document"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
