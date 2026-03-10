import { motion } from "framer-motion";
import { Server, Users, Globe, Zap, Shield, Clock, Cpu, Star } from "lucide-react";

const stats = [
  { icon: Server, label: "500+ Active Servers" },
  { icon: Users, label: "2,000+ Gamers" },
  { icon: Globe, label: "Multi-Region" },
  { icon: Zap, label: "Instant Deploy" },
  { icon: Shield, label: "DDoS Protected" },
  { icon: Clock, label: "99.99% Uptime" },
  { icon: Cpu, label: "Ryzen 9 CPUs" },
  { icon: Star, label: "5-Star Rated" },
];

const StatsMarquee = () => (
  <section className="py-6 border-y border-border/8 overflow-hidden relative">
    <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-10 pointer-events-none" />
    
    {/* Row 1 - left to right */}
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="flex animate-marquee mb-3"
    >
      {[...stats, ...stats, ...stats].map((s, i) => (
        <div key={`a-${i}`} className="flex items-center gap-2.5 px-6 shrink-0">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: i * 0.3 }}
          >
            <s.icon className="h-3.5 w-3.5 text-primary/40" />
          </motion.div>
          <span className="text-[11px] text-muted-foreground/40 font-medium whitespace-nowrap tracking-wide">{s.label}</span>
          <motion.span
            className="h-1 w-1 rounded-full bg-primary/20"
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
          />
        </div>
      ))}
    </motion.div>

    {/* Row 2 - right to left */}
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="flex"
      style={{ animation: "marquee-reverse 35s linear infinite" }}
    >
      {[...stats.reverse(), ...stats, ...stats].map((s, i) => (
        <div key={`b-${i}`} className="flex items-center gap-2.5 px-6 shrink-0">
          <s.icon className="h-3.5 w-3.5 text-primary/30" />
          <span className="text-[11px] text-muted-foreground/30 font-medium whitespace-nowrap tracking-wide">{s.label}</span>
        </div>
      ))}
    </motion.div>
  </section>
);

export default StatsMarquee;
