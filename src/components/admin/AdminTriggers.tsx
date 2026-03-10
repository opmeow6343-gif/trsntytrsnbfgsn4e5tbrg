import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { getTriggers, addTrigger, toggleTriggerEnabled, deleteTriggerById } from "@/lib/storage";
import type { Trigger } from "@/lib/storage";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Zap } from "lucide-react";

const AdminTriggers = () => {
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [keyword, setKeyword] = useState("");
  const [response, setResponse] = useState("");
  const [responseImage, setResponseImage] = useState("");

  const load = async () => setTriggers(await getTriggers());
  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!keyword.trim() || !response.trim()) { toast({ title: "Error", description: "Keyword and response required", variant: "destructive" }); return; }
    await addTrigger({ keyword: keyword.trim(), responseText: response.trim(), responseImage: responseImage.trim() || undefined, enabled: true });
    setKeyword(""); setResponse(""); setResponseImage("");
    await load();
    toast({ title: "Trigger created!" });
  };

  const handleToggle = async (id: string, enabled: boolean) => { await toggleTriggerEnabled(id, !enabled); await load(); };
  const handleDelete = async (id: string) => { await deleteTriggerById(id); await load(); toast({ title: "Trigger deleted" }); };

  return (
    <div className="space-y-4">
      <Card className="border-border/50 bg-card/50">
        <CardHeader><CardTitle className="font-display text-sm tracking-wider flex items-center gap-2"><Zap className="h-4 w-4 text-primary" /> CREATE AUTO-TRIGGER</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground">Keyword</Label>
            <Input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="e.g. status" className="bg-secondary/50 border-border mt-1 text-xs" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Auto-Response</Label>
            <Textarea value={response} onChange={e => setResponse(e.target.value)} placeholder="Response text when keyword is detected" className="bg-secondary/50 border-border mt-1 text-xs min-h-[60px]" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Response Image URL (optional)</Label>
            <Input value={responseImage} onChange={e => setResponseImage(e.target.value)} placeholder="https://..." className="bg-secondary/50 border-border mt-1 text-xs" />
          </div>
          <Button onClick={handleCreate} className="gap-2 glow-blue font-display text-xs tracking-wider"><Plus className="h-4 w-4" />CREATE TRIGGER</Button>
        </CardContent>
      </Card>

      {triggers.length > 0 && (
        <Card className="border-border/50 bg-card/50">
          <CardHeader><CardTitle className="font-display text-sm tracking-wider">ALL TRIGGERS ({triggers.length})</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {triggers.map(t => (
              <div key={t.id} className="flex items-start justify-between rounded-lg bg-secondary/50 px-4 py-3 gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="text-[10px] font-mono bg-primary/15 text-primary">"{t.keyword}"</Badge>
                    {t.enabled ? <Badge className="text-[10px] bg-green-500/15 text-green-400">Active</Badge> : <Badge variant="secondary" className="text-[10px]">Disabled</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{t.responseText}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Switch checked={t.enabled} onCheckedChange={() => handleToggle(t.id, t.enabled)} />
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(t.id)} className="h-8 w-8 text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminTriggers;
