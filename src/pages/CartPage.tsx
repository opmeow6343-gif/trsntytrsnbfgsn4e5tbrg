import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import {
  ShoppingCart, Package, Clock, CheckCircle2, ArrowRight, Copy,
  Server, Search, MessageCircle, Send, ArrowLeft, X, Image as ImageIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { addMessage } from "@/lib/storage";
import type { TicketMessage } from "@/lib/storage";

interface Order {
  id: string;
  type: string;
  status: string;
  specs: Record<string, string>;
  createdAt: string;
  messages: TicketMessage[];
}

const ORDER_STEPS = [
  { key: "open", label: "Submitted", icon: Clock },
  { key: "reviewing", label: "Reviewing", icon: Search },
  { key: "verified", label: "Verified", icon: CheckCircle2 },
  { key: "ready", label: "Ready", icon: Server },
];

const getStepIndex = (status: string) => {
  if (status === "closed" || status === "ready") return 3;
  if (status === "verified") return 2;
  if (status === "reviewing") return 1;
  return 0;
};

const CartPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [chatMsg, setChatMsg] = useState("");
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) loadOrders(data.session.user.id);
      else setLoading(false);
    });
  }, []);

  const loadOrders = async (userId: string) => {
    setLoading(true);
    const { data: tickets } = await (supabase as any)
      .from("tickets")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!tickets || tickets.length === 0) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const ids = tickets.map((t: any) => t.id);
    const { data: msgs } = await (supabase as any)
      .from("ticket_messages")
      .select("*")
      .in("ticket_id", ids)
      .order("created_at");

    const byTicket: Record<string, TicketMessage[]> = {};
    (msgs || []).forEach((m: any) => {
      if (!byTicket[m.ticket_id]) byTicket[m.ticket_id] = [];
      byTicket[m.ticket_id].push({
        id: m.id, sender: m.sender, text: m.text,
        imageUrl: m.image_url || undefined, timestamp: m.created_at,
        isTriggered: m.is_triggered || false,
      });
    });

    const mapped = tickets.map((t: any) => ({
      id: t.id, type: t.type, status: t.status,
      specs: t.specs as Record<string, string>,
      createdAt: t.created_at,
      messages: byTicket[t.id] || [],
    }));

    setOrders(mapped);
    setLoading(false);
  };

  // Realtime: listen for new messages on selected order
  useEffect(() => {
    if (!selectedOrder) return;
    const channel = supabase
      .channel(`chat-${selectedOrder.id}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "ticket_messages",
        filter: `ticket_id=eq.${selectedOrder.id}`,
      }, (payload: any) => {
        const m = payload.new;
        const newMsg: TicketMessage = {
          id: m.id, sender: m.sender, text: m.text,
          imageUrl: m.image_url || undefined, timestamp: m.created_at,
          isTriggered: m.is_triggered || false,
        };
        setSelectedOrder(prev => prev ? { ...prev, messages: [...prev.messages, newMsg] } : prev);
        setOrders(prev => prev.map(o =>
          o.id === selectedOrder.id ? { ...o, messages: [...o.messages, newMsg] } : o
        ));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [selectedOrder?.id]);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedOrder?.messages.length]);

  const handleSendChat = async () => {
    if (!selectedOrder || !chatMsg.trim() || sending) return;
    setSending(true);
    try {
      await addMessage(selectedOrder.id, "user", chatMsg.trim());
      setChatMsg("");
    } catch (err: any) {
      toast({ title: "Error", description: "Failed to send message", variant: "destructive" });
    }
    setSending(false);
  };

  const copyId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast({ title: "Copied!", description: `Order ID: ${id}` });
  };

  // Chat view for selected order
  if (selectedOrder) {
    const stepIdx = getStepIndex(selectedOrder.status);
    return (
      <div className="min-h-screen bg-background animated-bg">
        <AnimatedBackground />
        <Navbar />
        <main className="pt-24 pb-16 relative z-10">
          <div className="container mx-auto px-4 max-w-2xl">
            <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)} className="gap-1 text-xs mb-4">
              <ArrowLeft className="h-3 w-3" /> Back to Orders
            </Button>

            {/* Order header */}
            <div className="rounded-xl glass gradient-border p-4 mb-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={() => copyId(selectedOrder.id)} className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                    #{selectedOrder.id} <Copy className="h-2.5 w-2.5" />
                  </button>
                  <Badge className="bg-primary/15 text-primary text-[10px]">{selectedOrder.type.toUpperCase()}</Badge>
                </div>
                <Badge className={`text-[10px] ${
                  selectedOrder.status === "ready" ? "bg-green-500/15 text-green-400" :
                  selectedOrder.status === "verified" ? "bg-blue-500/15 text-blue-400" :
                  selectedOrder.status === "reviewing" ? "bg-yellow-500/15 text-yellow-400" :
                  selectedOrder.status === "closed" ? "bg-muted/30 text-muted-foreground" :
                  "bg-orange-500/15 text-orange-400"
                }`}>{selectedOrder.status.toUpperCase()}</Badge>
              </div>

              {/* Progress */}
              <div className="flex items-center gap-1">
                {ORDER_STEPS.map((s, idx) => {
                  const StepIcon = s.icon;
                  const active = idx <= stepIdx;
                  return (
                    <div key={s.key} className="flex items-center flex-1">
                      <div className={`flex flex-col items-center flex-1 ${active ? "text-primary" : "text-muted-foreground/30"}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all ${
                          active ? "bg-primary/15 border border-primary/40" : "bg-muted/10 border border-border/20"
                        }`}>
                          <StepIcon className="h-2.5 w-2.5" />
                        </div>
                        <span className="text-[7px] mt-0.5 text-center leading-tight">{s.label}</span>
                      </div>
                      {idx < ORDER_STEPS.length - 1 && (
                        <div className={`h-0.5 flex-1 rounded-full mx-0.5 mb-3 ${idx < stepIdx ? "bg-primary/40" : "bg-border/20"}`} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Specs compact */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px]">
                {Object.entries(selectedOrder.specs)
                  .filter(([k]) => !["Payment Screenshot", "Currency", "Payment Method"].includes(k))
                  .slice(0, 6)
                  .map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-muted-foreground">{k}:</span>
                      <span className="text-foreground font-medium">{v}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Chat */}
            <div className="rounded-xl glass gradient-border overflow-hidden flex flex-col" style={{ height: "400px" }}>
              <div className="px-4 py-2.5 border-b border-border/15 flex items-center gap-2">
                <MessageCircle className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold">Live Chat with Support</span>
                <span className="text-[10px] text-muted-foreground ml-auto">{selectedOrder.messages.length} messages</span>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
                {selectedOrder.messages.length === 0 ? (
                  <div className="text-center py-8 text-xs text-muted-foreground">
                    No messages yet. Send a message to start chatting with support.
                  </div>
                ) : (
                  selectedOrder.messages.map(m => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[75%] rounded-xl px-3 py-2 text-xs ${
                        m.sender === "user"
                          ? "bg-primary/15 border border-primary/20 text-foreground"
                          : "bg-secondary/60 border border-border/20 text-foreground"
                      }`}>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className={`text-[9px] font-semibold ${m.sender === "admin" ? "text-primary" : "text-muted-foreground"}`}>
                            {m.sender === "admin" ? "Support" : "You"}
                          </span>
                          <span className="text-[9px] text-muted-foreground/50">
                            {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <p className="whitespace-pre-wrap break-words">{m.text}</p>
                        {m.imageUrl && (
                          <img src={m.imageUrl} alt="" className="mt-1.5 max-w-full rounded-lg border border-border/20" />
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat input */}
              {selectedOrder.status !== "closed" && (
                <div className="px-3 py-2.5 border-t border-border/15 flex gap-2">
                  <Input
                    value={chatMsg}
                    onChange={e => setChatMsg(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSendChat()}
                    placeholder="Type a message..."
                    className="text-xs h-8 bg-secondary/30 border-border/20"
                  />
                  <Button size="icon" onClick={handleSendChat} disabled={!chatMsg.trim() || sending} className="h-8 w-8 shrink-0 glow-primary">
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background animated-bg">
      <AnimatedBackground />
      <Navbar />
      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="font-display text-3xl font-black tracking-tight">
              MY <span className="text-primary text-glow">ORDERS</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Track orders, chat with support, and manage your tickets.</p>
          </motion.div>

          {loading ? (
            <div className="text-center py-20 text-muted-foreground text-sm">Loading…</div>
          ) : !session ? (
            <div className="text-center py-20">
              <div className="rounded-full bg-secondary/50 w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-9 w-9 opacity-30" />
              </div>
              <p className="text-base font-semibold mb-2">Log in to view your orders</p>
              <p className="text-sm text-muted-foreground mb-6">You need to be signed in to see your order history.</p>
              <Button onClick={() => navigate("/auth")} className="glow-primary gap-2">
                Log In <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20">
              <div className="rounded-full bg-secondary/50 w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Package className="h-9 w-9 opacity-30" />
              </div>
              <p className="text-base font-semibold mb-2">No orders yet</p>
              <p className="text-sm text-muted-foreground mb-6">Browse our plans and place your first order!</p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => navigate("/minecraft-plans")} className="glow-primary gap-2" size="sm">
                  Minecraft Plans <ArrowRight className="h-3 w-3" />
                </Button>
                <Button onClick={() => navigate("/bot-plans")} variant="outline" size="sm" className="gap-2 border-primary/30">
                  Bot Plans <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order, i) => {
                const stepIdx = getStepIndex(order.status);
                const lastMsg = order.messages[order.messages.length - 1];
                const hasAdminReply = lastMsg?.sender === "admin";
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => setSelectedOrder(order)}
                    className="rounded-xl glass gradient-border p-4 space-y-3 cursor-pointer hover:bg-secondary/10 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground">#{order.id}</span>
                        <Badge className="bg-primary/15 text-primary text-[10px]">{order.type.toUpperCase()}</Badge>
                        {order.specs.Currency && (
                          <Badge className="bg-muted/30 text-muted-foreground text-[10px]">
                            {order.specs.Currency === "PKR" ? "🇵🇰" : "🇮🇳"} {order.specs.Currency}
                          </Badge>
                        )}
                        {hasAdminReply && (
                          <Badge className="bg-green-500/15 text-green-400 text-[10px]">New Reply</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground">{order.messages.length} msgs</span>
                        <MessageCircle className="h-3 w-3 text-primary" />
                      </div>
                    </div>

                    {/* Compact progress */}
                    <div className="flex items-center gap-1">
                      {ORDER_STEPS.map((s, idx) => {
                        const active = idx <= stepIdx;
                        return (
                          <div key={s.key} className="flex items-center flex-1">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                              active ? "bg-primary/15 border border-primary/40" : "bg-muted/10 border border-border/20"
                            }`}>
                              <s.icon className={`h-2.5 w-2.5 ${active ? "text-primary" : "text-muted-foreground/30"}`} />
                            </div>
                            {idx < ORDER_STEPS.length - 1 && (
                              <div className={`h-0.5 flex-1 rounded-full mx-0.5 ${idx < stepIdx ? "bg-primary/40" : "bg-border/20"}`} />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-muted-foreground">
                        {order.specs.Plan || order.specs.Type || "Order"} • {order.specs.Price || order.specs.Total}
                      </span>
                      <span className="text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;
