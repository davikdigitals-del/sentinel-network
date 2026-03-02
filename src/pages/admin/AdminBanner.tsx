import { useState } from "react";
import { AlertTriangle, Save, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useData } from "@/contexts/DataContext";

export default function AdminBanner() {
  const { banner, updateBanner } = useData();
  const [saved, setSaved] = useState(false);
  const [localBanner, setLocalBanner] = useState(banner);

  const handleSave = async () => {
    await updateBanner(localBanner);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="font-display text-2xl font-bold text-foreground">Announcer Banner</h2>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-1" /> {saved ? "Saved ✓" : "Save & Publish"}
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Eye className="w-4 h-4" /> Live Preview</CardTitle></CardHeader>
        <CardContent>
          {localBanner.enabled ? (
            <div className="bg-alert text-alert-foreground rounded-sm overflow-hidden">
              <div className="flex items-center h-8 gap-3 px-4">
                <div className="flex items-center gap-1.5 shrink-0">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold uppercase tracking-wide">Breaking</span>
                </div>
                <span className="text-xs font-medium whitespace-nowrap overflow-hidden">{localBanner.text || "No text set"}</span>
              </div>
            </div>
          ) : (
            <div className="bg-muted rounded-sm p-4 text-center text-sm text-muted-foreground">Banner is currently disabled</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Switch checked={localBanner.enabled} onCheckedChange={v => setLocalBanner(prev => ({ ...prev, enabled: v }))} />
            <Label>Enable banner</Label>
          </div>
          <div>
            <Label>Banner Text</Label>
            <Input value={localBanner.text} onChange={e => setLocalBanner(prev => ({ ...prev, text: e.target.value }))} placeholder="Breaking news text..." className="mt-1" />
          </div>
          <div>
            <Label>Priority Level</Label>
            <Select value={localBanner.priority} onValueChange={v => setLocalBanner(prev => ({ ...prev, priority: v as any }))}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="high">🔴 High — Breaking</SelectItem>
                <SelectItem value="medium">🟡 Medium — Important</SelectItem>
                <SelectItem value="low">🔵 Low — Informational</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
