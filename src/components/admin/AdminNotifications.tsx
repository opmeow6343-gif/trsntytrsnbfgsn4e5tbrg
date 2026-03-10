import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Bell, Plus, Trash2, Send } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  created_at: string;
}

const TYPES = [
  { value: "info", label: "Info", color: "bg-blue-500/15 text-blue-400" },
  { value: "warning", label: "Warning", color: "bg-yellow-500/15 text-yellow-400" },
  { value: "success", label: "Success", color: "bg-green-500/15 text-green-400" },
  { value: "alert", label: "Alert", color: "bg-red-500/15 text-red-400" },
];

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await (supabase as any).from("notifications").select("*").order("created_at", { ascending: false });
    setNotifications(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      toast({ title: "Error", description: "Title and message required", variant: "destructive" });
      return;
    }
    const { data: { session } } = await supabase.auth.getSession();
    await (supabase as any).from("notifications").insert({
      title: title.trim(), message: message.trim(), type, created_by: session?.user?.id,
    });
    setTitle(""); setMessage(""); setType("info");
    toast({ title: "Alert sent to all users!" });
    load();
  };

  const handleDelete = async (id: string) => {
    await (supabase as any).from("notifications").delete().eq("id", id);
    toast({ title: "Notification deleted" });
    load();
  };

  const typeColor = (t: string) => TYPES.find(x => x.value === t)?.color || "bg-muted/30 text-muted-foreground";

  return (
    <div className="space-y-4">
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="font-display text-sm tracking-wider flex items-center gap-2">
            <Send className="h-4 w-4 text-primary" /> SEND ALERT TO ALL USERS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Alert title" value={title} onChange={e => setTitle(e.target.value)} className="bg-secondary/50 border-border" />
          <Textarea placeholder="Alert message..." value={message} onChange={e => setMessage(e.target.value)} className="bg-secondary/50 border-border min-h-[80px]" />
          <div className="flex gap-2">
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button onClick={handleSend} className="gap-1.5 glow-primary text-xs">
              <Bell className="h-3.5 w-3.5" /> Send Alert
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="font-display text-sm tracking-wider">SENT ALERTS ({notifications.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {loading ? (
            <p className="text-xs text-muted-foreground text-center py-4">Loading...</p>
          ) : notifications.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">No alerts sent yet</p>
          ) : (
            notifications.map(n => (
              <div key={n.id} className="flex items-start justify-between rounded-lg bg-secondary/50 px-4 py-3 gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={`text-[10px] ${typeColor(n.type)}`}>{n.type.toUpperCase()}</Badge>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(n.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="text-sm font-semibold">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.message}</p>
                </div>
                <Button size="icon" variant="ghost" onClick={() => handleDelete(n.id)} className="h-8 w-8 text-destructive hover:text-destructive shrink-0">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminNotifications;
