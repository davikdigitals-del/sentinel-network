import { useRef, useState } from "react";
import { Plus, Edit2, Trash2, Video, Headphones, Link as LinkIcon, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useData, type MediaItem } from "@/contexts/DataContext";
import { natoCountries } from "@/data/mockData";
import { uploadContentFile } from "@/lib/storage";

export default function AdminPodcastVideos() {
  const { mediaItems, createMediaItem, updateMediaItem, deleteMediaItem } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<MediaItem | null>(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<Partial<MediaItem>>({
    title: "",
    description: "",
    type: "video",
    duration: "",
    author: "",
    tags: [],
    url: "",
    thumbnail: "",
    countryCodes: [],
  });
  const [uploadingUrl, setUploadingUrl] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);

  const mediaInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  const filtered = mediaItems.filter((i) => i.title.toLowerCase().includes(search.toLowerCase()));

  const openCreate = () => {
    setEditing(null);
    setForm({ title: "", description: "", type: "video", duration: "", author: "", tags: [], url: "", thumbnail: "", countryCodes: [] });
    setDialogOpen(true);
  };

  const openEdit = (item: MediaItem) => {
    setEditing(item);
    setForm({ ...item, countryCodes: item.countryCodes || [] });
    setDialogOpen(true);
  };

  const toggleCountry = (countryCode: string) => {
    setForm((prev) => ({
      ...prev,
      countryCodes: prev.countryCodes?.includes(countryCode)
        ? prev.countryCodes.filter((c) => c !== countryCode)
        : [...(prev.countryCodes || []), countryCode],
    }));
  };

  const uploadMediaFile = async (file: File) => {
    setUploadingUrl(true);
    try {
      const { url } = await uploadContentFile(file, "media");
      setForm((prev) => ({ ...prev, url }));
    } finally {
      setUploadingUrl(false);
    }
  };

  const uploadThumbnail = async (file: File) => {
    setUploadingThumb(true);
    try {
      const { url } = await uploadContentFile(file, "media");
      setForm((prev) => ({ ...prev, thumbnail: url }));
    } finally {
      setUploadingThumb(false);
    }
  };

  const handleSave = async () => {
    if (editing) {
      await updateMediaItem(editing.id, form);
    } else {
      await createMediaItem({
        title: form.title || "",
        description: form.description || "",
        type: (form.type as "video" | "podcast") || "video",
        duration: form.duration || "",
        views: 0,
        publishedAt: new Date().toISOString(),
        author: form.author || "",
        tags: form.tags || [],
        url: form.url || "",
        thumbnail: form.thumbnail || "",
        countryCodes: form.countryCodes || [],
      });
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => deleteMediaItem(id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="font-display text-2xl font-bold text-foreground">Podcasts & Videos</h2>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-1" /> Add Media</Button>
      </div>

      <Input placeholder="Search media..." value={search} onChange={(e) => setSearch(e.target.value)} />

      <Card>
        <CardContent className="p-0 divide-y divide-border">
          {filtered.length === 0 && <p className="p-8 text-center text-muted-foreground">No media items.</p>}
          {filtered.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
              <div className="p-2 rounded-md bg-muted shrink-0">
                {item.type === "video" ? <Video className="w-5 h-5 text-alert" /> : <Headphones className="w-5 h-5 text-primary" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <Badge variant="secondary" className="text-[10px]">{item.type}</Badge>
                  <span className="text-xs text-muted-foreground">{item.duration}</span>
                  {item.url && <LinkIcon className="w-3 h-3 text-info" />}
                  <span className="text-xs text-muted-foreground">{item.countryCodes?.length ? `${item.countryCodes.length} countries` : "Global"}</span>
                </div>
                <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.author} · {item.views.toLocaleString()} views</p>
              </div>
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
          <DialogHeader><DialogTitle>{editing ? "Edit Media" : "Add Media"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div><Label>Description</Label><Textarea value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Type</Label>
                <Select value={form.type || "video"} onValueChange={(v) => setForm({ ...form, type: v as "video" | "podcast" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="podcast">Podcast</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Duration</Label><Input value={form.duration || ""} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="24:15" /></div>
            </div>

            <div><Label>Author</Label><Input value={form.author || ""} onChange={(e) => setForm({ ...form, author: e.target.value })} /></div>

            <div className="space-y-2">
              <Label>Media URL</Label>
              <div className="flex gap-2">
                <Input value={form.url || ""} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." />
                <Button type="button" variant="outline" onClick={() => mediaInputRef.current?.click()} disabled={uploadingUrl}>
                  <Upload className="w-4 h-4 mr-1" /> {uploadingUrl ? "Uploading..." : "Upload"}
                </Button>
                <input
                  ref={mediaInputRef}
                  type="file"
                  accept="audio/*,video/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void uploadMediaFile(file);
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Thumbnail URL</Label>
              <div className="flex gap-2">
                <Input value={form.thumbnail || ""} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} placeholder="https://..." />
                <Button type="button" variant="outline" onClick={() => thumbInputRef.current?.click()} disabled={uploadingThumb}>
                  <Upload className="w-4 h-4 mr-1" /> {uploadingThumb ? "Uploading..." : "Upload"}
                </Button>
                <input
                  ref={thumbInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void uploadThumbnail(file);
                  }}
                />
              </div>
            </div>

            <div><Label>Tags (comma-separated)</Label><Input value={form.tags?.join(", ") || ""} onChange={(e) => setForm({ ...form, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} /></div>

            <div className="space-y-2">
              <Label>Target Countries (leave empty for global visibility)</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-44 overflow-y-auto border border-border rounded-md p-3">
                {natoCountries.map((country) => (
                  <label key={country.code} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.countryCodes?.includes(country.code) || false}
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
            <Button onClick={handleSave} disabled={!form.title}>{editing ? "Save" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
