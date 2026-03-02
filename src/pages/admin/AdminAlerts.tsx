import { useState } from "react";
import { Plus, Trash2, AlertTriangle, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useData } from "@/contexts/DataContext";
import { cn } from "@/lib/utils";

const priorityConfig = {
  high: { label: "High", color: "bg-destructive text-destructive-foreground" },
  medium: { label: "Medium", color: "bg-warning text-warning-foreground" },
  low: { label: "Low", color: "bg-info text-info-foreground" },
};

type AlertPriority = "high" | "medium" | "low";

export default function AdminAlerts() {
  const { alerts, createAlert, updateAlert, deleteAlert } = useData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<AlertPriority>("medium");

  const openCreate = () => { setEditingId(null); setText(""); setPriority("medium"); setDialogOpen(true); };
  const openEdit = (alert: typeof alerts[0]) => { setEditingId(alert.id); setText(alert.text); setPriority(alert.priority); setDialogOpen(true); };

  const handleSave = async () => {
    if (editingId) {
      await updateAlert(editingId, { text, priority });
    } else {
      await createAlert({ text, priority });
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => deleteAlert(id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="font-display text-2xl font-bold text-foreground">Emergency Alerts</h2>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-1" /> New Alert</Button>
      </div>

      <Card className="border-destructive/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Live Banner Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-alert text-alert-foreground rounded-sm p-3 flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-medium truncate">
                {alerts.find(a => a.priority === "high")?.text || alerts[0]?.text || "No active alerts"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0 divide-y divide-border">
          {alerts.length === 0 && <p className="p-8 text-center text-muted-foreground">No alerts configured.</p>}
          {alerts.map(alert => (
            <div key={alert.id} className="flex items-start gap-4 p-4 hover:bg-muted/30 transition-colors">
              <span className={cn("mt-1 shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase", priorityConfig[alert.priority].color)}>
                {alert.priority}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{alert.text}</p>
                <p className="text-xs text-muted-foreground mt-1">{new Date(alert.timestamp).toLocaleString()}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => openEdit(alert)}><Edit2 className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(alert.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingId ? "Edit Alert" : "Create Alert"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Alert Text</Label><Input value={text} onChange={e => setText(e.target.value)} placeholder="ALERT: Description..." /></div>
            <div>
              <Label>Priority</Label>
              <Select value={priority} onValueChange={v => setPriority(v as AlertPriority)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">🔴 High — Breaking banner</SelectItem>
                  <SelectItem value="medium">🟡 Medium — Ticker</SelectItem>
                  <SelectItem value="low">🔵 Low — Info only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!text}>{editingId ? "Update" : "Publish Alert"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
