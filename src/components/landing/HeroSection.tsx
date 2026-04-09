import { useRef, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink } from "lucide-react";

import minecraftBg from "@/assets/hero/minecraft-bg.jpg";
import gta5Bg from "@/assets/hero/gta5-bg.jpg";
import hytaleBg from "@/assets/hero/hytale-bg.jpg";
import palworldBg from "@/assets/hero/palworld-bg.jpg";
import terrariaBg from "@/assets/hero/terraria-bg.jpg";
import rustBg from "@/assets/hero/rust-bg.jpg";

const DISCORD_LINK = "https://discord.gg/KWaU6GMmgs";

const heroGames = [
  { name: "Minecraft", bg: minecraftBg, color: "hsl(120 60% 50%)" },
  { name: "GTA 5", bg: gta5Bg, color: "hsl(45 90% 55%)" },
  { name: "Hytale", bg: hytaleBg, color: "hsl(280 70% 60%)" },
  { name: "Palworld", bg: palworldBg, color: "hsl(200 80% 55%)" },
  { name: "Terraria", bg: terrariaBg, color: "hsl(140 70% 50%)" },
  { name: "Rust", bg: rustBg, color: "hsl(15 80% 55%)" },
];

const HeroSection = () => {
  const navigate = useNavigate();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroGames.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentGame = heroGames[activeIndex];

  return (
    <section ref={ref} className="relative min-h-[100dvh] flex items-center overflow-hidden">
      {/* Background images with crossfade */}
      <AnimatePresence mode="sync">
        <motion.div
          key={activeIndex}
          className="absolute inset-0 z-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <img
            src={currentGame.bg}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Dark overlays for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />
          <div className="absolute inset-0 bg-background/30" />
        </motion.div>
      </AnimatePresence>

      {/* Accent glow matching game color */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full blur-[150px] opacity-20 z-[1]"
        animate={{ background: currentGame.color }}
        transition={{ duration: 1.2 }}
      />

      <motion.div style={{ y: heroY, opacity: heroOpacity }} className="container relative z-10 mx-auto px-4 py-28">
        <div className="max-w-3xl">
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
            Deploy Your
            <br />
            <span className="relative inline-block h-[1.1em] overflow-hidden align-bottom">
              <AnimatePresence mode="wait">
                <motion.span
                  key={activeIndex}
                  className="gradient-text inline-block"
                  initial={{ y: 60, opacity: 0, rotateX: -45 }}
                  animate={{ y: 0, opacity: 1, rotateX: 0 }}
                  exit={{ y: -60, opacity: 0, rotateX: 45 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  {currentGame.name}
                </motion.span>
              </AnimatePresence>
            </span>
            <br />
            <span className="text-foreground">Server In Just </span>
            <span className="gradient-text">60 Sec!</span>
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

          {/* Game selector dots */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            {heroGames.map((game, i) => (
              <button
                key={game.name}
                onClick={() => setActiveIndex(i)}
                className={`relative h-2 rounded-full transition-all duration-500 ${
                  i === activeIndex ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
            <span className="ml-3 text-xs text-muted-foreground font-medium">{currentGame.name}</span>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent z-[2]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      />
    </section>
  );
};

export default HeroSection;
