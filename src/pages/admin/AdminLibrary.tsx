import { useRef, useState } from "react";
import { Plus, Edit2, Trash2, BookOpen, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useData, type LibraryItem } from "@/contexts/DataContext";
import { natoCountries } from "@/data/mockData";
import { uploadContentFile } from "@/lib/storage";

const categories = ["Emergency Planning", "Water Safety", "First Aid", "Urban Survival", "Communication", "Food & Rations", "Mental Health", "Official Documents"];
const coverColors = ["bg-primary", "bg-info", "bg-alert", "bg-success", "bg-warning", "bg-category-directives", "bg-category-health"];

const emptyItem: Omit<LibraryItem, "id"> = {
  title: "",
  author: "",
  category: "",
  pages: 0,
  format: "PDF",
  description: "",
  fileUrl: "",
  coverColor: "bg-primary",
  coverImageUrl: "",
  countryCodes: [],
};

export default function AdminLibrary() {
  const { libraryItems, createLibraryItem, updateLibraryItem, deleteLibraryItem } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<LibraryItem | null>(null);
  const [form, setForm] = useState(emptyItem);
  const [search, setSearch] = useState("");
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const filtered = libraryItems.filter((i) => i.title.toLowerCase().includes(search.toLowerCase()));

  const openCreate = () => {
    setEditing(null);
    setForm(emptyItem);
    setDialogOpen(true);
  };

  const openEdit = (item: LibraryItem) => {
    setEditing(item);
    setForm({ ...item, countryCodes: item.countryCodes || [], coverImageUrl: item.coverImageUrl || "" });
    setDialogOpen(true);
  };

  const toggleCountry = (countryCode: string) => {
    setForm((prev) => ({
      ...prev,
      countryCodes: prev.countryCodes.includes(countryCode)
        ? prev.countryCodes.filter((c) => c !== countryCode)
        : [...prev.countryCodes, countryCode],
    }));
  };

  const handleFileUpload = async (file: File) => {
    setUploadingFile(true);
    try {
      const { url } = await uploadContentFile(file, "library");
      setForm((prev) => ({ ...prev, fileUrl: url }));
    } finally {
      setUploadingFile(false);
    }
  };

  const handleCoverUpload = async (file: File) => {
    setUploadingCover(true);
    try {
      const { url } = await uploadContentFile(file, "library");
      setForm((prev) => ({ ...prev, coverImageUrl: url }));
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSave = async () => {
    if (editing) {
      await updateLibraryItem(editing.id, form);
    } else {
      await createLibraryItem(form);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => deleteLibraryItem(id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="font-display text-2xl font-bold text-foreground">Library Management</h2>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-1" /> Add Document</Button>
      </div>

      <Input placeholder="Search documents..." value={search} onChange={(e) => setSearch(e.target.value)} />

      <Card>
        <CardContent className="p-0 divide-y divide-border">
          {filtered.length === 0 && <p className="p-8 text-center text-muted-foreground">No documents found.</p>}
          {filtered.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
              <div className={`w-10 h-12 ${item.coverColor} rounded-sm flex items-center justify-center shrink-0 overflow-hidden`}>
                {item.coverImageUrl ? (
                  <img src={item.coverImageUrl} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <BookOpen className="w-5 h-5 text-primary-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.author} · {item.pages} pages · {item.format}</p>
              </div>
              <Badge variant="secondary" className="text-[10px] shrink-0">{item.countryCodes?.length ? `${item.countryCodes.length} countries` : "Global"}</Badge>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => openEdit(item)}><Edit2 className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit Document" : "Add Document"}</DialogTitle></DialogHeader>

          <div className="space-y-4">
            <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div><Label>Author</Label><Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} /></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Pages</Label><Input type="number" value={form.pages} onChange={(e) => setForm({ ...form, pages: parseInt(e.target.value) || 0 })} /></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Format</Label>
                <Select value={form.format} onValueChange={(v) => setForm({ ...form, format: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="DOCX">DOCX</SelectItem>
                    <SelectItem value="EPUB">EPUB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Cover Color</Label>
                <Select value={form.coverColor} onValueChange={(v) => setForm({ ...form, coverColor: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{coverColors.map((c) => <SelectItem key={c} value={c}>{c.replace("bg-", "")}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Document URL</Label>
              <div className="flex gap-2">
                <Input value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} placeholder="https://..." className="flex-1" />
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploadingFile}>
                  <Upload className="w-4 h-4 mr-1" /> {uploadingFile ? "Uploading..." : "Upload"}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.epub,.txt"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handleFileUpload(file);
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Cover Image URL</Label>
              <div className="flex gap-2">
                <Input value={form.coverImageUrl} onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })} placeholder="https://..." className="flex-1" />
                <Button type="button" variant="outline" onClick={() => coverInputRef.current?.click()} disabled={uploadingCover}>
                  <Upload className="w-4 h-4 mr-1" /> {uploadingCover ? "Uploading..." : "Upload"}
                </Button>
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handleCoverUpload(file);
                  }}
                />
              </div>
            </div>

            <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>

            <div className="space-y-2">
              <Label>Target Countries (leave empty for global visibility)</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-44 overflow-y-auto border border-border rounded-md p-3">
                {natoCountries.map((country) => (
                  <label key={country.code} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.countryCodes.includes(country.code)}
                      onChange={() => toggleCountry(country.code)}
                      className="accent-primary"
                    />
                    <span>{country.flag} {country.code}</span>
                  </label>
                ))}
              </div>
            </div>
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
