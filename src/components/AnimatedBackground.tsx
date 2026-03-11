import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const Particle = ({ delay, x, y, size }: { delay: number; x: string; y: string; size: number }) => (
  <motion.div
    className="absolute rounded-full"
    style={{
      width: size,
      height: size,
      left: x,
      top: y,
      background: `radial-gradient(circle, hsl(160 100% 45% / ${0.15 + Math.random() * 0.15}), transparent)`,
    }}
    animate={{
      y: [0, -80, 0],
      x: [0, (Math.random() - 0.5) * 60, 0],
      opacity: [0, 0.8, 0],
      scale: [0.5, 1.2, 0.5],
    }}
    transition={{
      duration: 4 + Math.random() * 4,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

const LightParticle = ({ delay, x, y, size }: { delay: number; x: string; y: string; size: number }) => (
  <motion.div
    className="absolute rounded-full"
    style={{
      width: size,
      height: size,
      left: x,
      top: y,
      background: `radial-gradient(circle, hsl(160 90% 40% / ${0.12 + Math.random() * 0.1}), transparent)`,
    }}
    animate={{
      y: [0, -60, 0],
      x: [0, (Math.random() - 0.5) * 40, 0],
      opacity: [0, 0.6, 0],
      scale: [0.5, 1.3, 0.5],
    }}
    transition={{
      duration: 5 + Math.random() * 5,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

const AnimatedBackground = () => {
  const [isLight, setIsLight] = useState(() => document.documentElement.classList.contains("light"));
  const [particles] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      delay: Math.random() * 5,
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      size: 3 + Math.random() * 6,
    }))
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsLight(document.documentElement.classList.contains("light"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <AnimatePresence mode="wait">
      {isLight ? (
        <motion.div
          key="light"
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Vibrant teal orb top-right */}
          <motion.div
            className="absolute w-[700px] h-[700px] rounded-full"
            style={{
              background: "radial-gradient(circle, hsl(160 85% 65% / 0.4), hsl(160 70% 75% / 0.12) 50%, transparent 70%)",
              top: "-25%",
              right: "-10%",
            }}
            animate={{ scale: [1, 1.12, 1], x: [0, -40, 0], y: [0, 30, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Warm amber orb bottom-left */}
          <motion.div
            className="absolute w-[550px] h-[550px] rounded-full"
            style={{
              background: "radial-gradient(circle, hsl(45 90% 70% / 0.35), hsl(45 80% 80% / 0.1) 50%, transparent 70%)",
              bottom: "-20%",
              left: "-8%",
            }}
            animate={{ scale: [1, 1.18, 1], y: [0, -40, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Mint orb center-right */}
          <motion.div
            className="absolute w-[350px] h-[350px] rounded-full"
            style={{
              background: "radial-gradient(circle, hsl(160 75% 70% / 0.3), transparent 70%)",
              top: "55%",
              left: "65%",
            }}
            animate={{ scale: [1, 1.3, 1], x: [0, -25, 0], y: [0, 15, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Blue-teal orb top-left */}
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full"
            style={{
              background: "radial-gradient(circle, hsl(170 65% 72% / 0.25), transparent 70%)",
              top: "10%",
              left: "5%",
            }}
            animate={{ scale: [1, 1.15, 1], x: [0, 20, 0], y: [0, -20, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Extra warm accent center */}
          <motion.div
            className="absolute w-[300px] h-[300px] rounded-full"
            style={{
              background: "radial-gradient(circle, hsl(35 90% 75% / 0.2), transparent 70%)",
              top: "30%",
              left: "40%",
            }}
            animate={{ scale: [1, 1.25, 1], x: [0, -15, 0], y: [0, 20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Light particles */}
          {particles.slice(0, 12).map((p) => (
            <LightParticle key={p.id} {...p} />
          ))}
          {/* Light grid */}
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(hsl(160 60% 45% / 0.04) 1px, transparent 1px),
                linear-gradient(90deg, hsl(160 60% 45% / 0.04) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="absolute inset-0 dot-grid opacity-40" />
        </motion.div>
      ) : (
        <motion.div
          key="dark"
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Main emerald orb */}
          <motion.div
            className="absolute w-[800px] h-[800px] rounded-full"
            style={{
              background: "radial-gradient(circle, hsl(160 100% 45% / 0.07), transparent 70%)",
              top: "-30%",
              right: "-15%",
            }}
            animate={{ scale: [1, 1.15, 1], x: [0, -60, 0], y: [0, 40, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Gold orb */}
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full"
            style={{
              background: "radial-gradient(circle, hsl(45 100% 60% / 0.04), transparent 70%)",
              bottom: "-25%",
              left: "-10%",
            }}
            animate={{ scale: [1, 1.2, 1], y: [0, -50, 0], rotate: [0, -8, 0] }}
            transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Accent orb */}
          <motion.div
            className="absolute w-[300px] h-[300px] rounded-full"
            style={{
              background: "radial-gradient(circle, hsl(160 80% 55% / 0.05), transparent 70%)",
              top: "60%",
              left: "70%",
            }}
            animate={{ scale: [1, 1.4, 1], x: [0, -30, 0], y: [0, 20, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
          {particles.map((p) => (
            <Particle key={p.id} {...p} />
          ))}
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(hsl(160 100% 45% / 0.02) 1px, transparent 1px),
                linear-gradient(90deg, hsl(160 100% 45% / 0.02) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="absolute inset-0 dot-grid opacity-25" />
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedBackground;
