import { motion } from "framer-motion";
import { Shield, Zap, Headphones, Globe, HardDrive, Clock, Cpu, Layers, Lock } from "lucide-react";

const features = [
  { icon: Shield, title: "DDoS Protection", desc: "Enterprise 99.99% protection around the clock.", detail: "Multi-layer volumetric & application-level filtering with automatic mitigation. No downtime during attacks." },
  { icon: Zap, title: "Instant Setup", desc: "Server live in seconds. Deploy and play.", detail: "Automated provisioning pipeline. Your server is configured, optimized, and online within 30 seconds of purchase." },
  { icon: Headphones, title: "24/7 Support", desc: "Expert team available via Discord anytime.", detail: "Average response time under 5 minutes. Dedicated support engineers who know gaming inside and out." },
  { icon: Globe, title: "Low Latency", desc: "Optimized routing for minimal ping worldwide.", detail: "Strategic data center locations with BGP anycast routing. Sub-50ms ping for most regions." },
  { icon: HardDrive, title: "NVMe Storage", desc: "Blazing SSDs — 5GB per GB of RAM.", detail: "Enterprise-grade NVMe drives with 7000MB/s read speeds. No more chunk loading lag." },
  { icon: Clock, title: "99.99% Uptime", desc: "Industry-leading reliability & monitoring.", detail: "Redundant infrastructure with automated failover. Real-time monitoring alerts us before issues affect you." },
  { icon: Cpu, title: "Ryzen 9 CPUs", desc: "Latest-gen AMD for max performance.", detail: "AMD Ryzen 9 7950X with up to 5.7GHz boost. Single-thread king for Minecraft servers." },
  { icon: Layers, title: "Full Mod Support", desc: "One-click mod & plugin installer.", detail: "Support for Forge, Fabric, Paper, Spigot, and Bukkit. Automatic dependency resolution." },
  { icon: Lock, title: "Auto Backups", desc: "Daily backups so you never lose progress.", detail: "Automated daily snapshots with 7-day retention. One-click restore from any backup point." },
];

const FeaturesSection = () => (
  <section className="relative py-28 overflow-hidden">
    <motion.div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
      style={{ background: "radial-gradient(circle, hsl(160 100% 45% / 0.03), transparent 70%)" }}
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
    />

    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-center mb-14"
      >
        <motion.span
          className="text-[10px] font-medium text-primary tracking-[0.25em] uppercase block mb-3 font-mono"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          FEATURES
        </motion.span>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter font-display">
          Built for{" "}
          <motion.span
            className="gradient-text inline-block"
            whileInView={{ rotateX: [20, 0], opacity: [0, 1] }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ transformOrigin: "bottom" }}
          >
            Performance
          </motion.span>
        </h2>
        <motion.p
          className="mt-4 text-muted-foreground text-sm max-w-sm mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Hover to flip & discover more. Every feature you need, nothing you don't.
        </motion.p>
      </motion.div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto" style={{ perspective: "1200px" }}>
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 50, scale: 0.85 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="group h-[180px]"
            style={{ perspective: "1000px" }}
          >
            <div
              className="relative w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Front */}
              <div
                className="absolute inset-0 rounded-xl glass gradient-border p-6 flex flex-col group-hover:[transform:rotateY(180deg)] transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
                style={{ backfaceVisibility: "hidden", transformStyle: "preserve-3d" }}
              >
                <motion.div
                  className="mb-4 inline-flex rounded-lg bg-primary/8 border border-primary/10 p-2.5"
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.15 }}
                  transition={{ duration: 0.4 }}
                >
                  <f.icon className="h-5 w-5 text-primary" />
                </motion.div>
                <h3 className="font-bold text-sm mb-1.5 text-foreground font-display">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-[1px]"
                  style={{ background: "linear-gradient(90deg, transparent, hsl(160 100% 45% / 0.3), transparent)" }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.07, duration: 0.8 }}
                />
              </div>

              {/* Back */}
              <div
                className="absolute inset-0 rounded-xl p-6 flex flex-col justify-center items-center text-center group-hover:[transform:rotateY(0deg)] [transform:rotateY(-180deg)] transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] feature-card-back"
                style={{
                  backfaceVisibility: "hidden",
                  transformStyle: "preserve-3d",
                }}
              >
                <f.icon className="h-6 w-6 text-primary mb-3" />
                <h3 className="font-bold text-sm mb-2 text-foreground font-display">{f.title}</h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{f.detail}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
