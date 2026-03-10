import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import logo from "@/assets/zeyroncloud-logo.png";

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); setTimeout(onComplete, 400); return 100; }
        return p + Math.random() * 14 + 5;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [onComplete]);

  const pct = Math.min(progress, 100);

  return (
    <motion.div
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center"
      style={{ background: "hsl(160 10% 4%)" }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0">
        <div className="absolute w-[400px] h-[400px] rounded-full" style={{
          background: "radial-gradient(circle, hsl(160 100% 45% / 0.08), transparent 70%)",
          top: "40%", left: "50%", transform: "translate(-50%, -50%)",
        }} />
      </div>

      <motion.img
        src={logo}
        alt="ZeyronCloud"
        className="h-16 w-16 rounded-2xl relative z-10 mb-6"
        style={{ filter: "drop-shadow(0 0 30px hsl(160 100% 45% / 0.4))" }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="relative z-10 mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight font-display">
          <span className="text-foreground">Zeyron</span>
          <span className="gradient-text">Cloud</span>
        </h1>
        <p className="text-[9px] text-muted-foreground mt-1.5 tracking-[0.3em] uppercase font-mono">Loading</p>
      </motion.div>

      <motion.div className="relative z-10 w-40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <div className="h-[2px] w-full bg-border/30 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              width: `${pct}%`,
              background: "linear-gradient(90deg, hsl(160 100% 45%), hsl(45 100% 60%))",
              boxShadow: "0 0 14px hsl(160 100% 45% / 0.5)",
            }}
          />
        </div>
        <p className="text-center text-[9px] text-muted-foreground/50 mt-2 tracking-[0.2em] font-mono">
          {pct < 100 ? `${Math.round(pct)}%` : "✓"}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;
