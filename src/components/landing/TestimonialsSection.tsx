import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  { name: "Aarav K.", text: "Best MC hosting. Zero lag with 80+ players. DDoS protection is rock solid.", stars: 5 },
  { name: "Priya S.", text: "Bot running 3 months, zero restarts. Incredible value for the price.", stars: 5 },
  { name: "Rohan M.", text: "Ryzen 9 performance is insane — 20 TPS with 100+ players consistently.", stars: 5 },
  { name: "Sneha D.", text: "Switched from a major provider. Better perf, better support, half the cost.", stars: 5 },
  { name: "Vikram T.", text: "The booster plan is legit. 4 GB free server just for boosting Discord.", stars: 5 },
  { name: "Meera J.", text: "Support responds in minutes. They optimized my server config for free.", stars: 4 },
];

const cardVariants = {
  hidden: (i: number) => ({
    opacity: 0,
    x: i % 2 === 0 ? -60 : 60,
    y: 30,
    rotate: i % 2 === 0 ? -3 : 3,
  }),
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    y: 0,
    rotate: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

const TestimonialsSection = () => (
  <section className="py-28 relative overflow-hidden">
    {/* Floating quote decoration */}
    <motion.div
      className="absolute top-20 right-10 opacity-[0.03]"
      animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    >
      <Quote className="h-40 w-40 text-primary" />
    </motion.div>
    <motion.div
      className="absolute bottom-20 left-10 opacity-[0.02]"
      animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
    >
      <Quote className="h-32 w-32 text-primary" />
    </motion.div>

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
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          REVIEWS
        </motion.span>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter font-display">
          Trusted by{" "}
          <motion.span
            className="gradient-text inline-block"
            whileInView={{ scale: [0.8, 1.08, 1] }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Gamers
          </motion.span>
        </h2>
      </motion.div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{
              scale: 1.03,
              y: -6,
              transition: { duration: 0.3 }
            }}
            className="rounded-xl glass gradient-border p-5 relative overflow-hidden card-hover"
          >
            {/* Animated quote */}
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -20 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5, type: "spring" }}
            >
              <Quote className="absolute top-4 right-4 h-7 w-7 text-primary/5" />
            </motion.div>

            <div className="flex items-center gap-3 mb-3">
              <motion.div
                className="h-9 w-9 rounded-full bg-primary/10 border border-primary/15 flex items-center justify-center font-bold text-xs text-primary font-display"
                whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
                animate={{
                  boxShadow: ["0 0 0px hsl(160 100% 45% / 0)", "0 0 15px hsl(160 100% 45% / 0.2)", "0 0 0px hsl(160 100% 45% / 0)"]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
              >
                {t.name[0]}
              </motion.div>
              <div>
                <p className="font-bold text-xs font-display">{t.name}</p>
                <div className="flex gap-0.5 mt-0.5">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <motion.div
                      key={j}
                      initial={{ opacity: 0, scale: 0, rotate: -180 }}
                      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + i * 0.1 + j * 0.05, duration: 0.4, type: "spring" }}
                    >
                      <Star className="h-2.5 w-2.5 fill-primary text-primary" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
            <motion.p
              className="text-xs text-muted-foreground leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
            >
              {t.text}
            </motion.p>

            {/* Bottom glow */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-[1px]"
              style={{ background: "linear-gradient(90deg, transparent, hsl(160 100% 45% / 0.2), transparent)" }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 + i * 0.1, duration: 0.8 }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
