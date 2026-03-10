import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getWebhookSettings, saveWebhookSettings } from "@/lib/storage";
import type { WebhookSettings } from "@/lib/storage";
import { toast } from "@/hooks/use-toast";
import { Save, Webhook } from "lucide-react";

const AdminWebhooks = () => {
  const [settings, setSettings] = useState<WebhookSettings>({ discordWebhookUrl: "", enabled: false, discordPingId: "" });

  useEffect(() => { getWebhookSettings().then(setSettings); }, []);

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
          <Label className="text-xs text-muted-foreground">Ping Role/User ID (optional)</Label>
          <Input value={settings.discordPingId} onChange={e => setSettings({ ...settings, discordPingId: e.target.value })} placeholder="e.g. 123456789012345678" className="bg-secondary/50 border-border mt-1 text-xs" />
        </div>
        <Button onClick={handleSave} className="gap-2 glow-blue font-display text-xs tracking-wider"><Save className="h-4 w-4" />SAVE</Button>
      </CardContent>
    </Card>
  );
};

export default AdminWebhooks;
