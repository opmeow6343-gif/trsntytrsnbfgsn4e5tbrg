import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllTickets } from "@/lib/storage";
import type { Ticket } from "@/lib/storage";
import { motion } from "framer-motion";
import { Ticket as TicketIcon, Clock, CheckCircle2, Eye, AlertTriangle, TrendingUp, MessageCircle } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 16, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] } },
};

const AdminDashboard = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllTickets().then(t => { setTickets(t); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const open = tickets.filter(t => t.status === "open").length;
  const reviewing = tickets.filter(t => (t.status as string) === "reviewing").length;
  const verified = tickets.filter(t => (t.status as string) === "verified").length;
  const closed = tickets.filter(t => t.status === "closed").length;
  const needsReply = tickets.filter(t => t.messages[t.messages.length - 1]?.sender === "user").length;
  const totalMessages = tickets.reduce((sum, t) => sum + t.messages.length, 0);

  const stats = [
    { label: "Total Tickets", value: tickets.length, icon: TicketIcon, color: "text-primary", bg: "bg-primary/10" },
    { label: "Open", value: open, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Reviewing", value: reviewing, icon: Eye, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Verified", value: verified, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Closed", value: closed, icon: CheckCircle2, color: "text-muted-foreground", bg: "bg-muted/50" },
    { label: "Needs Reply", value: needsReply, icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10" },
  ];

  const recent = [...tickets].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10);

  const revenue = tickets.reduce((sum, t) => {
    const price = t.specs.Price || t.specs.Total || "";
    const num = parseFloat(price.replace(/[^0-9.]/g, ""));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map(s => (
          <motion.div key={s.label} variants={item}>
            <Card className="border-border/50 bg-card/50 shadow-sm card-hover overflow-hidden relative group">
              <CardContent className="p-4 text-center relative z-10">
                <div className={`h-9 w-9 rounded-xl ${s.bg} flex items-center justify-center mx-auto mb-2`}>
                  <s.icon className={`h-4 w-4 ${s.color}`} />
                </div>
                <p className="text-2xl font-bold font-display">{s.value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
              </CardContent>
              <div className={`absolute inset-0 ${s.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Revenue + Messages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <motion.div variants={item}>
          <Card className="border-border/50 bg-card/50 shadow-sm card-hover">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display">₹{revenue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Estimated Revenue</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={item}>
          <Card className="border-border/50 bg-card/50 shadow-sm card-hover">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <MessageCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display">{totalMessages}</p>
                <p className="text-xs text-muted-foreground">Total Messages</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent tickets */}
      <motion.div variants={item}>
        <Card className="border-border/50 bg-card/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-sm tracking-wider">RECENT TICKETS</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/20">
              {recent.length === 0 ? (
                <p className="text-xs text-muted-foreground py-8 text-center">No tickets yet</p>
              ) : recent.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="px-4 py-3 flex items-center justify-between hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-[10px] text-muted-foreground">#{t.id.slice(0, 8)}</span>
                    <Badge variant="outline" className="text-[10px]">{t.type}</Badge>
                    <span className="text-xs truncate">{t.email}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge className="text-[10px]">{t.status}</Badge>
                    <span className="text-[10px] text-muted-foreground">{new Date(t.createdAt).toLocaleDateString()}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;
