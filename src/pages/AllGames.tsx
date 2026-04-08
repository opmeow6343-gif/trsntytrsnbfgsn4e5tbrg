import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Gamepad2 } from "lucide-react";

import minecraft from "@/assets/games/minecraft.png";
import rust from "@/assets/games/rust.png";
import palworld from "@/assets/games/palworld.png";
import valheim from "@/assets/games/valheim.png";
import ark from "@/assets/games/ark.png";
import terraria from "@/assets/games/terraria.png";
import hytale from "@/assets/games/hytale.png";
import satisfactory from "@/assets/games/satisfactory.png";
import sevenDays from "@/assets/games/7days.png";

const BILLING_URL = "https://client.zeyroncloud.com/register";

const games = [
  { name: "Minecraft", img: minecraft, desc: "Java & Bedrock editions with mod support, plugin installer, and one-click setup.", available: true, link: "/minecraft-plans", tag: "Most Popular" },
  { name: "Rust", img: rust, desc: "Survival multiplayer with oxide mod support and high-performance servers.", available: true, tag: "Popular" },
  { name: "Palworld", img: palworld, desc: "Open-world survival crafting with creature collection and multiplayer.", available: true },
  { name: "Valheim", img: valheim, desc: "Viking survival exploration with dedicated server hosting.", available: true },
  { name: "ARK: Survival", img: ark, desc: "Dinosaur survival with mod support and cluster configurations.", available: true },
  { name: "Terraria", img: terraria, desc: "2D sandbox adventure with tModLoader support.", available: true },
  { name: "Hytale", img: hytale, desc: "Block-based RPG adventure game — coming soon!", available: false, tag: "Coming Soon" },
  { name: "Satisfactory", img: satisfactory, desc: "Factory building and automation on alien planet.", available: true },
  { name: "7 Days to Die", img: sevenDays, desc: "Zombie survival with crafting, building, and exploration.", available: true },
];

const AllGames = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      <Navbar />
      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-xs text-primary mb-6">
              <Gamepad2 className="h-3.5 w-3.5" /> ALL GAMES
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-display">
              Supported <span className="gradient-text">Games</span>
            </h1>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-sm">
              Host your favorite games on our high-performance infrastructure with instant setup, DDoS protection, and 24/7 support.
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {games.map((game, i) => (
              <motion.div
                key={game.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group"
              >
                <Card className="overflow-hidden h-full glass gradient-border card-hover transition-all duration-300">
                  <div className="relative h-40 overflow-hidden">
                    <img src={game.img} alt={game.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                    {game.tag && (
                      <Badge className="absolute top-3 right-3 bg-primary/90 text-primary-foreground text-[10px]">
                        {game.tag}
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-5 space-y-3">
                    <h3 className="font-bold text-lg font-display">{game.name}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{game.desc}</p>
                    <Button
                      onClick={() => game.link ? navigate(game.link) : window.open(BILLING_URL, "_blank")}
                      disabled={!game.available}
                      className="w-full gap-2 text-xs font-semibold"
                      variant={game.available ? "default" : "outline"}
                      size="sm"
                    >
                      {game.available ? (
                        <>Get Started <ArrowRight className="h-3.5 w-3.5" /></>
                      ) : (
                        "Coming Soon"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AllGames;
