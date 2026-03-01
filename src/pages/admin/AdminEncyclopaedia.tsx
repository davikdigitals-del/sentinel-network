import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useData, type EncEntry } from "@/contexts/DataContext";

const emptyEntry: Omit<EncEntry, "id"> = { title: "", letter: "", content: "" };

export default function AdminEncyclopaedia() {
  const { encEntries, setEncEntries } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<EncEntry | null>(null);
  const [form, setForm] = useState(emptyEntry);
  const [search, setSearch] = useState("");

  const filtered = encEntries.filter(e => e.title.toLowerCase().includes(search.toLowerCase()));
  const sorted = [...filtered].sort((a, b) => a.title.localeCompare(b.title));

  const openCreate = () => { setEditing(null); setForm(emptyEntry); setDialogOpen(true); };
  const openEdit = (entry: EncEntry) => { setEditing(entry); setForm(entry); setDialogOpen(true); };

  const handleSave = () => {
    const letter = form.title.charAt(0).toUpperCase();
    if (editing) {
      setEncEntries(prev => prev.map(e => e.id === editing.id ? { ...form, id: editing.id, letter } : e));
    } else {
      setEncEntries(prev => [{ ...form, id: Date.now().toString(), letter }, ...prev]);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => setEncEntries(prev => prev.filter(e => e.id !== id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="font-display text-2xl font-bold text-foreground">Encyclopaedia</h2>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-1" /> Add Entry</Button>
      </div>

      <Input placeholder="Search entries..." value={search} onChange={e => setSearch(e.target.value)} />

      <Card>
        <CardContent className="p-0 divide-y divide-border">
          {sorted.length === 0 && <p className="p-8 text-center text-muted-foreground">No entries found.</p>}
          {sorted.map(entry => (
            <div key={entry.id} className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
              <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center shrink-0">
                <span className="font-display font-bold text-sm text-primary-foreground">{entry.letter}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{entry.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">{entry.content}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => openEdit(entry)}><Edit2 className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(entry.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Edit Entry" : "Add Entry"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Water Purification" /></div>
            <div><Label>Content</Label><Textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={6} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.title}>{editing ? "Save" : "Add Entry"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
