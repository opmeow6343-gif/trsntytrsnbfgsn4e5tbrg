import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCoupons, createCoupon, updateCoupon, deleteCouponById } from "@/lib/storage";
import type { CouponCode } from "@/lib/storage";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Tag } from "lucide-react";

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState<CouponCode[]>([]);
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(10);
  const [maxUses, setMaxUses] = useState(10);
  const [planRestriction, setPlanRestriction] = useState("none");

  const load = async () => setCoupons(await getCoupons());
  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!code.trim()) { toast({ title: "Error", description: "Code required", variant: "destructive" }); return; }
    await createCoupon({ code: code.trim().toUpperCase(), discountPercent: discount, maxUses, planRestriction: planRestriction === "none" ? undefined : planRestriction, active: true });
    setCode(""); setDiscount(10); setMaxUses(10); setPlanRestriction("none");
    await load();
    toast({ title: "Coupon created!" });
  };

  const handleToggle = async (id: string, active: boolean) => { await updateCoupon(id, { active: !active }); await load(); };
  const handleDelete = async (id: string) => { await deleteCouponById(id); await load(); toast({ title: "Coupon deleted" }); };

  return (
    <div className="space-y-4">
      <Card className="border-border/50 bg-card/50">
        <CardHeader><CardTitle className="font-display text-sm tracking-wider flex items-center gap-2"><Tag className="h-4 w-4 text-primary" /> CREATE COUPON</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Code</Label>
              <Input value={code} onChange={e => setCode(e.target.value)} placeholder="e.g. SAVE20" className="bg-secondary/50 border-border mt-1 text-xs" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Discount %</Label>
              <Input type="number" value={discount} onChange={e => setDiscount(Number(e.target.value))} min={1} max={100} className="bg-secondary/50 border-border mt-1 text-xs" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Max Uses</Label>
              <Input type="number" value={maxUses} onChange={e => setMaxUses(Number(e.target.value))} min={1} className="bg-secondary/50 border-border mt-1 text-xs" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Plan Restriction</Label>
              <Select value={planRestriction} onValueChange={setPlanRestriction}>
                <SelectTrigger className="mt-1 text-xs bg-secondary/50 border-border"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">All Plans</SelectItem>
                  <SelectItem value="minecraft">Minecraft Only</SelectItem>
                  <SelectItem value="bot">Bot Only</SelectItem>
                  <SelectItem value="booster">Booster Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleCreate} className="gap-2 glow-blue font-display text-xs tracking-wider"><Plus className="h-4 w-4" />CREATE</Button>
        </CardContent>
      </Card>

      {coupons.length > 0 && (
        <Card className="border-border/50 bg-card/50">
          <CardHeader><CardTitle className="font-display text-sm tracking-wider">ALL COUPONS ({coupons.length})</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {coupons.map(c => (
              <div key={c.id} className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3 gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-sm">{c.code}</span>
                    <Badge className="text-[10px] bg-primary/15 text-primary">{c.discountPercent}% OFF</Badge>
                    {c.planRestriction && <Badge variant="outline" className="text-[10px]">{c.planRestriction}</Badge>}
                    {c.active ? <Badge className="text-[10px] bg-green-500/15 text-green-400">Active</Badge> : <Badge variant="secondary" className="text-[10px]">Inactive</Badge>}
                  </div>
                  <p className="text-[10px] text-muted-foreground">Uses: {c.usesLeft}/{c.maxUses} remaining</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Switch checked={c.active} onCheckedChange={() => handleToggle(c.id, c.active)} />
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(c.id)} className="h-8 w-8 text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminCoupons;
