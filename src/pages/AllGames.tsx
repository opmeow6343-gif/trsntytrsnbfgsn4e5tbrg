import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowRight, Gamepad2, Search, Sparkles, Zap } from "lucide-react";

import minecraft from "@/assets/games/minecraft.png";
import rust from "@/assets/games/rust.png";
import palworld from "@/assets/games/palworld.png";
import valheim from "@/assets/games/valheim.png";
import ark from "@/assets/games/ark.png";
import terraria from "@/assets/games/terraria.png";
import hytale from "@/assets/games/hytale.png";
import satisfactory from "@/assets/games/satisfactory.png";
import sevenDays from "@/assets/games/7days.png";

// Hero background images
import minecraftBg from "@/assets/hero/minecraft-bg.jpg";
import rustBg from "@/assets/hero/rust-bg.jpg";
import palworldBg from "@/assets/hero/palworld-bg.jpg";
import terrariaBg from "@/assets/hero/terraria-bg.jpg";
import hytaleBg from "@/assets/hero/hytale-bg.jpg";
import gta5Bg from "@/assets/hero/gta5-bg.jpg";

const BILLING_URL = "https://client.zeyroncloud.com/register";

const games = [
  { name: "Minecraft", img: minecraft, bg: minecraftBg, desc: "World's most popular sandbox game", price: "From ₹20/GB", available: true, link: "/minecraft-plans", tag: "Popular" },
  { name: "Hytale", img: hytale, bg: hytaleBg, desc: "Next-gen adventure and building", price: "Coming Soon", available: false, tag: "Coming Soon" },
  { name: "Rust", img: rust, bg: rustBg, desc: "Survive, build, and dominate in Rust", price: "From ₹80/slot", available: true, tag: "Popular" },
  { name: "Palworld", img: palworld, bg: palworldBg, desc: "Open-world survival crafting with creatures", price: "From ₹60/GB", available: true },
  { name: "ARK: Survival", img: ark, bg: minecraftBg, desc: "Dinosaur survival with mod support", price: "From ₹70/GB", available: true },
  { name: "Terraria", img: terraria, bg: terrariaBg, desc: "2D sandbox adventure with tModLoader", price: "From ₹30/GB", available: true },
  { name: "Valheim", img: valheim, bg: palworldBg, desc: "Viking survival exploration", price: "From ₹50/GB", available: true },
  { name: "Satisfactory", img: satisfactory, bg: gta5Bg, desc: "Factory building and automation", price: "From ₹60/GB", available: true },
  { name: "7 Days to Die", img: sevenDays, bg: rustBg, desc: "Zombie survival with crafting", price: "From ₹50/GB", available: true },
];

// Scrolling marquee games
const marqueeGames = [...games, ...games];

const AllGames = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "popular">("all");
  const marqueeRef = useRef<HTMLDivElement>(null);

  const filtered = games.filter((g) => {
    const matchesSearch = g.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || g.tag === "Popular";
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      <Navbar />
      <main className="pt-20 relative z-10">
        {/* Hero Section */}
        <div className="relative py-16 overflow-hidden">
          <div className="container mx-auto px-4 text-center mb-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-display mb-4">
                Game Server <span className="gradient-text">Hosting</span>
              </h1>
              <p className="text-muted-foreground max-w-xl mx-auto text-sm">
                Experience lightning-fast performance, unbeatable reliability, and 24/7 support for all your favorite games with ZeyronCloud.
              </p>
            </motion.div>
          </div>

          {/* Scrolling Game Marquee */}
          <div className="relative w-full overflow-hidden py-4">
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
            <motion.div
              className="flex gap-4 w-max"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
              {marqueeGames.map((game, i) => (
                <div
                  key={`${game.name}-${i}`}
                  className="relative flex-shrink-0 w-40 h-24 rounded-xl overflow-hidden group cursor-pointer"
                  onClick={() => game.link ? navigate(game.link) : window.open(BILLING_URL, "_blank")}
                >
                  <img src={game.img} alt={game.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <span className="absolute bottom-2 left-3 text-xs font-bold text-white font-display">{game.name}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Games Grid Section */}
        <div className="container mx-auto px-4 pb-20">
          {/* Header with filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold font-display">All Games</h2>
              <p className="text-xs text-muted-foreground mt-1">Showing {filtered.length} games</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant={filter === "popular" ? "default" : "outline"}
                size="sm"
                className="text-xs rounded-lg"
                onClick={() => setFilter(filter === "popular" ? "all" : "popular")}
              >
                Most Popular
              </Button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search games..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 w-44 text-xs rounded-lg bg-secondary/50 border-border/30"
                />
              </div>
            </div>
          </div>

          {/* Game Cards Grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((game, i) => (
                <motion.div
                  key={game.name}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -6 }}
                  className="group"
                >
                  <Card className="overflow-hidden h-full glass gradient-border card-hover transition-all duration-300">
                    <div className="relative h-44 overflow-hidden">
                      <img src={game.img} alt={game.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                      {game.tag && (
                        <Badge className="absolute top-3 left-3 gap-1 bg-primary/90 text-primary-foreground text-[10px] font-semibold">
                          <Sparkles className="h-3 w-3" /> {game.tag}
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-5 space-y-3">
                      <h3 className="font-bold text-lg font-display">{game.name}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{game.desc}</p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs font-semibold text-primary">{game.price}</span>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Zap className="h-3 w-3 text-primary" /> Instant Setup
                        </div>
                      </div>
                      <Button
                        onClick={() => game.link ? navigate(game.link) : window.open(BILLING_URL, "_blank")}
                        disabled={!game.available}
                        className="w-full gap-2 text-xs font-semibold"
                        variant={game.available ? "default" : "outline"}
                        size="sm"
                      >
                        {game.available ? (
                          <>Deploy Server <ArrowRight className="h-3.5 w-3.5" /></>
                        ) : (
                          "Coming Soon"
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filtered.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <Gamepad2 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground text-sm">No games found matching "{search}"</p>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AllGames;
