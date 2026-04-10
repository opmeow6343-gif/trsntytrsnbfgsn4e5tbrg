import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Mail, Calendar, ExternalLink, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { toast } from "@/hooks/use-toast";
import AnimatedBackground from "@/components/AnimatedBackground";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ email: string; created_at: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth"); return; }
      setUser({ email: session.user.email || "", created_at: session.user.created_at });
      setLoading(false);
    };
    init();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({ title: "Signed out" });
    navigate("/");
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground text-sm">Loading...</div>;

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      <SEOHead title="Profile — ZeyronCloud" description="Your ZeyronCloud account profile." path="/profile" />
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
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
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
