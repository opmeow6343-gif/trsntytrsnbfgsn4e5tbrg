import { motion } from "framer-motion";

const technologies = [
  { name: "AMD EPYC", icon: "⚡" },
  { name: "NVMe SSD", icon: "💾" },
  { name: "Cloudflare", icon: "🛡️" },
  { name: "DDoS Guard", icon: "🔒" },
  { name: "Docker", icon: "🐳" },
  { name: "Linux", icon: "🐧" },
  { name: "Pterodactyl", icon: "🦖" },
  { name: "10Gbps Network", icon: "🌐" },
];

const TechLogosMarquee = () => (
  <section className="py-10 overflow-hidden border-y border-border/30">
    <motion.p
      className="text-center text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-6 font-medium"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      Powered by Enterprise Infrastructure
    </motion.p>
    <div className="relative">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
      <div className="flex animate-marquee">
        {[...technologies, ...technologies].map((tech, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 px-8 py-2 shrink-0 group"
          >
            <span className="text-xl grayscale group-hover:grayscale-0 transition-all duration-300">
              {tech.icon}
            </span>
            <span className="text-sm text-muted-foreground/60 group-hover:text-foreground font-medium whitespace-nowrap transition-colors duration-300">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TechLogosMarquee;
