import { useEffect, useRef, useState } from "react";
import { Upload, Trash2, FileText, Image, File, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface MediaFile {
  id: string;
  name: string;
  type: "image" | "document" | "other";
  size: string;
  path: string;
  url: string;
  uploadedAt: string;
}

const typeIcons = {
  image: Image,
  document: FileText,
  other: File,
};

const folders = ["misc", "posts", "library", "media"];

export default function AdminMedia() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFiles = async () => {
    setLoading(true);
    const all: MediaFile[] = [];

    await Promise.all(
      folders.map(async (folder) => {
        const { data } = await supabase.storage.from("content-files").list(folder, { limit: 100, sortBy: { column: "created_at", order: "desc" } });
        if (!data) return;

        for (const item of data) {
          if (!item.name || item.name.endsWith("/")) continue;
          const path = `${folder}/${item.name}`;
          const { data: publicData } = supabase.storage.from("content-files").getPublicUrl(path);

          const lowerName = item.name.toLowerCase();
          const type: MediaFile["type"] =
            lowerName.endsWith(".png") || lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg") || lowerName.endsWith(".webp") || lowerName.endsWith(".gif")
              ? "image"
              : lowerName.endsWith(".pdf") || lowerName.endsWith(".doc") || lowerName.endsWith(".docx") || lowerName.endsWith(".txt")
                ? "document"
                : "other";

          all.push({
            id: path,
            name: item.name,
            type,
            size: item.metadata?.size ? `${Math.round(item.metadata.size / 1024)} KB` : "-",
            path,
            url: publicData.publicUrl,
            uploadedAt: item.created_at || new Date().toISOString(),
          });
        }
      })
    );

    setFiles(all.sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt)));
    setLoading(false);
  };

  useEffect(() => {
    void loadFiles();
  }, []);

  const filtered = files.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));

  const handleFiles = async (fileList: FileList) => {
    const selected = Array.from(fileList);
    await Promise.all(
      selected.map(async (file) => {
        const extension = file.name.includes(".") ? file.name.split(".").pop() : "bin";
        const path = `misc/${crypto.randomUUID()}.${extension}`;
        await supabase.storage.from("content-files").upload(path, file);
      })
    );
    await loadFiles();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files.length) void handleFiles(e.dataTransfer.files);
  };

  const handleDelete = async (path: string) => {
    await supabase.storage.from("content-files").remove([path]);
    setFiles((prev) => prev.filter((f) => f.path !== path));
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-foreground">Media & Uploads</h2>

      <div
        className={cn(
          "border-2 border-dashed rounded-md p-8 text-center transition-colors cursor-pointer",
          dragActive ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/40"
        )}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
        <p className="text-sm text-foreground font-medium">Upload real files to content storage</p>
        <p className="text-xs text-muted-foreground mt-1">Images, PDFs, documents, audio, and video files</p>
        <input ref={inputRef} type="file" multiple className="hidden" onChange={(e) => e.target.files && void handleFiles(e.target.files)} />
      </div>

      <Input placeholder="Search files..." value={search} onChange={(e) => setSearch(e.target.value)} />

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading files...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((file) => {
            const Icon = typeIcons[file.type];
            return (
              <Card key={file.id} className="group">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-md bg-muted shrink-0"><Icon className="w-5 h-5 text-muted-foreground" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{file.size}</p>
                      <p className="text-xs text-muted-foreground">{new Date(file.uploadedAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button asChild variant="ghost" size="icon" title="Download"><a href={file.url} target="_blank" rel="noopener noreferrer"><Download className="w-3.5 h-3.5" /></a></Button>
                      <Button variant="ghost" size="icon" onClick={() => void handleDelete(file.path)}><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {!loading && filtered.length === 0 && <p className="text-center text-muted-foreground py-8">No files found.</p>}
    </div>
  );
}
