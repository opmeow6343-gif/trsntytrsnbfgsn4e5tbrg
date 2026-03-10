import { motion } from "framer-motion";
import { MousePointer2, CreditCard, Rocket } from "lucide-react";

const steps = [
  { icon: MousePointer2, title: "Choose Plan", desc: "Pick the perfect plan for your needs from our range of options." },
  { icon: CreditCard, title: "Pay & Submit", desc: "Complete payment and submit your order via our Discord ticket system." },
  { icon: Rocket, title: "Server Ready", desc: "Your server is set up instantly and ready to play within minutes." },
];

const HowItWorksSection = () => (
  <section className="relative py-24 overflow-hidden">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-center mb-16"
      >
        <span className="text-[10px] font-medium text-primary tracking-[0.25em] uppercase block mb-3 font-mono">
          HOW IT WORKS
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter font-display">
          Get Started in{" "}
          <span className="gradient-text">3 Steps</span>
        </h2>
      </motion.div>

      <div className="relative max-w-3xl mx-auto">
        {/* Connecting line */}
        <motion.div
          className="absolute top-12 left-[16.66%] right-[16.66%] h-[1px] hidden md:block"
          style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.3), hsl(var(--primary) / 0.3), transparent)" }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1 }}
        />

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-center relative"
            >
              <motion.div
                className="inline-flex rounded-2xl bg-primary/8 border border-primary/10 p-5 mb-5 relative"
                whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.4 }}
              >
                <step.icon className="h-6 w-6 text-primary" />
                <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {i + 1}
                </span>
              </motion.div>
              <h3 className="font-bold text-sm mb-2 font-display">{step.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px] mx-auto">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
