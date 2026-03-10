import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, MessageSquare, Newspaper, ShoppingCart, AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Notification {
  id: string;
  type: "ticket" | "news" | "order" | "info" | "warning" | "success" | "alert";
  title: string;
  message?: string;
  time: string;
  read: boolean;
}

const typeIcons: Record<string, any> = {
  ticket: MessageSquare,
  news: Newspaper,
  order: ShoppingCart,
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle2,
  alert: Bell,
};

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  const load = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const notifs: Notification[] = [];

    // Fetch admin alerts (visible to everyone)
    const { data: alerts } = await (supabase as any)
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    alerts?.forEach((a: any) =>
      notifs.push({
        id: `alert-${a.id}`, type: a.type || "info",
        title: a.title, message: a.message,
        time: a.created_at, read: false,
      })
    );

    // Fetch news
    const { data: news } = await supabase
      .from("news_items")
      .select("id, title, created_at")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(3);

    news?.forEach((n) =>
      notifs.push({ id: `news-${n.id}`, type: "news", title: n.title, time: n.created_at, read: false })
    );

    if (session) {
      const { data: tickets } = await supabase
        .from("tickets")
        .select("id, type, created_at")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(3);

      tickets?.forEach((t) =>
        notifs.push({ id: `ticket-${t.id}`, type: "ticket", title: `Order: ${t.type}`, time: t.created_at, read: false })
      );
    }

    notifs.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    setNotifications(notifs.slice(0, 10));
  };

  useEffect(() => { load(); }, [open]);

  // Realtime for new admin alerts
  useEffect(() => {
    const channel = supabase
      .channel("notifications-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, () => {
        load();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const unread = notifications.filter((n) => !n.read).length;
  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const timeAgo = (t: string) => {
    const diff = Date.now() - new Date(t).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <motion.button
          className="relative h-8 w-8 rounded-full bg-secondary/50 border border-border/30 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Bell className="h-3.5 w-3.5" />
          {unread > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 bg-primary text-primary-foreground rounded-full text-[8px] font-bold flex items-center justify-center"
            >
              {unread}
            </motion.span>
          )}
        </motion.button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 glass-strong border-border/20">
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-border/15">
          <span className="text-xs font-semibold text-foreground">Notifications</span>
          {unread > 0 && (
            <button onClick={markAllRead} className="text-[10px] text-primary hover:underline">
              Mark all read
            </button>
          )}
        </div>
        <div className="max-h-72 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-muted-foreground">No notifications yet</div>
          ) : (
            notifications.map((n, i) => {
              const Icon = typeIcons[n.type] || Bell;
              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`flex items-start gap-2.5 px-3 py-2.5 border-b border-border/10 hover:bg-secondary/30 transition-colors ${!n.read ? "bg-primary/5" : ""}`}
                >
                  <div className={`mt-0.5 shrink-0 h-6 w-6 rounded-md flex items-center justify-center ${
                    n.type === "alert" || n.type === "warning" ? "bg-red-500/10" : "bg-primary/10"
                  }`}>
                    <Icon className={`h-3 w-3 ${n.type === "alert" || n.type === "warning" ? "text-red-400" : "text-primary"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium text-foreground truncate">{n.title}</p>
                    {n.message && <p className="text-[10px] text-muted-foreground truncate">{n.message}</p>}
                    <p className="text-[10px] text-muted-foreground/60">{timeAgo(n.time)}</p>
                  </div>
                  {!n.read && <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />}
                </motion.div>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
