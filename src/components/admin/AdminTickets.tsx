import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAllTickets, addMessage, updateTicketStatus } from "@/lib/storage";
import type { Ticket } from "@/lib/storage";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  MessageCircle, Send, Eye, X, Search,
  Trash2, RefreshCw, ArrowUpDown, Download
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const STATUS_OPTIONS = [
  { value: "open", label: "Open", color: "bg-yellow-500/15 text-yellow-400" },
  { value: "reviewing", label: "Reviewing", color: "bg-blue-500/15 text-blue-400" },
  { value: "verified", label: "Verified", color: "bg-green-500/15 text-green-400" },
  { value: "ready", label: "Ready", color: "bg-primary/15 text-primary" },
  { value: "closed", label: "Closed", color: "bg-muted/30 text-muted-foreground" },
];

const AdminTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyText, setReplyText] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "needs-reply" | "status">("newest");
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const chatEndRef = useRef<HTMLDivElement>(null);

  const loadTickets = async () => {
    setLoading(true);
    const t = await getAllTickets();
    setTickets(t);
    if (selectedTicket) {
      const updated = t.find(x => x.id === selectedTicket.id);
      if (updated) setSelectedTicket(updated);
    }
    setLoading(false);
  };

  useEffect(() => { loadTickets(); }, []);

  useEffect(() => {
    if (!selectedTicket) return;
    const channel = supabase
      .channel(`admin-chat-${selectedTicket.id}`)
      .on("postgres_changes", {
        event: "INSERT", schema: "public", table: "ticket_messages",
        filter: `ticket_id=eq.${selectedTicket.id}`,
      }, () => { loadTickets(); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [selectedTicket?.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedTicket?.messages.length]);

  const handleReply = async () => {
    if (!selectedTicket || !replyText.trim()) return;
    await addMessage(selectedTicket.id, "admin", replyText.trim());
    setReplyText("");
    await loadTickets();
    toast({ title: "Reply sent" });
  };

  const handleStatusChange = async (ticketId: string, status: string) => {
    // Optimistic update
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: status as Ticket["status"] } : t));
    if (selectedTicket?.id === ticketId) setSelectedTicket(prev => prev ? { ...prev, status: status as Ticket["status"] } : prev);

    await updateTicketStatus(ticketId, status);
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket) {
      await supabase.from("notifications").insert({
        title: `Order #${ticketId.slice(0, 8)} → ${status}`,
        message: `Your ${ticket.type} order status has been updated to "${status}".`,
        type: "order",
      } as any);
    }
    toast({ title: `Status → ${status}` });
  };

  const handleDeleteTicket = async (ticketId: string) => {
    // Optimistic: remove immediately
    setTickets(prev => prev.filter(t => t.id !== ticketId));
    if (selectedTicket?.id === ticketId) setSelectedTicket(null);
    setSelected(prev => { const next = new Set(prev); next.delete(ticketId); return next; });
    toast({ title: "Ticket deleted" });

    // Background delete
    await Promise.all([
      (supabase as any).from("ticket_messages").delete().eq("ticket_id", ticketId),
      (supabase as any).from("tickets").delete().eq("id", ticketId),
    ]);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTickets();
    setRefreshing(false);
    toast({ title: "Refreshed", description: `${tickets.length} tickets loaded` });
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(t => t.id)));
  };

  const handleBulkClose = async () => {
    const ids = Array.from(selected);
    // Optimistic
    setTickets(prev => prev.map(t => ids.includes(t.id) ? { ...t, status: "closed" as Ticket["status"] } : t));
    setSelected(new Set());
    toast({ title: `${ids.length} tickets closed` });
    await Promise.all(ids.map(id => updateTicketStatus(id, "closed")));
  };

  const handleBulkDelete = async () => {
    const ids = Array.from(selected);
    // Optimistic
    setTickets(prev => prev.filter(t => !ids.includes(t.id)));
    if (selectedTicket && ids.includes(selectedTicket.id)) setSelectedTicket(null);
    setSelected(new Set());
    toast({ title: `${ids.length} tickets deleted` });

    // Background delete all in parallel
    await Promise.all(ids.flatMap(id => [
      (supabase as any).from("ticket_messages").delete().eq("ticket_id", id),
      (supabase as any).from("tickets").delete().eq("id", id),
    ]));
  };

  const exportCSV = () => {
    const headers = ["ID", "Email", "Type", "Status", "Created", "Messages"];
    const rows = filtered.map(t => [t.id, t.email, t.type, t.status, t.createdAt, t.messages.length]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "tickets.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const statusOrder = ["open", "reviewing", "verified", "ready", "closed"];

  const filtered = tickets
    .filter(t => {
      if (filter !== "all" && t.status !== filter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return t.id.toLowerCase().includes(q) || t.email.toLowerCase().includes(q) ||
          Object.values(t.specs).some(v => v.toLowerCase().includes(q));
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === "needs-reply") {
        const aNeedsReply = a.messages[a.messages.length - 1]?.sender === "user" ? 0 : 1;
        const bNeedsReply = b.messages[b.messages.length - 1]?.sender === "user" ? 0 : 1;
        return aNeedsReply - bNeedsReply || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === "status") return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
      return 0;
    });

  if (selectedTicket) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => setSelectedTicket(null)} className="gap-1 text-xs">
            <X className="h-3 w-3" /> Back
          </Button>
          <div className="flex gap-2">
            <Select value={selectedTicket.status} onValueChange={v => handleStatusChange(selectedTicket.id, v)}>
              <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button size="sm" variant="destructive" onClick={() => handleDeleteTicket(selectedTicket.id)} className="h-8 text-xs gap-1">
              <Trash2 className="h-3 w-3" /> Delete
            </Button>
          </div>
        </div>

        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-sm tracking-wider">TICKET #{selectedTicket.id}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs rounded-lg bg-secondary/30 p-3">
              <div><span className="text-muted-foreground">Email:</span> <span className="font-medium">{selectedTicket.email}</span></div>
              <div><span className="text-muted-foreground">Type:</span> <span className="font-medium">{selectedTicket.type}</span></div>
              {Object.entries(selectedTicket.specs)
                .filter(([k]) => k !== "Payment Screenshot")
                .map(([k, v]) => (
                  <div key={k}><span className="text-muted-foreground">{k}:</span> <span className="font-medium">{v}</span></div>
                ))}
            </div>

            {selectedTicket.specs["Payment Screenshot"] && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">Payment Screenshot:</p>
                <img src={selectedTicket.specs["Payment Screenshot"]} alt="Payment" className="max-w-xs rounded-lg border border-border/30" />
              </div>
            )}

            {/* Chat - expanded */}
            <div className="border border-border/20 rounded-lg overflow-hidden flex flex-col" style={{ height: "calc(100vh - 420px)", minHeight: "400px" }}>
              <div className="px-3 py-2 border-b border-border/15 flex items-center gap-2 bg-secondary/20 shrink-0">
                <MessageCircle className="h-3 w-3 text-primary" />
                <span className="text-[11px] font-semibold">Live Chat</span>
              </div>
              <div className="overflow-y-auto px-3 py-2 space-y-2 flex-1">
                {selectedTicket.messages.map(m => (
                  <div key={m.id} className={`flex ${m.sender === "admin" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] rounded-lg px-3 py-1.5 text-xs ${
                      m.sender === "admin"
                        ? "bg-primary/10 border border-primary/20"
                        : "bg-secondary/50 border border-border/20"
                    }`}>
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className={`text-[9px] font-semibold ${m.sender === "admin" ? "text-primary" : "text-muted-foreground"}`}>
                          {m.sender === "admin" ? "Admin" : "User"}
                        </span>
                        <span className="text-[9px] text-muted-foreground/50">
                          {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap">{m.text}</p>
                      {m.imageUrl && <img src={m.imageUrl} alt="" className="mt-1 max-w-[200px] rounded border border-border/30" />}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <div className="px-3 py-2 border-t border-border/15 flex gap-2 shrink-0">
                <Input
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleReply()}
                  placeholder="Reply..."
                  className="text-xs h-8 bg-secondary/30 border-border/20"
                />
                <Button size="icon" onClick={handleReply} disabled={!replyText.trim()} className="h-8 w-8 shrink-0">
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap items-center">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input placeholder="Search tickets..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="bg-secondary/50 border-border text-xs h-8 pl-7" />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {STATUS_OPTIONS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={v => setSortBy(v as any)}>
          <SelectTrigger className="w-36 h-8 text-xs gap-1">
            <ArrowUpDown className="h-3 w-3" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="needs-reply">Needs Reply</SelectItem>
            <SelectItem value="status">By Status</SelectItem>
          </SelectContent>
        </Select>
        <Button size="sm" variant="outline" onClick={handleRefresh} disabled={refreshing} className="h-8 text-xs gap-1.5">
          <RefreshCw className={`h-3 w-3 ${refreshing ? "animate-spin" : ""}`} /> Refresh
        </Button>
        <Button size="sm" variant="outline" onClick={exportCSV} className="h-8 text-xs gap-1.5">
          <Download className="h-3 w-3" /> Export
        </Button>
        <span className="text-[10px] text-muted-foreground ml-auto">{filtered.length} ticket{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {selected.size > 0 && (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/10">
          <span className="text-xs font-medium">{selected.size} selected</span>
          <Button size="sm" variant="outline" onClick={handleBulkClose} className="h-7 text-[10px] gap-1">Close All</Button>
          <Button size="sm" variant="destructive" onClick={handleBulkDelete} className="h-7 text-[10px] gap-1"><Trash2 className="h-3 w-3" /> Delete All</Button>
          <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())} className="h-7 text-[10px]">Clear</Button>
        </div>
      )}

      {loading ? (
        <p className="text-xs text-muted-foreground py-8 text-center">Loading tickets...</p>
      ) : filtered.length === 0 ? (
        <p className="text-xs text-muted-foreground py-8 text-center">No tickets found</p>
      ) : (
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-0">
            <div className="px-4 py-2 border-b border-border/20 flex items-center gap-2">
              <Checkbox checked={selected.size === filtered.length && filtered.length > 0} onCheckedChange={toggleSelectAll} />
              <span className="text-[10px] text-muted-foreground">Select all</span>
            </div>
            <div className="divide-y divide-border/20">
              {filtered.map(t => {
                const statusOpt = STATUS_OPTIONS.find(s => s.value === t.status) || STATUS_OPTIONS[0];
                const lastMsg = t.messages[t.messages.length - 1];
                const needsReply = lastMsg?.sender === "user";
                return (
                  <div key={t.id} className="flex items-center justify-between px-4 py-3 hover:bg-secondary/20 transition-colors">
                    <div className="flex items-center gap-2 shrink-0">
                      <Checkbox checked={selected.has(t.id)} onCheckedChange={() => toggleSelect(t.id)} />
                    </div>
                    <div className="flex-1 min-w-0 cursor-pointer ml-2" onClick={() => setSelectedTicket(t)}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs text-muted-foreground">#{t.id}</span>
                        <Badge className={`text-[10px] ${statusOpt.color}`}>{statusOpt.label}</Badge>
                        <Badge variant="outline" className="text-[10px]">{t.type}</Badge>
                        {needsReply && <Badge className="text-[10px] bg-red-500/15 text-red-400">Needs Reply</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{t.email} • {t.specs.Plan || t.specs.Type || "Order"} • {t.specs.Price || t.specs.Total}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <span className="text-[10px] text-muted-foreground">{t.messages.length} msgs</span>
                      <Button size="icon" variant="ghost" onClick={() => setSelectedTicket(t)} className="h-7 w-7">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteTicket(t.id)}
                        className="h-7 w-7 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminTickets;
