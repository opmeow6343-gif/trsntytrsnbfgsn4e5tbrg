import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { getFlashSales, createFlashSale, updateFlashSale, deleteFlashSale } from "@/lib/storage";
import type { FlashSale } from "@/lib/storage";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Zap } from "lucide-react";

const AdminFlashSales = () => {
  const [sales, setSales] = useState<FlashSale[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState(10);
  const [endTime, setEndTime] = useState("");

  const load = async () => setSales(await getFlashSales());
  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!title.trim() || !endTime) { toast({ title: "Error", description: "Title and end time required", variant: "destructive" }); return; }
    await createFlashSale({ title: title.trim(), description: description.trim(), discountPercent: discount, endTime: new Date(endTime).toISOString(), active: true });
    setTitle(""); setDescription(""); setDiscount(10); setEndTime("");
    await load();
    toast({ title: "Flash sale created!" });
  };

  const handleToggle = async (id: string, active: boolean) => { await updateFlashSale(id, { active: !active }); await load(); };
  const handleDelete = async (id: string) => { await deleteFlashSale(id); await load(); toast({ title: "Flash sale deleted" }); };

  return (
    <div className="space-y-4">
      <Card className="border-border/50 bg-card/50">
        <CardHeader><CardTitle className="font-display text-sm tracking-wider flex items-center gap-2"><Zap className="h-4 w-4 text-yellow-400" /> CREATE FLASH SALE</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Sale title" className="bg-secondary/50 border-border text-xs" />
          <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" className="bg-secondary/50 border-border text-xs min-h-[60px]" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Discount %</Label>
              <Input type="number" value={discount} onChange={e => setDiscount(Number(e.target.value))} min={1} max={100} className="bg-secondary/50 border-border mt-1 text-xs" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">End Time</Label>
              <Input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} className="bg-secondary/50 border-border mt-1 text-xs" />
            </div>
          </div>
          <Button onClick={handleCreate} className="gap-2 glow-blue font-display text-xs tracking-wider"><Plus className="h-4 w-4" />CREATE SALE</Button>
        </CardContent>
      </Card>

      {sales.length > 0 && (
        <Card className="border-border/50 bg-card/50">
          <CardHeader><CardTitle className="font-display text-sm tracking-wider">ALL FLASH SALES ({sales.length})</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {sales.map(s => {
              const expired = new Date(s.endTime) < new Date();
              return (
                <div key={s.id} className="flex items-start justify-between rounded-lg bg-secondary/50 px-4 py-3 gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{s.title}</span>
                      <Badge className="text-[10px] bg-yellow-500/15 text-yellow-400">{s.discountPercent}% OFF</Badge>
                      {s.active && !expired ? <Badge className="text-[10px] bg-green-500/15 text-green-400">Live</Badge> : <Badge variant="secondary" className="text-[10px]">{expired ? "Expired" : "Inactive"}</Badge>}
                    </div>
                    {s.description && <p className="text-xs text-muted-foreground truncate">{s.description}</p>}
                    <p className="text-[10px] text-muted-foreground mt-1">Ends: {new Date(s.endTime).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Switch checked={s.active} onCheckedChange={() => handleToggle(s.id, s.active)} />
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(s.id)} className="h-8 w-8 text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminFlashSales;
