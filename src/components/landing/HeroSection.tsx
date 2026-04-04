import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useMotionValue, useSpring, useInView, animate } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink, Zap, Shield, Clock, Server } from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";

import logo from "@/assets/zeyroncloud-logo.png";

const letterVariants = {
  hidden: { opacity: 0, y: 50, rotateX: -60 },
  visible: (i: number) => ({
    opacity: 1, y: 0, rotateX: 0,
    transition: { delay: 0.4 + i * 0.03, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
  }),
};

const AnimatedText = ({ text, className }: { text: string; className?: string }) => (
  <span className={className}>
    {text.split("").map((char, i) => (
      <motion.span key={i} custom={i} variants={letterVariants} initial="hidden" animate="visible" className="inline-block" style={{ transformOrigin: "bottom" }}>
        {char === " " ? "\u00A0" : char}
      </motion.span>
    ))}
  </span>
);

const MagneticButton = ({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (rect) { x.set((e.clientX - rect.left - rect.width / 2) * 0.3); y.set((e.clientY - rect.top - rect.height / 2) * 0.3); }
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
    >
      <Button size="lg" onClick={onClick} className={className}>{children}</Button>
    </motion.div>
  );
};

const statVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: 0.8 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
  }),
};

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

const HeroSection = () => {
  
  const navigate = useNavigate();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const stats = [
    { icon: Zap, label: "Deploy", display: <span>Instant</span> },
    { icon: Shield, label: "DDoS Shield", display: <><AnimatedCounter value={99.99} suffix="%" /></> },
    { icon: Clock, label: "Support", display: <span>24/7</span> },
    { icon: Server, label: "Per GB/Mo", display: <>₹<AnimatedCounter value={15} /></> },
  ];

  return (
    <section ref={ref} className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
      <AnimatedBackground />

      <motion.div style={{ y: heroY, opacity: heroOpacity }} className="container relative z-10 mx-auto px-4 py-28">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo with 3D spin */}
          <motion.div
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <motion.div
              className="relative inline-block"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.img
                src={logo}
                alt="ZeyronCloud"
                className="h-20 w-20 mx-auto rounded-2xl relative z-10"
                style={{ filter: "drop-shadow(0 0 50px hsl(160 100% 45% / 0.4))" }}
                whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.4 }}
              />
              <motion.div
                className="absolute inset-0 rounded-2xl bg-primary/20 blur-2xl scale-150"
                animate={{ opacity: [0.4, 0.8, 0.4], scale: [1.3, 1.6, 1.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>

          {/* Badge with slide-in */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2.5 rounded-full glass px-4 py-2 text-[11px] font-medium text-primary mb-8"
          >
            <motion.span
              className="relative flex h-2 w-2"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              LIVE — GAME SERVER HOSTING
            </motion.span>
          </motion.div>

          {/* Letter-by-letter heading */}
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[0.9] tracking-tighter mb-6 font-display"
            style={{ perspective: "1000px" }}
          >
            <div className="block text-foreground overflow-hidden">
              <AnimatedText text="Game Hosting" />
            </div>
            <div className="block gradient-text overflow-hidden">
              <AnimatedText text="Reimagined." />
            </div>
          </motion.h1>

          {/* Subtitle with word fade */}
          <motion.p
            className="text-muted-foreground text-base sm:text-lg max-w-lg mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            Minecraft, Palworld, Rust & more — instant deploy, DDoS protection, 24/7 support. From{" "}
            <motion.span
              className="text-primary font-semibold"
              animate={{ textShadow: ["0 0 0px hsl(160 100% 45% / 0)", "0 0 20px hsl(160 100% 45% / 0.5)", "0 0 0px hsl(160 100% 45% / 0)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ₹15/GB
            </motion.span>.
          </motion.p>

          {/* CTAs with magnetic effect */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3.5 justify-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <MagneticButton
              onClick={() => navigate("/minecraft-plans")}
              className="glow-primary gap-2 px-8 text-sm font-bold group relative overflow-hidden h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <span className="shine-line absolute inset-0" />
              <span className="relative z-10 flex items-center gap-2">
                Get Started
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.span>
              </span>
            </MagneticButton>
            <motion.a
              href="https://discord.gg/zeyron"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" variant="outline" className="gap-2 px-8 text-sm border-border/40 hover:border-primary/30 hover:bg-primary/5 h-12 rounded-xl">
                <ExternalLink className="h-4 w-4" /> Join Discord
              </Button>
            </motion.a>
          </motion.div>

          {/* Stats with staggered pop-in */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                custom={i}
                variants={statVariants}
                initial="hidden"
                animate="visible"
                whileHover={{
                  scale: 1.08,
                  y: -6,
                }}
                className="text-center p-4 rounded-xl glass gradient-border card-hover"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                >
                  <s.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                </motion.div>
                <p className="font-bold text-base text-foreground stat-number font-display">{s.display}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Animated bottom fade */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      />
      <DiscordOrderDialog open={showDiscord} onOpenChange={setShowDiscord} />
    </section>
  );
};

export default HeroSection;
