import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, ArrowLeft, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin } from "@/lib/storage";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const isAdmin = await checkIsAdmin();
        if (isAdmin) { navigate("/admin/settings"); return; }
      }
      setChecking(false);
    };
    check();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (currentSession) {
        const isAdmin = await checkIsAdmin();
        if (isAdmin) { navigate("/admin/settings"); return; }
        await supabase.auth.signOut();
      }
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) { setError(authError.message); setLoading(false); return; }
      const isAdmin = await checkIsAdmin();
      if (isAdmin) {
        navigate("/admin/settings");
      } else {
        setError("You don't have admin access.");
      }
    } catch {
      setError("Login failed");
    }
    setLoading(false);
  };

  if (checking) return null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="mb-6">
          <Link to="/"><Button variant="ghost" size="sm" className="gap-2 text-muted-foreground"><ArrowLeft className="h-4 w-4" /> Back to Home</Button></Link>
        </div>
        <div className="text-center mb-8">
          <div className="inline-flex rounded-full bg-primary/10 p-4 mb-4 glow-blue"><Lock className="h-8 w-8 text-primary" /></div>
          <h1 className="font-display text-2xl font-bold tracking-wider">ADMIN <span className="text-primary">LOGIN</span></h1>
          <p className="text-xs text-muted-foreground mt-2">Sign in with your admin account</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="email" placeholder="Admin Email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} className="bg-card border-border pl-10" />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} className="bg-card border-border pl-10" />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full glow-blue font-display text-xs tracking-wider">
            {loading ? "SIGNING IN..." : "LOGIN"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
