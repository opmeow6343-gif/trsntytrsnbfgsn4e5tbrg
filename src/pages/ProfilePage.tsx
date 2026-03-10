import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, LogOut, Mail, Calendar, Ticket, MessageCircle, ExternalLink, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import OrderChatDialog from "@/components/OrderChatDialog";
import { toast } from "@/hooks/use-toast";

interface TicketSummary {
  id: string;
  type: string;
  status: string;
  created_at: string;
  specs: Record<string, string>;
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ email: string; created_at: string } | null>(null);
  const [tickets, setTickets] = useState<TicketSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketSummary | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth"); return; }
      setUser({ email: session.user.email || "", created_at: session.user.created_at });

      const { data } = await (supabase as any)
        .from("tickets")
        .select("id, type, status, created_at, specs")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      setTickets((data || []) as TicketSummary[]);
      setLoading(false);
    };
    init();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({ title: "Signed out" });
    navigate("/");
  };

  const openChat = (ticket: TicketSummary) => {
    setSelectedTicket(ticket);
    setChatOpen(true);
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground text-sm">Loading...</div>;

  const open = tickets.filter(t => t.status === "open").length;
  const closed = tickets.filter(t => t.status === "closed").length;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Profile — ZeyronCloud" description="Your ZeyronCloud account profile and orders." path="/profile" />
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Account info */}
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle className="font-display text-sm tracking-wider">MY ACCOUNT</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/15 text-primary text-lg font-bold flex items-center justify-center">
                  {user?.email?.[0]?.toUpperCase() || "?"}
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    {user?.email}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <Calendar className="h-3 w-3" />
                    Joined {new Date(user?.created_at || "").toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-1.5 text-xs text-destructive hover:text-destructive">
                  <LogOut className="h-3 w-3" /> Sign Out
                </Button>
                <a href="https://gp.zeyroncloud.com" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                    <ExternalLink className="h-3 w-3" /> Visit Panel
                  </Button>
                </a>
                <Link to="/tos">
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                    <FileText className="h-3 w-3" /> Terms of Service
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Order stats */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-3 text-center">
                <p className="text-xl font-bold font-display">{tickets.length}</p>
                <p className="text-[10px] text-muted-foreground">Total Orders</p>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-3 text-center">
                <p className="text-xl font-bold font-display text-primary">{open}</p>
                <p className="text-[10px] text-muted-foreground">Active</p>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-3 text-center">
                <p className="text-xl font-bold font-display text-muted-foreground">{closed}</p>
                <p className="text-[10px] text-muted-foreground">Closed</p>
              </CardContent>
            </Card>
          </div>

          {/* Orders list */}
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle className="font-display text-sm tracking-wider flex items-center gap-2">
                <Ticket className="h-4 w-4 text-primary" /> MY ORDERS
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {tickets.length === 0 ? (
                <p className="text-xs text-muted-foreground py-8 text-center">No orders yet. <Link to="/minecraft-plans" className="text-primary hover:underline">Browse plans</Link></p>
              ) : (
                <div className="divide-y divide-border/20">
                  {tickets.map(t => (
                    <motion.div
                      key={t.id}
                      whileHover={{ backgroundColor: "hsl(var(--primary) / 0.03)" }}
                      onClick={() => openChat(t)}
                      className="px-4 py-3 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-mono text-[10px] text-muted-foreground">#{t.id.slice(0, 8)}</span>
                          <Badge variant="outline" className="text-[10px]">{t.type}</Badge>
                          <Badge className={`text-[10px] ${t.status === "open" ? "bg-primary/15 text-primary" : ""}`}>{t.status}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {(t.specs as Record<string, string>).Plan || (t.specs as Record<string, string>).Type || "Order"} • {new Date(t.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 text-primary">
                        <MessageCircle className="h-4 w-4" />
                        <span className="text-[10px] font-medium hidden sm:inline">Chat</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
      <Footer />

      {selectedTicket && (
        <OrderChatDialog
          open={chatOpen}
          onOpenChange={setChatOpen}
          ticketId={selectedTicket.id}
          ticketType={selectedTicket.type}
          ticketStatus={selectedTicket.status}
        />
      )}
    </div>
  );
};

export default ProfilePage;
