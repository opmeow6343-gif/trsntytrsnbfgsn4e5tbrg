import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getWebhookSettings, saveWebhookSettings } from "@/lib/storage";
import type { WebhookSettings } from "@/lib/storage";
import { toast } from "@/hooks/use-toast";
import { Save, Webhook, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const AdminWebhooks = () => {
  const [settings, setSettings] = useState<WebhookSettings>({ discordWebhookUrl: "", enabled: false, discordPingId: "" });
  const [newPingId, setNewPingId] = useState("");

  useEffect(() => { getWebhookSettings().then(setSettings); }, []);

  // Parse comma-separated ping IDs
  const pingIds = settings.discordPingId
    ? settings.discordPingId.split(",").map(s => s.trim()).filter(Boolean)
    : [];

  const addPingId = () => {
    const id = newPingId.trim();
    if (!id) return;
    if (pingIds.length >= 3) {
      toast({ title: "Maximum 3 ping IDs allowed", variant: "destructive" });
      return;
    }
    if (pingIds.includes(id)) {
      toast({ title: "ID already added", variant: "destructive" });
      return;
    }
    const updated = [...pingIds, id].join(",");
    setSettings({ ...settings, discordPingId: updated });
    setNewPingId("");
  };

  const removePingId = (id: string) => {
    const updated = pingIds.filter(p => p !== id).join(",");
    setSettings({ ...settings, discordPingId: updated });
  };

  const handleSave = async () => {
    await saveWebhookSettings(settings);
    toast({ title: "Webhook settings saved!" });
  };

  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader><CardTitle className="font-display text-sm tracking-wider flex items-center gap-2"><Webhook className="h-4 w-4 text-primary" /> DISCORD WEBHOOK</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 rounded-lg bg-secondary/50 px-4 py-3">
          <Label className="text-sm font-medium flex-1">Enable Webhook Notifications</Label>
          <Switch checked={settings.enabled} onCheckedChange={v => setSettings({ ...settings, enabled: v })} />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Webhook URL</Label>
          <Input value={settings.discordWebhookUrl} onChange={e => setSettings({ ...settings, discordWebhookUrl: e.target.value })} placeholder="https://discord.com/api/webhooks/..." className="bg-secondary/50 border-border mt-1 text-xs" />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Ping Role/User IDs (up to 3)</Label>
          <p className="text-[10px] text-muted-foreground mb-2">Add Discord user or role IDs to ping when a new ticket is created.</p>
          
          {/* Current ping IDs */}
          {pingIds.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {pingIds.map((id) => (
                <Badge key={id} variant="secondary" className="gap-1.5 pr-1 text-xs">
                  <span className="font-mono">{id}</span>
                  <button
                    onClick={() => removePingId(id)}
                    className="h-4 w-4 rounded-full hover:bg-destructive/20 flex items-center justify-center transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Add new ping ID */}
          {pingIds.length < 3 && (
            <div className="flex gap-2">
              <Input
                value={newPingId}
                onChange={e => setNewPingId(e.target.value)}
                placeholder="e.g. 123456789012345678"
                className="bg-secondary/50 border-border text-xs font-mono"
                onKeyDown={e => e.key === "Enter" && addPingId()}
              />
              <Button onClick={addPingId} variant="outline" size="sm" className="gap-1 shrink-0">
                <Plus className="h-3 w-3" /> Add
              </Button>
            </div>
          )}

          {pingIds.length >= 3 && (
            <p className="text-[10px] text-muted-foreground">Maximum 3 IDs reached. Remove one to add another.</p>
          )}
        </div>
        <Button onClick={handleSave} className="gap-2 glow-primary font-display text-xs tracking-wider"><Save className="h-4 w-4" />SAVE</Button>
      </CardContent>
    </Card>
  );
};

export default AdminWebhooks;
