import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import CurrencyConverter from "@/components/CurrencyConverter";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, MemoryStick, HardDrive, Wifi, ShoppingCart, ExternalLink, Shield } from "lucide-react";
import { getSettings, DEFAULT_SETTINGS } from "@/lib/storage";
import type { SiteSettings } from "@/lib/storage";

const DISCORD_LINK = "https://discord.gg/KWaU6GMmgs";
const PRICE_PER_GB = 50;
const formatRam = (mb: number) => mb >= 1024 ? `${mb / 1024} GB` : `${mb} MB`;

const BotHosting = () => {
  const [ramMb, setRamMb] = useState(1024);
  const [settings, setSettingsState] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => { getSettings().then(setSettingsState); }, []);

  const price = (ramMb / 1024) * PRICE_PER_GB;
  const storage = ((ramMb / 1024) * 5).toFixed(1);
  const ramSteps = [512, 1024, 2048, 3072, 4096, 5120, 6144, 7168, 8192, 10240, 12288, 14336, 16384];
  const sliderIndex = ramSteps.indexOf(ramMb) !== -1 ? ramSteps.indexOf(ramMb) : 1;

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      <Navbar />
      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Bot <span className="text-primary text-glow">Hosting</span>
            </h1>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">{settings.botSubtitle}</p>
          </motion.div>
          <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-8">
              <div>
                <div className="flex items-center justify-between mb-4"><label className="text-sm font-semibold text-muted-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>RAM</label><span className="font-bold text-lg text-primary" style={{ fontFamily: "'Outfit', sans-serif" }}>{formatRam(ramMb)}</span></div>
                <Slider value={[sliderIndex]} onValueChange={(v) => setRamMb(ramSteps[v[0]])} min={0} max={ramSteps.length - 1} step={1} className="w-full" />
                <div className="flex justify-between mt-2 text-xs text-muted-foreground"><span>512 MB</span><span>16 GB</span></div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <Card className="border-primary/30 bg-card glow-primary">
                <CardHeader><CardTitle className="font-bold text-sm tracking-wider flex items-center gap-2" style={{ fontFamily: "'Outfit', sans-serif" }}><Bot className="h-5 w-5 text-primary" /> YOUR BOT SERVER</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[{ icon: MemoryStick, label: "RAM", value: formatRam(ramMb) + " DDR4" }, { icon: HardDrive, label: "Storage", value: `${storage} GB NVMe` }, { icon: Shield, label: "DDoS", value: "99.99% Protection" }, { icon: Wifi, label: "Uptime", value: "99.99%" }].map(item => (
                      <div key={item.label} className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3"><span className="flex items-center gap-2 text-sm text-muted-foreground"><item.icon className="h-4 w-4" /> {item.label}</span><span className="text-sm font-semibold">{item.value}</span></div>
                    ))}
                  </div>
                  <div className="border-t border-border/50 pt-4">
                    <div className="flex items-baseline justify-between"><span className="text-muted-foreground">Monthly</span><span className="font-extrabold text-3xl text-primary" style={{ fontFamily: "'Outfit', sans-serif" }}>₹{price.toFixed(0)}</span></div>
                    <div className="flex items-center justify-between mt-1"><span className="text-xs text-muted-foreground">₹{PRICE_PER_GB}/GB × {(ramMb / 1024).toFixed(1)} GB</span><CurrencyConverter amount={price} /></div>
                  </div>
                  <Button onClick={() => window.open("https://client.zeyroncloud.com/register", "_blank")} className="w-full glow-primary gap-2 font-semibold text-sm" size="lg"><ShoppingCart className="h-4 w-4" /> Visit Billing</Button>
                  <a href={DISCORD_LINK} target="_blank" rel="noopener noreferrer"><Button variant="outline" className="w-full gap-2 text-sm border-primary/30" size="lg"><ExternalLink className="h-4 w-4" /> JOIN DISCORD</Button></a>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BotHosting;
