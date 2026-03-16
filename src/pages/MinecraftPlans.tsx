import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import CurrencyConverter from "@/components/CurrencyConverter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cpu, HardDrive, Shield, Wifi, MemoryStick, ShoppingCart, Crown, Check } from "lucide-react";
import DiscordOrderDialog from "@/components/DiscordOrderDialog";

interface Plan { ram: string; ramGb: number; price: number; storage: string; players: number; cpu: string; cpuType: string; }

const getPlayers = (r: number) => r <= 4 ? 40 : r <= 8 ? 80 : r <= 16 ? 160 : r <= 24 ? 300 : 500;

const makePlans = (cpuName: string, cpuType: string, pricePerGb: number): Plan[] =>
  [2, 4, 6, 8, 10, 12, 16, 18, 20, 22, 24, 26, 28, 30, 32].map(r => ({
    ram: `${r} GB`, ramGb: r, price: r * pricePerGb,
    storage: `${r * 5} GB NVMe`, players: getPlayers(r),
    cpu: cpuName, cpuType,
  }));

const intelPlans = makePlans("Intel Xeon", "intel", 15);
const amdPlans = makePlans("AMD Ryzen 9", "amd", 30);
const premiumPlans = makePlans("AMD Ryzen 9 Premium", "premium", 45);

const planTheme = {
  intel: { card: "border-green-500/20 bg-gradient-to-br from-green-500/5 to-emerald-500/3", badge: "bg-green-500/15 text-green-400", price: "text-green-400", icon: "text-green-400", btn: "bg-green-500/15 hover:bg-green-500/25 text-green-300 border border-green-500/35" },
  amd: { card: "border-red-500/20 bg-gradient-to-br from-red-500/5 to-orange-500/3", badge: "bg-red-500/15 text-red-400", price: "text-red-400", icon: "text-red-400", btn: "bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/35" },
  premium: { card: "border-amber-500/25 bg-gradient-to-br from-amber-500/6 to-orange-500/3", badge: "bg-amber-500/15 text-amber-400", price: "text-amber-400", icon: "text-amber-400", btn: "bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/35" },
};

const MinecraftPlans = () => {
  const [showDiscord, setShowDiscord] = useState(false);

  const PlanGrid = ({ plans, type }: { plans: Plan[]; type: "intel" | "amd" | "premium" }) => {
    const t = planTheme[type];
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {plans.map((plan, i) => (
          <motion.div key={`${plan.cpuType}-${plan.ramGb}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.025, duration: 0.45, ease: [0.16, 1, 0.3, 1] }} className="group">
            <Card className={`${t.card} h-full card-lift transition-all duration-300`}>
              <CardContent className="p-5 space-y-4 flex flex-col h-full">
                <div className="flex items-center justify-between">
                  <Badge className={`text-xs ${t.badge}`} style={{ fontFamily: "'Outfit', sans-serif" }}>{type === "premium" && <Crown className="h-3 w-3 mr-1" />}{plan.ram}</Badge>
                  <div className="text-right"><span className={`font-extrabold text-2xl ${t.price}`} style={{ fontFamily: "'Outfit', sans-serif" }}>₹{plan.price}</span><span className="text-xs text-muted-foreground">/mo</span></div>
                </div>
                <div className="space-y-2 text-sm flex-1">
                  {[{ icon: Cpu, text: plan.cpu }, { icon: MemoryStick, text: `${plan.ram} DDR4 RAM` }, { icon: HardDrive, text: plan.storage }, { icon: Shield, text: "DDoS Protection" }, { icon: Wifi, text: "99.99% Uptime" }].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground/70 transition-colors"><Icon className={`h-3.5 w-3.5 ${t.icon} shrink-0`} /><span className="text-xs">{text}</span></div>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground"><Check className={`h-3 w-3 ${t.icon}`} />Up to {plan.players} players</div>
                <CurrencyConverter amount={plan.price} />
                <Button onClick={() => setShowDiscord(true)} className={`w-full gap-1.5 text-xs font-semibold tracking-wider ${t.btn}`} variant="outline" size="sm">
                  <ShoppingCart className="h-3.5 w-3.5" /> ORDER NOW
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      <Navbar />
      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-xs text-primary mb-6">MINECRAFT HOSTING</div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>Minecraft <span className="text-primary text-glow">Plans</span></h1>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">Intel for affordability · AMD for performance · Premium for the best.</p>
          </motion.div>
          <Tabs defaultValue="intel" className="max-w-7xl mx-auto">
            <div className="flex justify-center mb-8">
              <TabsList className="inline-flex gap-1 bg-secondary/50 p-1 rounded-xl border border-border/50">
                <TabsTrigger value="intel" className="text-xs tracking-wider rounded-lg data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400 px-4 py-2"><span className="h-2 w-2 rounded-full bg-green-400 inline-block mr-2" />INTEL — ₹15/GB</TabsTrigger>
                <TabsTrigger value="amd" className="text-xs tracking-wider rounded-lg data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400 px-4 py-2"><span className="h-2 w-2 rounded-full bg-red-400 inline-block mr-2" />AMD — ₹30/GB</TabsTrigger>
                <TabsTrigger value="premium" className="text-xs tracking-wider rounded-lg data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400 px-4 py-2"><Crown className="h-3 w-3 mr-2" />PREMIUM — ₹45/GB</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="intel"><PlanGrid plans={intelPlans} type="intel" /></TabsContent>
            <TabsContent value="amd"><PlanGrid plans={amdPlans} type="amd" /></TabsContent>
            <TabsContent value="premium"><PlanGrid plans={premiumPlans} type="premium" /></TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
      <DiscordOrderDialog open={showDiscord} onOpenChange={setShowDiscord} />
    </div>
  );
};

export default MinecraftPlans;
