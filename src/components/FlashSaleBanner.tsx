import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface FlashSale {
  id: string;
  title: string;
  description: string;
  discount_percent: number;
  end_time: string;
  active: boolean;
}

const FlashSaleBanner = () => {
  const [sale, setSale] = useState<FlashSale | null>(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const fetchSale = async () => {
      const { data } = await supabase
        .from("flash_sales")
        .select("*")
        .eq("active", true)
        .gt("end_time", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      if (data) setSale(data as FlashSale);
    };
    fetchSale();
  }, []);

  useEffect(() => {
    if (!sale) return;
    const update = () => {
      const diff = new Date(sale.end_time).getTime() - Date.now();
      if (diff <= 0) { setSale(null); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [sale]);

  if (!sale || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -60, opacity: 0 }}
        className="fixed top-14 left-0 right-0 z-40 bg-gradient-to-r from-primary/20 via-primary/10 to-glow-secondary/20 border-b border-primary/15 backdrop-blur-xl"
      >
        <div className="container mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <motion.div
              animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="shrink-0"
            >
              <Zap className="h-4 w-4 text-glow-secondary" />
            </motion.div>
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <span className="text-xs font-bold text-foreground truncate">{sale.title}</span>
              <span className="text-[10px] text-muted-foreground hidden sm:inline">{sale.description}</span>
              <span className="text-xs font-extrabold text-primary">{sale.discount_percent}% OFF</span>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="font-mono text-xs font-bold text-glow-secondary tracking-wider">{timeLeft}</div>
            <button onClick={() => setDismissed(true)} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FlashSaleBanner;
