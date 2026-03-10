import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import DiscordOrderDialog from "@/components/DiscordOrderDialog";

import minecraftImg from "@/assets/games/minecraft.png";
import hytaleImg from "@/assets/games/hytale.png";
import palworldImg from "@/assets/games/palworld.png";
import rustImg from "@/assets/games/rust.png";
import arkImg from "@/assets/games/ark.png";
import valheimImg from "@/assets/games/valheim.png";
import terrariaImg from "@/assets/games/terraria.png";
import satisfactoryImg from "@/assets/games/satisfactory.png";
import sevenDaysImg from "@/assets/games/7days.png";
import moreGamesImg from "@/assets/games/more-games.png";

const games = [
  { name: "Minecraft", desc: "Java & Bedrock", image: minecraftImg },
  { name: "Hytale", desc: "Next-gen servers", image: hytaleImg },
  { name: "Palworld", desc: "Auto-save & mods", image: palworldImg },
  { name: "Rust", desc: "Oxide support", image: rustImg },
  { name: "ARK", desc: "Cluster mgmt", image: arkImg },
  { name: "Valheim", desc: "Valheim Plus", image: valheimImg },
  { name: "Terraria", desc: "tShock support", image: terrariaImg },
  { name: "Satisfactory", desc: "Persistent saves", image: satisfactoryImg },
  { name: "7 Days", desc: "Zombie survival", image: sevenDaysImg },
  { name: "More", desc: "Request any game", image: moreGamesImg },
];

const TiltCard = ({ game, index, onClick }: { game: typeof games[0]; index: number; onClick: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-50, 50], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-50, 50], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.85, rotateX: 15 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      onClick={onClick}
      className="group rounded-xl glass gradient-border p-4 cursor-pointer card-hover text-center relative overflow-hidden"
    >
      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "radial-gradient(circle at 50% 50%, hsl(160 100% 45% / 0.06), transparent 70%)" }}
      />
      
      <motion.img
        src={game.image}
        alt={game.name}
        className="h-12 w-12 rounded-lg object-cover mx-auto mb-3 relative z-10"
        loading="lazy"
        whileHover={{ scale: 1.2, rotate: [0, -5, 5, 0], y: -4 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
      <motion.h3
        className="font-bold text-xs text-foreground/90 font-display relative z-10"
        whileHover={{ scale: 1.05 }}
      >
        {game.name}
      </motion.h3>
      <p className="text-[10px] text-muted-foreground mt-0.5 relative z-10">{game.desc}</p>
    </motion.div>
  );
};

const GamesSection = () => {
  const [showDiscord, setShowDiscord] = useState(false);

  return (
    <section className="relative py-28 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14"
        >
          <motion.span
            className="text-[10px] font-medium text-primary tracking-[0.25em] uppercase block mb-3 font-mono"
            initial={{ opacity: 0, letterSpacing: "0.5em" }}
            whileInView={{ opacity: 1, letterSpacing: "0.25em" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            GAMES
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter font-display">
            Host Any{" "}
            <motion.span
              className="gradient-text inline-block"
              whileInView={{ scale: [0.8, 1.05, 1] }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Game
            </motion.span>
          </h2>
          <motion.p
            className="mt-4 text-muted-foreground text-sm max-w-sm mx-auto"
            initial={{ opacity: 0, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Enterprise infrastructure for every title.
          </motion.p>
        </motion.div>

        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 max-w-4xl mx-auto" style={{ perspective: "1200px" }}>
          {games.map((game, i) => (
            <TiltCard key={game.name} game={game} index={i} onClick={() => setShowDiscord(true)} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-10"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outline" size="sm" className="gap-2 text-xs border-border/30 hover:border-primary/30 rounded-lg" onClick={() => setShowDiscord(true)}>
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
      <DiscordOrderDialog open={showDiscord} onOpenChange={setShowDiscord} />
    </section>
  );
};

export default GamesSection;
