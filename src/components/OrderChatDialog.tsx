import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { addMessage } from "@/lib/storage";
import { Send, Loader2, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";

interface Message {
  id: string;
  sender: string;
  text: string;
  image_url?: string | null;
  created_at: string;
}

interface OrderChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticketId: string;
  ticketType: string;
  ticketStatus: string;
}

const OrderChatDialog = ({ open, onOpenChange, ticketId, ticketType, ticketStatus }: OrderChatDialogProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !ticketId) return;
    setLoading(true);

    const fetchMessages = async () => {
      const { data } = await (supabase as any)
        .from("ticket_messages")
        .select("*")
        .eq("ticket_id", ticketId)
        .order("created_at", { ascending: true });
      setMessages(data || []);
      setLoading(false);
    };

    fetchMessages();

    const channel = supabase
      .channel(`chat-${ticketId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "ticket_messages",
        filter: `ticket_id=eq.${ticketId}`,
      }, (payload: any) => {
        setMessages(prev => {
          if (prev.find(m => m.id === payload.new.id)) return prev;
          return [...prev, payload.new];
        });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [open, ticketId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;
    setSending(true);
    try {
      await addMessage(ticketId, "user", newMessage.trim());
      setNewMessage("");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong border-border/15 max-w-4xl w-[95vw] rounded-xl p-0 overflow-hidden h-[90vh] flex flex-col">
        <DialogHeader className="p-4 border-b border-border/15 shrink-0">
          <DialogTitle className="font-display text-sm tracking-wider flex items-center gap-2">
            Order #{ticketId.slice(0, 8)}
            <Badge variant="outline" className="text-[10px]">{ticketType}</Badge>
            <Badge className={`text-[10px] ${ticketStatus === "open" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>{ticketStatus}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : messages.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-8">No messages yet. Start a conversation!</p>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[80%] rounded-xl px-3 py-2 text-xs ${
                    msg.sender === "user"
                      ? "bg-primary/15 text-foreground border border-primary/20"
                      : "bg-muted/30 text-foreground border border-border/20"
                  }`}>
                    <p className="text-[10px] font-semibold mb-1 text-muted-foreground">
                      {msg.sender === "user" ? "You" : "Admin"}
                    </p>
                    <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                    {msg.image_url && (
                      <a href={msg.image_url} target="_blank" rel="noopener noreferrer" className="mt-2 block">
                        <img src={msg.image_url} alt="attachment" className="max-h-32 rounded-lg object-contain" />
                      </a>
                    )}
                    <p className="text-[9px] text-muted-foreground mt-1">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          <div ref={bottomRef} />
        </div>

        {ticketStatus === "open" && (
          <div className="p-3 border-t border-border/15 shrink-0 flex gap-2">
            <Input
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="text-xs h-9 flex-1"
            />
            <Button size="sm" onClick={handleSend} disabled={!newMessage.trim() || sending} className="h-9 px-3 glow-primary">
              {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OrderChatDialog;
