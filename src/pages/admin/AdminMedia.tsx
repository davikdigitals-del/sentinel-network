import { useState, useRef } from "react";
import { Upload, Trash2, FileText, Image, File, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MediaFile {
  id: string;
  name: string;
  type: "image" | "document" | "other";
  size: string;
  url: string;
  uploadedAt: string;
}

const mockMedia: MediaFile[] = [
  { id: "m1", name: "emergency-kit-guide.pdf", type: "document", size: "2.4 MB", url: "#", uploadedAt: "2026-02-27T10:00:00Z" },
  { id: "m2", name: "hero-power-grid.jpg", type: "image", size: "890 KB", url: "/placeholder.svg", uploadedAt: "2026-02-27T08:00:00Z" },
  { id: "m3", name: "evacuation-checklist.pdf", type: "document", size: "1.1 MB", url: "#", uploadedAt: "2026-02-26T15:00:00Z" },
  { id: "m4", name: "first-aid-banner.png", type: "image", size: "1.6 MB", url: "/placeholder.svg", uploadedAt: "2026-02-25T12:00:00Z" },
  { id: "m5", name: "water-storage-diagram.svg", type: "image", size: "45 KB", url: "/placeholder.svg", uploadedAt: "2026-02-24T09:00:00Z" },
];

const typeIcons = {
  image: Image,
  document: FileText,
  other: File,
};

export default function AdminMedia() {
  const [files, setFiles] = useState<MediaFile[]>(mockMedia);
  const [dragActive, setDragActive] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = files.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleFiles = (fileList: FileList) => {
    const newFiles: MediaFile[] = Array.from(fileList).map((f) => ({
      id: Date.now().toString() + Math.random(),
      name: f.name,
      type: f.type.startsWith("image/") ? "image" : f.type === "application/pdf" ? "document" : "other",
      size: `${(f.size / 1024).toFixed(0)} KB`,
      url: f.type.startsWith("image/") ? URL.createObjectURL(f) : "#",
      uploadedAt: new Date().toISOString(),
    }));
    setFiles((prev) => [...newFiles, ...prev]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  };

  const handleDelete = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-foreground">Media & Uploads</h2>

      {/* Upload zone */}
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
        <p className="text-sm text-foreground font-medium">
          Drop files here or click to upload
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Images, PDFs, documents up to 50 MB
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {/* Search */}
      <Input
        placeholder="Search files..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* File grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((file) => {
          const Icon = typeIcons[file.type];
          return (
            <Card key={file.id} className="group">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-md bg-muted shrink-0">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{file.size}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" title="Download">
                      <Download className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(file.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-8">No files found.</p>
      )}
    </div>
  );
}
