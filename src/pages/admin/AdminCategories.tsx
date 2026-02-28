import { useState } from "react";
import { Plus, Edit2, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { navSections, type NavSection } from "@/data/mockData";

interface CategoryItem {
  title: string;
  slug: string;
  sectionSlug: string;
  sectionTitle: string;
}

export default function AdminCategories() {
  const [sections, setSections] = useState<NavSection[]>([...navSections]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"section" | "category">("category");
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formSection, setFormSection] = useState("");

  const allCategories: CategoryItem[] = sections.flatMap((s) =>
    s.categories.map((c) => ({
      ...c,
      sectionSlug: s.slug,
      sectionTitle: s.title,
    }))
  );

  const openAddCategory = () => {
    setDialogMode("category");
    setEditingCategory(null);
    setFormTitle("");
    setFormSlug("");
    setFormSection(sections[0]?.slug || "");
    setDialogOpen(true);
  };

  const openEditCategory = (cat: CategoryItem) => {
    setDialogMode("category");
    setEditingCategory(cat);
    setFormTitle(cat.title);
    setFormSlug(cat.slug);
    setFormSection(cat.sectionSlug);
    setDialogOpen(true);
  };

  const openAddSection = () => {
    setDialogMode("section");
    setEditingCategory(null);
    setFormTitle("");
    setFormSlug("");
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (dialogMode === "section") {
      setSections((prev) => [
        ...prev,
        { title: formTitle, slug: formSlug, color: "category-emergency", categories: [] },
      ]);
    } else if (editingCategory) {
      setSections((prev) =>
        prev.map((s) => {
          if (s.slug === editingCategory.sectionSlug) {
            return {
              ...s,
              categories: s.categories.map((c) =>
                c.slug === editingCategory.slug ? { title: formTitle, slug: formSlug } : c
              ),
            };
          }
          return s;
        })
      );
    } else {
      setSections((prev) =>
        prev.map((s) =>
          s.slug === formSection
            ? { ...s, categories: [...s.categories, { title: formTitle, slug: formSlug }] }
            : s
        )
      );
    }
    setDialogOpen(false);
  };

  const deleteCategory = (cat: CategoryItem) => {
    setSections((prev) =>
      prev.map((s) =>
        s.slug === cat.sectionSlug
          ? { ...s, categories: s.categories.filter((c) => c.slug !== cat.slug) }
          : s
      )
    );
  };

  const autoSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="font-display text-2xl font-bold text-foreground">Sections & Categories</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={openAddSection}>
            <Plus className="w-4 h-4 mr-1" /> New Section
          </Button>
          <Button onClick={openAddCategory}>
            <Plus className="w-4 h-4 mr-1" /> New Category
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <Card key={section.slug}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary" />
                {section.title}
                <Badge variant="secondary" className="ml-2 text-[10px]">
                  {section.categories.length} categories
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="divide-y divide-border">
                {section.categories.map((cat) => (
                  <div
                    key={cat.slug}
                    className="flex items-center gap-3 py-2.5 group"
                  >
                    <GripVertical className="w-4 h-4 text-muted-foreground/40 cursor-grab" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{cat.title}</p>
                      <p className="text-xs text-muted-foreground">/{section.slug}/{cat.slug}</p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          openEditCategory({
                            ...cat,
                            sectionSlug: section.slug,
                            sectionTitle: section.title,
                          })
                        }
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          deleteCategory({
                            ...cat,
                            sectionSlug: section.slug,
                            sectionTitle: section.title,
                          })
                        }
                      >
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
                {section.categories.length === 0 && (
                  <p className="py-4 text-sm text-muted-foreground text-center">No categories yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "section"
                ? "Add Section"
                : editingCategory
                ? "Edit Category"
                : "Add Category"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={formTitle}
                onChange={(e) => {
                  setFormTitle(e.target.value);
                  if (!editingCategory) setFormSlug(autoSlug(e.target.value));
                }}
              />
            </div>
            <div>
              <Label>Slug</Label>
              <Input value={formSlug} onChange={(e) => setFormSlug(e.target.value)} />
            </div>
            {dialogMode === "category" && !editingCategory && (
              <div>
                <Label>Parent Section</Label>
                <Select value={formSection} onValueChange={setFormSection}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {sections.map((s) => (
                      <SelectItem key={s.slug} value={s.slug}>{s.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!formTitle || !formSlug}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
