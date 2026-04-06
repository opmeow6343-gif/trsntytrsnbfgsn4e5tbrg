import { motion } from "framer-motion";
import { Shield, Cpu, Headphones, HardDrive, Globe, Lock } from "lucide-react";

const advantages = [
  { icon: Shield, title: "Strong DDoS Defense", desc: "Robust DDoS protection for secure, nonstop gameplay." },
  { icon: Cpu, title: "High-Speed CPUs", desc: "AMD Ryzen 9 processors for top-tier gaming performance." },
  { icon: Headphones, title: "24/7 Assistance", desc: "Expert support team available around the clock on Discord." },
  { icon: HardDrive, title: "NVMe Storage", desc: "Enterprise NVMe SSDs with 7000MB/s read speeds." },
  { icon: Globe, title: "Low Latency Network", desc: "Optimized routing for sub-50ms ping in most regions." },
  { icon: Lock, title: "Auto Backups", desc: "Daily snapshots with 7-day retention and one-click restore." },
];

const AdvantagesSection = () => {
  return (
    <section className="relative py-28 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <motion.span className="text-[10px] font-medium text-primary tracking-[0.25em] uppercase block mb-3 font-mono">
            ADVANTAGES
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter font-display">
            Experience the{" "}
            <span className="gradient-text">ZeyronCloud</span>
            <br />
            Advantage
          </h2>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {advantages.map((adv, i) => (
            <motion.div
              key={adv.title}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="rounded-xl glass gradient-border p-6 relative overflow-hidden group card-hover"
            >
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: "radial-gradient(circle at 50% 50%, hsl(160 100% 45% / 0.06), transparent 70%)" }}
              />

              <div className="flex items-start gap-4 relative z-10">
                <motion.div
                  className="shrink-0 rounded-lg bg-primary/8 border border-primary/10 p-2.5"
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.15 }}
                  transition={{ duration: 0.4 }}
                >
                  <adv.icon className="h-5 w-5 text-primary" />
                </motion.div>
                <div>
                  <h3 className="font-bold text-sm mb-1 font-display">{adv.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{adv.desc}</p>
                </div>
              </div>

              <motion.div
                className="absolute top-4 right-4 text-[10px] font-bold text-primary/15 font-mono"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                0{i + 1}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdvantagesSection;
