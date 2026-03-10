import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import CurrencyConverter from "@/components/CurrencyConverter";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Server, Cpu, HardDrive, Users, MemoryStick, ShoppingCart, Crown, ExternalLink } from "lucide-react";
import { getSettings, DEFAULT_SETTINGS } from "@/lib/storage";
import type { SiteSettings } from "@/lib/storage";
import DiscordOrderDialog from "@/components/DiscordOrderDialog";

const PRICES: Record<string, number> = { intel: 15, amd: 30, premium: 45 };
const cpuTiers = [
  { id: "intel", label: "Intel Xeon", description: "Reliable & cost-effective • ₹15/GB" },
  { id: "amd", label: "AMD Ryzen 9", description: "Max performance • ₹30/GB" },
  { id: "premium", label: "Premium", description: "Ultimate experience • ₹45/GB", isPremium: true },
];
const getPlayerSlots = (ram: number) => { if (ram <= 2) return 20; if (ram <= 4) return 40; if (ram <= 8) return 80; if (ram <= 16) return 160; if (ram <= 32) return 300; return 500; };

const MinecraftHosting = () => {
  const [cpu, setCpu] = useState("intel");
  const [ram, setRam] = useState(4);
  const [showDiscord, setShowDiscord] = useState(false);
  const [settings, setSettingsState] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => { getSettings().then(setSettingsState); }, []);

  const pricePerGb = PRICES[cpu];
  const price = ram * pricePerGb;
  const storage = ram * 5;
  const isPremium = cpu === "premium";

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      <Navbar />
      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Minecraft <span className="text-primary text-glow">Hosting</span>
            </h1>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">{settings.mcSubtitle}</p>
          </motion.div>
          <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-8">
              <div>
                <label className="text-sm font-semibold tracking-wider text-muted-foreground mb-4 block" style={{ fontFamily: "'Outfit', sans-serif" }}>CPU TIER</label>
                <div className="grid grid-cols-3 gap-3">
                  {cpuTiers.map((tier) => (
                    <button key={tier.id} onClick={() => setCpu(tier.id)} className={`rounded-xl border p-4 text-left transition-all ${cpu === tier.id ? tier.isPremium ? "border-amber-500/50 bg-amber-500/10 glow-premium" : "border-primary/50 bg-primary/10 glow-primary" : "border-border/50 bg-card/50 hover:border-primary/30"}`}>
                      {tier.isPremium ? <Crown className={`h-5 w-5 mb-2 ${cpu === tier.id ? "text-amber-400" : "text-muted-foreground"}`} /> : <Cpu className={`h-5 w-5 mb-2 ${cpu === tier.id ? "text-primary" : "text-muted-foreground"}`} />}
                      <div className="font-bold text-xs tracking-wider" style={{ fontFamily: "'Outfit', sans-serif" }}>{tier.label.toUpperCase()}</div>
                      <div className="text-xs text-muted-foreground mt-1">{tier.description}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-semibold tracking-wider text-muted-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>RAM</label>
                  <span className="font-bold text-lg text-primary" style={{ fontFamily: "'Outfit', sans-serif" }}>{ram} GB</span>
                </div>
                <Slider value={[ram]} onValueChange={(v) => setRam(v[0])} min={1} max={64} step={1} className="w-full" />
                <div className="flex justify-between mt-2 text-xs text-muted-foreground"><span>1 GB</span><span>64 GB</span></div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <Card className={`${isPremium ? "border-amber-500/30 glow-premium" : "border-primary/30 glow-primary"} bg-card`}>
                <CardHeader><CardTitle className="font-bold text-sm tracking-wider flex items-center gap-2" style={{ fontFamily: "'Outfit', sans-serif" }}><Server className={`h-5 w-5 ${isPremium ? "text-amber-400" : "text-primary"}`} /> YOUR SERVER</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[{ icon: Cpu, label: "CPU", value: cpu === "intel" ? "Intel Xeon" : cpu === "amd" ? "AMD Ryzen 9" : "Premium Ryzen 9" }, { icon: MemoryStick, label: "RAM", value: `${ram} GB DDR4` }, { icon: HardDrive, label: "Storage", value: `${storage} GB NVMe` }, { icon: Users, label: "Players", value: `${getPlayerSlots(ram)}` }].map(item => (
                      <div key={item.label} className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3"><span className="flex items-center gap-2 text-sm text-muted-foreground"><item.icon className="h-4 w-4" /> {item.label}</span><span className="text-sm font-semibold">{item.value}</span></div>
                    ))}
                  </div>
                  <div className="border-t border-border/50 pt-4">
                    <div className="flex items-baseline justify-between"><span className="text-muted-foreground">Monthly</span><span className={`font-extrabold text-3xl ${isPremium ? "text-amber-400" : "text-primary"}`} style={{ fontFamily: "'Outfit', sans-serif" }}>₹{price}</span></div>
                    <div className="flex items-center justify-between mt-1"><span className="text-xs text-muted-foreground">₹{pricePerGb}/GB × {ram} GB</span><CurrencyConverter amount={price} /></div>
                  </div>
                  <Button onClick={() => setShowDiscord(true)} className={`w-full gap-2 font-semibold text-sm ${isPremium ? "glow-premium" : "glow-primary"}`} size="lg"><ShoppingCart className="h-4 w-4" /> ORDER NOW</Button>
                  <a href="https://discord.gg/pBXUVRne" target="_blank" rel="noopener noreferrer"><Button variant="outline" className="w-full gap-2 text-sm border-primary/30" size="lg"><ExternalLink className="h-4 w-4" /> JOIN DISCORD</Button></a>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
      <DiscordOrderDialog open={showDiscord} onOpenChange={setShowDiscord} />
    </div>
  );
};

export default MinecraftHosting;
