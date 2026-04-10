import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Lock, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import AnimatedBackground from "@/components/AnimatedBackground";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [validSession, setValidSession] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Listen for the PASSWORD_RECOVERY event from the URL token
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setValidSession(true);
      }
      setChecking(false);
    });

    // Also check if already in a session (user clicked link and was auto-logged in)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setValidSession(true);
      setChecking(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!password || !confirmPassword) { setError("Please fill in all fields"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (password !== confirmPassword) { setError("Passwords do not match"); return; }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess(true);
      toast({ title: "Password updated successfully!" });
      setTimeout(() => navigate("/"), 3000);
    }
  };

  if (checking) return null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative">
      <AnimatedBackground />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        {success ? (
          <div className="text-center space-y-4">
            <div className="inline-flex rounded-full bg-primary/10 p-4 mb-4">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-display text-2xl font-bold tracking-wider">PASSWORD <span className="text-primary">UPDATED</span></h1>
            <p className="text-xs text-muted-foreground">Your password has been reset. Redirecting...</p>
          </div>
        ) : !validSession ? (
          <div className="text-center space-y-4">
            <h1 className="font-display text-2xl font-bold tracking-wider">INVALID <span className="text-primary">LINK</span></h1>
            <p className="text-xs text-muted-foreground">This reset link is invalid or has expired.</p>
            <Button variant="outline" onClick={() => navigate("/auth")} className="text-xs">Back to Login</Button>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex rounded-full bg-primary/10 p-4 mb-4 glow-blue">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <h1 className="font-display text-2xl font-bold tracking-wider">NEW <span className="text-primary">PASSWORD</span></h1>
              <p className="text-xs text-muted-foreground mt-2">Enter your new password below</p>
            </div>
            <form onSubmit={handleReset} className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="password" placeholder="New password (min 6 chars)" value={password} onChange={e => { setPassword(e.target.value); setError(""); }} className="bg-card border-border pl-10" />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={e => { setConfirmPassword(e.target.value); setError(""); }} className="bg-card border-border pl-10" />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" disabled={loading} className="w-full glow-blue font-display text-xs tracking-wider">
                {loading ? "UPDATING..." : "UPDATE PASSWORD"}
              </Button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPassword;
