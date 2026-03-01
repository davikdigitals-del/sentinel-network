import { useState } from "react";
import { AlertTriangle, Save, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminBanner() {
  const [enabled, setEnabled] = useState(true);
  const [text, setText] = useState("ALERT: Power disruptions reported across Northern Europe — stay informed");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("high");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
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
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Eye className="w-4 h-4" /> Live Preview</CardTitle>
        </CardHeader>
        <CardContent>
          {enabled ? (
            <div className="bg-alert text-alert-foreground rounded-sm overflow-hidden">
              <div className="flex items-center h-8 gap-3 px-4">
                <div className="flex items-center gap-1.5 shrink-0">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold uppercase tracking-wide">Breaking</span>
                </div>
                <div className="overflow-hidden flex-1">
                  <span className="text-xs font-medium whitespace-nowrap">{text || "No text set"}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-muted rounded-sm p-4 text-center text-sm text-muted-foreground">
              Banner is currently disabled
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Switch checked={enabled} onCheckedChange={setEnabled} />
            <Label>Enable banner</Label>
          </div>
          <div>
            <Label>Banner Text</Label>
            <Input value={text} onChange={e => setText(e.target.value)} placeholder="Breaking news text..." className="mt-1" />
          </div>
          <div>
            <Label>Priority Level</Label>
            <Select value={priority} onValueChange={v => setPriority(v as any)}>
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
