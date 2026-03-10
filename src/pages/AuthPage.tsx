import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Lock, ArrowLeft, Mail, UserPlus, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const AuthPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/");
      setChecking(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate("/");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields"); return; }
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authError) { setError(authError.message); } else { toast({ title: "Welcome back!" }); }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password || !confirmPassword) { setError("Please fill in all fields"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (password !== confirmPassword) { setError("Passwords do not match"); return; }
    setLoading(true);
    const { error: authError } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (authError) { setError(authError.message); } else { toast({ title: "Account created!", description: "Check your email to verify your account." }); }
  };

  if (checking) return null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="mb-6">
          <Link to="/"><Button variant="ghost" size="sm" className="gap-2 text-muted-foreground"><ArrowLeft className="h-4 w-4" /> Back to Home</Button></Link>
        </div>
        <div className="flex gap-1 mb-6 p-1 rounded-xl bg-secondary/50">
          {(["login", "signup"] as const).map((m) => (
            <button key={m} onClick={() => { setMode(m); setError(""); setForgotSuccess(false); }} className={`flex-1 py-2 rounded-lg text-[11px] font-display tracking-wider transition-all ${mode === m || (mode === "forgot" && m === "login") ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {m === "login" ? "LOGIN" : "SIGN UP"}
            </button>
          ))}
        </div>

        {mode === "forgot" ? (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex rounded-full bg-primary/10 p-4 mb-4 glow-blue"><Mail className="h-8 w-8 text-primary" /></div>
              <h1 className="font-display text-2xl font-bold tracking-wider">RESET <span className="text-primary">PASSWORD</span></h1>
              <p className="text-xs text-muted-foreground mt-2">Enter your email to receive a password reset link</p>
            </div>
            {forgotSuccess ? (
              <div className="text-center space-y-4">
                <p className="text-sm text-primary">✓ Reset link sent! Check your email inbox.</p>
                <Button variant="outline" onClick={() => { setMode("login"); setForgotSuccess(false); }} className="text-xs">Back to Login</Button>
              </div>
            ) : (
              <form onSubmit={async (e) => {
                e.preventDefault();
                setError("");
                if (!email) { setError("Please enter your email"); return; }
                setLoading(true);
                const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + "/reset-password" });
                setLoading(false);
                if (resetError) { setError(resetError.message); } else { setForgotSuccess(true); }
              }} className="space-y-4">
                <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input type="email" placeholder="Email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }} className="bg-card border-border pl-10" /></div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" disabled={loading} className="w-full glow-blue font-display text-xs tracking-wider">{loading ? "SENDING..." : "SEND RESET LINK"}</Button>
                <p className="text-center text-xs text-muted-foreground"><button type="button" onClick={() => { setMode("login"); setError(""); }} className="text-primary hover:underline">Back to login</button></p>
              </form>
            )}
          </>
        ) : mode === "login" ? (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex rounded-full bg-primary/10 p-4 mb-4 glow-blue"><LogIn className="h-8 w-8 text-primary" /></div>
              <h1 className="font-display text-2xl font-bold tracking-wider">SIGN <span className="text-primary">IN</span></h1>
              <p className="text-xs text-muted-foreground mt-2">Sign in to your ZeyronCloud account</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input type="email" placeholder="Email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }} className="bg-card border-border pl-10" /></div>
              <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input type="password" placeholder="Password" value={password} onChange={e => { setPassword(e.target.value); setError(""); }} className="bg-card border-border pl-10" /></div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" disabled={loading} className="w-full glow-blue font-display text-xs tracking-wider">{loading ? "SIGNING IN..." : "SIGN IN"}</Button>
              <div className="flex justify-between text-xs text-muted-foreground">
                <button type="button" onClick={() => { setMode("forgot"); setError(""); }} className="text-primary hover:underline">Forgot password?</button>
                <button type="button" onClick={() => { setMode("signup"); setError(""); }} className="text-primary hover:underline">Create account</button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex rounded-full bg-primary/10 p-4 mb-4 glow-blue"><UserPlus className="h-8 w-8 text-primary" /></div>
              <h1 className="font-display text-2xl font-bold tracking-wider">CREATE <span className="text-primary">ACCOUNT</span></h1>
              <p className="text-xs text-muted-foreground mt-2">Create your ZeyronCloud account</p>
            </div>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input type="email" placeholder="Email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }} className="bg-card border-border pl-10" /></div>
              <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input type="password" placeholder="Password (min 6 chars)" value={password} onChange={e => { setPassword(e.target.value); setError(""); }} className="bg-card border-border pl-10" /></div>
              <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => { setConfirmPassword(e.target.value); setError(""); }} className="bg-card border-border pl-10" /></div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" disabled={loading} className="w-full glow-blue font-display text-xs tracking-wider">{loading ? "CREATING..." : "CREATE ACCOUNT"}</Button>
              <p className="text-center text-xs text-muted-foreground">Already have an account? <button type="button" onClick={() => { setMode("login"); setError(""); }} className="text-primary hover:underline">Sign in</button></p>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default AuthPage;
