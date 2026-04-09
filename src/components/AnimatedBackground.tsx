import { motion } from "framer-motion";

const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Base gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90" />

      {/* Ambient radial glows */}
      <div className="absolute inset-0">
        <div className="absolute w-full h-full bg-[radial-gradient(circle_at_50%_40%,hsl(160_100%_45%/0.06),transparent_55%)]" />
        <motion.div
          className="absolute w-full h-full"
          style={{ background: "radial-gradient(circle at 75% 25%, hsl(160 100% 50% / 0.07), transparent 40%)" }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-full h-full"
          style={{ background: "radial-gradient(circle at 25% 70%, hsl(45 100% 60% / 0.04), transparent 40%)" }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Animated blobs */}
      <motion.div
        className="absolute -top-32 -left-16 w-[500px] h-[500px] rounded-full mix-blend-screen filter blur-[100px]"
        style={{ background: "hsl(160 100% 45% / 0.08)" }}
        animate={{
          x: [0, 60, -30, 0],
          y: [0, 40, -20, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -top-24 -right-20 w-[450px] h-[450px] rounded-full mix-blend-screen filter blur-[100px]"
        style={{ background: "hsl(160 80% 50% / 0.06)" }}
        animate={{
          x: [0, -50, 30, 0],
          y: [0, 50, -30, 0],
          scale: [1, 0.85, 1.15, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute -bottom-32 left-1/3 w-[550px] h-[550px] rounded-full mix-blend-screen filter blur-[120px]"
        style={{ background: "hsl(160 90% 40% / 0.05)" }}
        animate={{
          x: [0, -40, 50, 0],
          y: [0, -60, 20, 0],
          scale: [1, 1.3, 0.95, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />
      {/* Warm accent blob */}
      <motion.div
        className="absolute top-1/2 right-1/4 w-[300px] h-[300px] rounded-full mix-blend-screen filter blur-[80px]"
        style={{ background: "hsl(45 100% 60% / 0.03)" }}
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Perspective grid */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(160 100% 45% / 0.5) 1px, transparent 1px),
            linear-gradient(90deg, hsl(160 100% 45% / 0.5) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage: "linear-gradient(transparent 5%, black 30%, black 70%, transparent 95%)",
          WebkitMaskImage: "linear-gradient(transparent 5%, black 30%, black 70%, transparent 95%)",
          transform: "perspective(800px) rotateX(55deg) translateY(-80px) translateZ(80px)",
        }}
      />

      {/* Dot grid overlay */}
      <div className="absolute inset-0 dot-grid opacity-20" />

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/30"
          style={{
            left: `${15 + i * 10}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0, 0.6, 0],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: 5 + i * 0.7,
            delay: i * 0.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,hsl(var(--background))_100%)]" />
    </div>
  );
};

export default AnimatedBackground;
