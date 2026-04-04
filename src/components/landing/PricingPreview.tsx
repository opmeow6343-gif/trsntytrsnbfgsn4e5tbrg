import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Crown, Sparkles, Server } from "lucide-react";

import { useNavigate } from "react-router-dom";

const plans = [
  { title: "Intel MC", price: "₹15", unit: "/GB", features: ["Intel Xeon", "1–32 GB DDR4", "NVMe SSD", "DDoS Shield", "Instant Setup"], popular: false },
  { title: "AMD MC", price: "₹30", unit: "/GB", features: ["AMD Ryzen 9", "2–32 GB DDR4", "NVMe SSD", "DDoS Shield", "Priority Queue"], popular: true },
  { title: "Premium", price: "₹45", unit: "/GB", features: ["Ryzen 9 Dedicated", "Priority Support", "Dedicated Resources", "Premium Role", "Custom Subdomain"], icon: Crown },
  { title: "Bot Hosting", price: "₹25", unit: "/512MB", features: ["Bot Optimized", "Starting 512 MB", "99.99% Uptime", "NVMe SSD", "Root Access"] },
  { title: "VPS", price: "₹99", unit: "/mo", features: ["Full Root Access", "Dedicated vCPU", "NVMe Storage", "DDoS Shield", "24/7 Support"], icon: Server },
  { title: "Booster", price: "FREE", unit: "", features: ["Discord Boost Perks", "Up to 8 GB RAM", "Creator Plans", "Free Hosting", "Exclusive Roles"], icon: Sparkles },
];

const cardVariants = {
  hidden: (i: number) => ({ opacity: 0, y: 60, scale: 0.8, rotateX: 20 }),
  visible: (i: number) => ({ opacity: 1, y: 0, scale: 1, rotateX: 0, transition: { delay: i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } }),
};

const PricingPreview = () => {
  const navigate = useNavigate();
  

  const handlePlanClick = (plan: typeof plans[0]) => {
    if (plan.title === "Intel MC") navigate("/minecraft-plans");
    else if (plan.title === "AMD MC") navigate("/minecraft-plans");
    else if (plan.title === "Premium") navigate("/minecraft-plans");
    else if (plan.title === "Bot Hosting") navigate("/bot-plans");
    else if (plan.title === "VPS") navigate("/vps-plans");
    else if (plan.title === "Booster") navigate("/booster-plans");
  };

  return (
    <section className="relative py-28 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-14">
          <motion.span className="text-[10px] font-medium text-primary tracking-[0.25em] uppercase block mb-3 font-mono" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>PRICING</motion.span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter font-display">
            Simple{" "}
            <motion.span className="gradient-text inline-block" whileInView={{ scale: [0.8, 1.05, 1] }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>Plans</motion.span>
          </h2>
          <motion.p className="mt-4 text-muted-foreground text-sm" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>Order via Discord for instant setup.</motion.p>
        </motion.div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 max-w-6xl mx-auto" style={{ perspective: "1200px" }}>
          {plans.map((plan, i) => (
            <motion.div key={plan.title} custom={i} variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} whileHover={{ scale: 1.05, y: -10, transition: { duration: 0.3 } }} onClick={() => handlePlanClick(plan)} className={`relative rounded-xl glass gradient-border p-5 cursor-pointer overflow-hidden card-hover ${plan.popular ? "ring-1 ring-primary/20" : ""}`}>
              {plan.popular && (
                <motion.div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(105deg, transparent 40%, hsl(160 100% 55% / 0.04) 50%, transparent 60%)", backgroundSize: "200% auto" }} animate={{ backgroundPosition: ["-200% center", "200% center"] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />
              )}
              {plan.popular && (
                <motion.div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[8px] font-bold tracking-widest text-primary-foreground" initial={{ y: -20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5, type: "spring", stiffness: 300 }}>POPULAR</motion.div>
              )}
              <motion.div className="mb-3 inline-flex rounded-lg bg-primary/8 border border-primary/10 p-2 relative z-10" whileHover={{ rotate: [0, -15, 15, 0], scale: 1.2 }} transition={{ duration: 0.4 }}>
                {plan.icon ? <plan.icon className="h-4 w-4 text-primary" /> : <div className="h-2 w-2 rounded-full bg-primary" />}
              </motion.div>
              <h3 className="font-bold text-xs tracking-wide mb-2 font-display relative z-10">{plan.title}</h3>
              <div className="flex items-baseline gap-0.5 mb-4 relative z-10">
                <motion.span className="font-extrabold text-2xl text-primary font-display" whileInView={{ scale: [0.5, 1.1, 1] }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.08, duration: 0.5, type: "spring" }}>{plan.price}</motion.span>
                {plan.unit && <span className="text-[10px] text-muted-foreground">{plan.unit}</span>}
              </div>
              <ul className="space-y-2 mb-5 relative z-10">
                {plan.features.map((f, fi) => (
                  <motion.li key={f} className="flex items-center gap-2 text-[11px] text-muted-foreground" initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 + i * 0.08 + fi * 0.04, duration: 0.3 }}>
                    <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 + i * 0.08 + fi * 0.04, type: "spring" }}>
                      <Check className="h-3 w-3 text-primary shrink-0" />
                    </motion.div>
                    {f}
                  </motion.li>
                ))}
              </ul>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative z-10">
                <Button variant="outline" size="sm" className="w-full gap-1.5 text-[10px] font-semibold border-border/30 text-primary hover:bg-primary/5 rounded-lg" onClick={(e) => { e.stopPropagation(); handlePlanClick(plan); }}>
                  ORDER <ArrowRight className="h-3 w-3" />
                </Button>
              </motion.div>
              <motion.div className="absolute bottom-0 left-0 right-0 h-[1px]" style={{ background: "linear-gradient(90deg, transparent, hsl(160 100% 45% / 0.25), transparent)" }} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ delay: 0.6 + i * 0.08, duration: 0.8 }} />
            </motion.div>
          ))}
        </div>
      </div>
      
    </section>
  );
};

export default PricingPreview;
