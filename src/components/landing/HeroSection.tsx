import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useInView, animate } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink, Monitor, Shield, Clock, Headphones } from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";

const DISCORD_LINK = "https://discord.gg/KWaU6GMmgs";

const AnimatedCounter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v * 100) / 100),
    });
    return () => controls.stop();
  }, [isInView, value]);

  return <span ref={ref}>{display}{suffix}</span>;
};

const featureCards = [
  { icon: Monitor, title: "Quick Setup", desc: "Launch your game server in under 60 seconds" },
  { icon: Shield, title: "DDoS Defense", desc: "Enterprise-level protection for your servers" },
  { icon: Clock, title: "99.99% Uptime", desc: "Dependable hosting with guaranteed uptime" },
  { icon: Headphones, title: "24/7 Support", desc: "Expert support assistance whenever you need it" },
];

const HeroSection = () => {
  const navigate = useNavigate();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[100dvh] flex items-center overflow-hidden">
      <AnimatedBackground />

      <motion.div style={{ y: heroY, opacity: heroOpacity }} className="container relative z-10 mx-auto px-4 py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2.5 rounded-full glass px-4 py-2 text-[11px] font-medium text-primary mb-6"
            >
              <motion.span
                className="relative flex h-2 w-2"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </motion.span>
              HIGH PERFORMANCE GAMING WITHOUT LAG
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[0.95] tracking-tighter mb-6 font-display"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              Host your own
              <br />
              <span className="gradient-text">Game Servers</span>
            </motion.h1>

            <motion.p
              className="text-muted-foreground text-base sm:text-lg max-w-md mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              Experience lightning-fast performance, unbeatable reliability, and 24/7 support for all your favorite games.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-3 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  onClick={() => navigate("/minecraft-plans")}
                  className="glow-primary gap-2 px-8 text-sm font-bold h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 relative overflow-hidden"
                >
                  <span className="shine-line absolute inset-0" />
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started
                    <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                      <ArrowRight className="h-4 w-4" />
                    </motion.span>
                  </span>
                </Button>
              </motion.div>
              <motion.a href={DISCORD_LINK} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline" className="gap-2 px-8 text-sm border-border/40 hover:border-primary/30 hover:bg-primary/5 h-12 rounded-xl">
                  <ExternalLink className="h-4 w-4" /> Learn More
                </Button>
              </motion.a>
            </motion.div>

            {/* Mini stats bar */}
            <motion.div
              className="flex items-center gap-4 text-xs text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                India
              </span>
              <span>•</span>
              <span>500+ servers</span>
              <span>•</span>
              <span>Asia</span>
              <span className="text-primary font-medium">+4% today</span>
            </motion.div>
          </div>

          {/* Right — Feature Cards 2×2 */}
          <div className="grid grid-cols-2 gap-3">
            {featureCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, scale: 1.03 }}
                className="rounded-xl glass gradient-border p-5 card-hover group"
              >
                <motion.div
                  className="inline-flex rounded-lg bg-primary/8 border border-primary/10 p-2.5 mb-3"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.4 }}
                >
                  <card.icon className="h-5 w-5 text-primary" />
                </motion.div>
                <h3 className="font-bold text-sm mb-1 font-display">{card.title}</h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      />
    </section>
  );
};

export default HeroSection;
