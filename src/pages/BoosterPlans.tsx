import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Zap, Crown, MemoryStick, HardDrive, Cpu, Shield, Gift, Wifi, Check, XCircle } from "lucide-react";
import { getSettings } from "@/lib/storage";
import DiscordOrderDialog from "@/components/DiscordOrderDialog";

const boosterPlans = [
  {
    boosts: 1, ram: "4 GB", disk: "20 GB", cpu: "200%", icon: Zap,
    gradient: "from-purple-500/15 to-pink-500/15", borderColor: "border-purple-500/40",
    iconColor: "text-purple-400", badgeClass: "bg-purple-500/20 text-purple-300",
    btnClass: "bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40",
    features: ["4 GB DDR4 RAM", "20 GB NVMe Storage", "200% CPU Power", "DDoS Protection", "24/7 Support", "Priority Queue", "Booster Role"],
  },
  {
    boosts: 2, ram: "8 GB", disk: "40 GB", cpu: "300%", icon: Crown,
    gradient: "from-amber-500/15 to-orange-500/15", borderColor: "border-amber-500/40",
    iconColor: "text-amber-400", badgeClass: "bg-amber-500/20 text-amber-300",
    btnClass: "bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40",
    features: ["8 GB DDR4 RAM", "40 GB NVMe Storage", "300% CPU Power", "DDoS Protection", "24/7 Priority Support", "Dedicated Resources", "Custom Subdomain", "Booster Role"],
  },
];

const mediaPlans = [
  { name: "Content Creator", requirement: "500+ followers", ram: "2 GB", storage: "10 GB", features: ["Free 2 GB server", "Featured on website", "Creator Discord role"] },
  { name: "YouTuber / Streamer", requirement: "1000+ subscribers", ram: "4 GB", storage: "20 GB", features: ["Free 4 GB server", "Sponsor spotlight", "Priority support", "Custom branding"] },
];

