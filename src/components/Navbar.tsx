import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Menu, X, ExternalLink, User, LogOut, FileText, Monitor, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import logo from "@/assets/zeyroncloud-logo.png";
import { supabase } from "@/integrations/supabase/client";
import NotificationCenter from "@/components/NotificationCenter";
import ThemeToggle from "@/components/ThemeToggle";
import CursorToggle from "@/components/CursorToggle";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Minecraft", to: "/minecraft-plans" },
  { label: "VPS", to: "/vps-plans" },
  { label: "Bot Hosting", to: "/bot-plans" },
  { label: "Boosters", to: "/booster-plans" },
  { label: "Free Server", to: "/free-server" },
  { label: "Tools", to: "/tools" },
  { label: "News", to: "/news" },
  { label: "FAQ", to: "/faq" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cursorEnabled, setCursorEnabled] = useState(() => localStorage.getItem("zeyron-custom-cursor") !== "false");
  const location = useLocation();
  const navigate = useNavigate();

  const toggleCursor = () => {
    const next = !cursorEnabled;
    setCursorEnabled(next);
    localStorage.setItem("zeyron-custom-cursor", String(next));
    window.dispatchEvent(new CustomEvent("cursor-toggle", { detail: next }));
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const checkAdmin = async (userId: string) => {
      const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
      setIsAdmin(!!data);
    };
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserEmail(session?.user?.email || null);
      if (session?.user?.id) checkAdmin(session.user.id);
      else setIsAdmin(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserEmail(session?.user?.email || null);
      if (session?.user?.id) checkAdmin(session.user.id);
      else setIsAdmin(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => { await supabase.auth.signOut(); navigate("/"); };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "glass-strong shadow-lg shadow-black/30" : "bg-transparent"}`}
    >
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <motion.img
            src={logo}
            alt="ZeyronCloud"
            className="h-7 w-7 rounded-lg"
            whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.4 }}
          />
          <span className="font-bold text-base tracking-tight font-display">
            Zeyron<span className="gradient-text">Cloud</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-0.5">
          {navLinks.map((link, i) => {
            const active = location.pathname === link.to;
            return (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.06, duration: 0.5 }}
              >
                <Link to={link.to} className={`relative px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${active ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                  {link.label}
                  {active && (
                    <motion.div layoutId="nav-active" className="absolute inset-0 rounded-lg bg-primary/8 border border-primary/10 -z-10" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="hidden lg:flex items-center gap-2.5 shrink-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <ThemeToggle />
          <NotificationCenter />
          <a href="https://discord.gg/zeyron" target="_blank" rel="noopener noreferrer">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground hover:text-foreground h-8">
                <ExternalLink className="h-3 w-3" /> Discord
              </Button>
            </motion.div>
          </a>
          {userEmail ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button
                  className="h-8 w-8 rounded-full bg-primary/10 border border-primary/15 text-primary text-xs font-bold flex items-center justify-center hover:bg-primary/20 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {userEmail[0].toUpperCase()}
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 glass-strong border-border/20">
                <div className="px-3 py-2 text-[10px] text-muted-foreground truncate">{userEmail}</div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer gap-2 text-xs">
                  <User className="h-3 w-3" /> My Orders
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.open("https://gp.zeyroncloud.com", "_blank")} className="cursor-pointer gap-2 text-xs">
                  <Monitor className="h-3 w-3" /> Visit Panel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/tos")} className="cursor-pointer gap-2 text-xs">
                  <FileText className="h-3 w-3" /> Terms of Service
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem onClick={() => navigate("/admin/settings")} className="cursor-pointer gap-2 text-xs">
                    <Shield className="h-3 w-3" /> Admin Panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer gap-2 text-xs text-destructive">
                  <LogOut className="h-3 w-3" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="sm" className="glow-primary text-xs h-8 gap-1.5 font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
                  <User className="h-3 w-3" /> Sign In
                </Button>
              </motion.div>
            </Link>
          )}
        </motion.div>

        <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9" onClick={() => setOpen(!open)}>
          <AnimatePresence mode="wait">
            {open ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <X className="h-4 w-4" />
              </motion.div>
            ) : (
              <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Menu className="h-4 w-4" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="lg:hidden overflow-hidden glass-strong border-t border-border/15"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <Link to={link.to} onClick={() => setOpen(false)} className={`block px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors ${location.pathname === link.to ? "bg-primary/8 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`}>
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                className="flex gap-2.5 pt-3 mt-2 border-t border-border/15"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <a href="https://discord.gg/zeyron" target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs rounded-lg"><ExternalLink className="h-3 w-3" /> Discord</Button>
                </a>
                {userEmail ? (
                  <Button onClick={() => { handleSignOut(); setOpen(false); }} variant="outline" size="sm" className="flex-1 text-xs gap-1.5 text-destructive rounded-lg">
                    <LogOut className="h-3 w-3" /> Sign Out
                  </Button>
                ) : (
                  <Link to="/auth" className="flex-1" onClick={() => setOpen(false)}>
                    <Button size="sm" className="w-full glow-primary text-xs gap-1.5 rounded-lg bg-primary text-primary-foreground"><User className="h-3 w-3" /> Sign In</Button>
                  </Link>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
