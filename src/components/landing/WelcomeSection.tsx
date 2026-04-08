import { motion } from "framer-motion";
import { Sparkles, Gamepad2, Server, Headphones } from "lucide-react";
import logo from "@/assets/zeyron-logo.png";

const cards = [
  {
    icon: Gamepad2,
    title: "Peak Performance",
    desc: "Peak performance for ultra smooth and lag-free gameplay on every server.",
  },
  {
    icon: Server,
    title: "Quick Setup",
    desc: "Quick setup for fast, hassle-free server launch. Play in under 60 seconds.",
  },
  {
    icon: Headphones,
    title: "Flexible & Affordable",
    desc: "Budget-friendly, scalable hosting for every gamer's needs. Starting ₹20/GB.",
  },
];

const WelcomeSection = () => {
  return (
    <section className="relative py-28 overflow-hidden">
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(160 100% 45% / 0.04), transparent 60%)" }}
        animate={{ scale: [1, 1.15, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <motion.img
            src={logo}
            alt="ZeyronCloud"
            className="h-16 w-16 mx-auto mb-6 rounded-2xl"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
          />
          <motion.div
            className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-[11px] font-medium text-primary mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            WHY CHOOSE ZEYRONCLOUD?
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter font-display">
            Enjoy unmatched{" "}
            <span className="gradient-text">performance</span>,{" "}
            <br className="hidden md:block" />
            reliability, and support
          </h2>
          <p className="mt-5 text-muted-foreground text-sm max-w-xl mx-auto leading-relaxed">
            We deliver premium game server hosting with enterprise-grade infrastructure,
            ensuring your gaming experience is always smooth and lag-free.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="rounded-2xl glass gradient-border p-8 text-center relative overflow-hidden group card-hover"
            >
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: "radial-gradient(circle at 50% 0%, hsl(160 100% 45% / 0.08), transparent 60%)" }}
              />
              <motion.div
                className="inline-flex rounded-2xl bg-primary/8 border border-primary/10 p-4 mb-5 relative z-10"
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.15 }}
                transition={{ duration: 0.4 }}
              >
                <card.icon className="h-7 w-7 text-primary" />
              </motion.div>
              <h3 className="font-bold text-base mb-2 font-display relative z-10">{card.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed relative z-10">{card.desc}</p>
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-[2px]"
                style={{ background: "linear-gradient(90deg, transparent, hsl(160 100% 45% / 0.4), transparent)" }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
              />
              <motion.div
                className="absolute top-4 right-4 text-[10px] font-bold text-primary/20 font-mono"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + i * 0.1 }}
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

export default WelcomeSection;