const BoosterPlans = () => {
  const [showDiscord, setShowDiscord] = useState(false);
  const [boosterEnabled, setBoosterEnabled] = useState(true);
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    getSettings().then(s => {
      setBoosterEnabled(s.boosterPerksEnabled !== "false");
      setLoadingSettings(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      <Navbar />
      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
            <Badge className="bg-purple-500/20 text-purple-400 mb-4 text-xs tracking-wider border border-purple-500/30">
              <Sparkles className="h-3 w-3 mr-1" /> FREE HOSTING
            </Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Booster & <span className="text-purple-400" style={{ textShadow: "0 0 20px rgb(168 85 247 / 0.5)" }}>Media</span> Plans
            </h1>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Boost our Discord or create content to unlock free game server hosting!
            </p>
          </motion.div>

          {!loadingSettings && !boosterEnabled && (
            <div className="rounded-xl bg-destructive/10 border border-destructive/30 px-6 py-5 mb-8 flex items-center gap-3">
              <XCircle className="h-5 w-5 text-destructive shrink-0" />
              <div>
                <p className="font-semibold text-sm text-destructive">Booster Perks Disabled</p>
                <p className="text-xs text-muted-foreground mt-0.5">Temporarily unavailable. Check back later!</p>
              </div>
            </div>
          )}

          <div className="mb-4 flex items-center gap-3">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <h2 className="text-sm font-bold tracking-wider text-purple-400 uppercase" style={{ fontFamily: "'Outfit', sans-serif" }}>Discord Boost Perks</h2>
            <div className="flex-1 h-px bg-purple-500/20" />
          </div>

          <div className={`grid gap-6 md:grid-cols-2 mb-14 ${!boosterEnabled ? "opacity-50 pointer-events-none" : ""}`}>
            {boosterPlans.map((plan, i) => (
              <motion.div key={plan.boosts} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className={`${plan.borderColor} bg-gradient-to-br ${plan.gradient} backdrop-blur-sm h-full card-lift`}>
                  <CardContent className="p-6 flex flex-col gap-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl p-2.5 bg-background/40"><plan.icon className={`h-6 w-6 ${plan.iconColor}`} /></div>
                        <div>
                          <div className="font-bold text-base tracking-wider" style={{ fontFamily: "'Outfit', sans-serif" }}>{plan.boosts} BOOST{plan.boosts > 1 ? "S" : ""}</div>
                          <div className="text-xs text-muted-foreground">Discord Server Boost</div>
                        </div>
                      </div>
                      <Badge className={`${plan.badgeClass} text-xs border border-current/20`}>FREE</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[{ icon: MemoryStick, label: `${plan.ram} DDR4 RAM` }, { icon: HardDrive, label: `${plan.disk} NVMe` }, { icon: Cpu, label: `${plan.cpu} CPU` }, { icon: Shield, label: "DDoS Protected" }, { icon: Wifi, label: "99.99% Uptime" }, { icon: Zap, label: "Instant Deploy" }].map(({ icon: Icon, label }) => (
                        <div key={label} className="flex items-center gap-1.5 text-xs text-muted-foreground bg-background/30 rounded-lg px-2.5 py-2">
                          <Icon className={`h-3 w-3 ${plan.iconColor} shrink-0`} />{label}
                        </div>
                      ))}
                    </div>
                    <ul className="space-y-1.5">
                      {plan.features.map(f => (<li key={f} className="text-xs text-muted-foreground flex items-center gap-2"><Check className={`h-3 w-3 ${plan.iconColor} shrink-0`} />{f}</li>))}
                    </ul>
                    <Button onClick={() => setShowDiscord(true)} className={`w-full gap-2 text-xs font-semibold ${plan.btnClass}`} variant="outline">
                      <Gift className="h-3.5 w-3.5" /> CLAIM NOW
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mb-4 flex items-center gap-3">
            <Sparkles className="h-4 w-4 text-pink-400" />
            <h2 className="text-sm font-bold tracking-wider text-pink-400 uppercase" style={{ fontFamily: "'Outfit', sans-serif" }}>Media & Creator Plans</h2>
            <div className="flex-1 h-px bg-pink-500/20" />
          </div>

          <div className={`grid gap-6 md:grid-cols-2 ${!boosterEnabled ? "opacity-50 pointer-events-none" : ""}`}>
            {mediaPlans.map((plan, i) => (
              <motion.div key={plan.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
                <Card className="border-pink-500/30 bg-gradient-to-br from-pink-500/10 to-rose-500/10 backdrop-blur-sm h-full card-lift">
                  <CardContent className="p-6 flex flex-col gap-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-sm tracking-wider" style={{ fontFamily: "'Outfit', sans-serif" }}>{plan.name.toUpperCase()}</div>
                        <div className="text-xs text-muted-foreground italic mt-0.5">Requirement: {plan.requirement}</div>
                      </div>
                      <Badge className="bg-pink-500/20 text-pink-300 text-xs border border-pink-500/20">FREE</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[{ icon: MemoryStick, label: `${plan.ram} DDR4 RAM` }, { icon: HardDrive, label: `${plan.storage} NVMe` }, { icon: Shield, label: "DDoS Protected" }, { icon: Wifi, label: "99.99% Uptime" }].map(({ icon: Icon, label }) => (
                        <div key={label} className="flex items-center gap-1.5 text-xs text-muted-foreground bg-background/30 rounded-lg px-2.5 py-2">
                          <Icon className="h-3 w-3 text-pink-400 shrink-0" />{label}
                        </div>
                      ))}
                    </div>
                    <ul className="space-y-1.5">
                      {plan.features.map(f => (<li key={f} className="text-xs text-muted-foreground flex items-center gap-2"><Check className="h-3 w-3 text-pink-400 shrink-0" />{f}</li>))}
                    </ul>
                    <Button onClick={() => setShowDiscord(true)} className="w-full gap-2 text-xs font-semibold bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/40" variant="outline">
                      <Gift className="h-3.5 w-3.5" /> APPLY NOW
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <DiscordOrderDialog open={showDiscord} onOpenChange={setShowDiscord} />
    </div>
  );
};

export default BoosterPlans;
