import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const FloatingOrdersButton = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setVisible(!!session);
    };
    check();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setVisible(!!session));
    return () => subscription.unsubscribe();
  }, []);

  // Hide on profile page, admin pages
  const hidden = !visible || location.pathname === "/profile" || location.pathname.startsWith("/admin");

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/profile")}
          className="fixed right-4 top-1/2 -translate-y-1/2 z-40 h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center hover:bg-primary/90 transition-colors"
          title="My Orders"
        >
          <ShoppingBag className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default FloatingOrdersButton;
