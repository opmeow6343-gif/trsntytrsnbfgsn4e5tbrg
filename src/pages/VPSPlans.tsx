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
import { Cpu, HardDrive, Shield, Wifi, MemoryStick, ShoppingCart, Crown, Check, Server, Zap } from "lucide-react";
import CheckoutDialog, { CheckoutPlan } from "@/components/CheckoutDialog";

interface VPSPlan {
  name: string;
  cpu: string;
  cores: string;
  ram: string;
  ramType: string;
  storage: string;
  price: number;
}

// Intel Gold Series
const intelGoldPlans: VPSPlan[] = [
  { name: "Gold 4vC-16GB", cpu: "Xeon Gold 6338", cores: "4 vCores", ram: "16GB", ramType: "DDR4 3200MT/s", storage: "64GB NVMe SSD", price: 550 },
  { name: "Gold 8vC-32GB", cpu: "Xeon Gold 6338", cores: "8 vCores", ram: "32GB", ramType: "DDR4 3200MT/s", storage: "128GB NVMe SSD", price: 800 },
  { name: "Gold 8vC-64GB", cpu: "Xeon Gold 6338", cores: "8 vCores", ram: "64GB", ramType: "DDR4 3200MT/s", storage: "256GB NVMe SSD", price: 1300 },
];

// Intel Platinum Series
const intelPlatinumPlans: VPSPlan[] = [
  { name: "Platinum 4vC-16GB", cpu: "Xeon Platinum 8375C", cores: "4 vCores", ram: "16GB", ramType: "DDR4 3200MT/s", storage: "64GB NVMe SSD", price: 750 },
  { name: "Platinum 8vC-32GB", cpu: "Xeon Platinum 8375C", cores: "8 vCores", ram: "32GB", ramType: "DDR4 3200MT/s", storage: "128GB NVMe SSD", price: 1000 },
  { name: "Platinum 8vC-64GB", cpu: "Xeon Platinum 8375C", cores: "8 vCores", ram: "64GB", ramType: "DDR4 3200MT/s", storage: "256GB NVMe SSD", price: 1500 },
];

// Intel MAX Performance
const intelMaxPlans: VPSPlan[] = [
  { name: "MAX 4vC-16GB", cpu: "Xeon Platinum 8468", cores: "4 vCores", ram: "16GB", ramType: "DDR5 4800MT/s", storage: "64GB NVMe SSD", price: 900 },
  { name: "MAX 8vC-32GB", cpu: "Xeon Platinum 8468", cores: "8 vCores", ram: "32GB", ramType: "DDR5 4800MT/s", storage: "128GB NVMe SSD", price: 1150 },
  { name: "MAX 8vC-64GB", cpu: "Xeon Platinum 8468", cores: "8 vCores", ram: "64GB", ramType: "DDR5 4800MT/s", storage: "256GB NVMe SSD", price: 1600 },
];

// AMD EPYC 7 Series
const amdEpyc7Plans: VPSPlan[] = [
  { name: "EPYC7 4vC-16GB", cpu: "AMD EPYC 7763", cores: "4 vCores", ram: "16GB", ramType: "DDR4 3200MT/s", storage: "64GB NVMe SSD", price: 800 },
  { name: "EPYC7 8vC-32GB", cpu: "AMD EPYC 7763", cores: "8 vCores", ram: "32GB", ramType: "DDR4 3200MT/s", storage: "128GB NVMe SSD", price: 1050 },
  { name: "EPYC7 8vC-64GB", cpu: "AMD EPYC 7763", cores: "8 vCores", ram: "64GB", ramType: "DDR4 3200MT/s", storage: "256GB NVMe SSD", price: 1200 },
];

// AMD EPYC 9 Series
const amdEpyc9Plans: VPSPlan[] = [
  { name: "EPYC9 4vC-16GB", cpu: "AMD EPYC 9V74", cores: "4 vCores", ram: "16GB", ramType: "DDR5 4800MT/s", storage: "64GB NVMe SSD", price: 900 },
  { name: "EPYC9 8vC-32GB", cpu: "AMD EPYC 9V74", cores: "8 vCores", ram: "32GB", ramType: "DDR5 4800MT/s", storage: "128GB NVMe SSD", price: 1100 },
  { name: "EPYC9 8vC-64GB", cpu: "AMD EPYC 9V74", cores: "8 vCores", ram: "64GB", ramType: "DDR5 4800MT/s", storage: "256GB NVMe SSD", price: 1500 },
];

// AMD EPYC 9 Ultimate
const amdUltimatePlans: VPSPlan[] = [
  { name: "Ultimate 4vC-16GB", cpu: "AMD EPYC 9V45", cores: "4 vCores", ram: "16GB", ramType: "DDR5 6400MT/s", storage: "64GB NVMe SSD", price: 1000 },
  { name: "Ultimate 8vC-32GB", cpu: "AMD EPYC 9V45", cores: "8 vCores", ram: "32GB", ramType: "DDR5 6400MT/s", storage: "128GB NVMe SSD", price: 1250 },
  { name: "Ultimate 8vC-64GB", cpu: "AMD EPYC 9V45", cores: "8 vCores", ram: "64GB", ramType: "DDR5 6400MT/s", storage: "256GB NVMe SSD", price: 1600 },
];

type ThemeKey = "gold" | "platinum" | "max" | "epyc7" | "epyc9" | "ultimate";

const themes: Record<ThemeKey, { card: string; badge: string; price: string; icon: string; btn: string; label: string }> = {
  gold: { card: "border-yellow-500/20 bg-gradient-to-br from-yellow-500/5 to-amber-500/3", badge: "bg-yellow-500/15 text-yellow-400", price: "text-yellow-400", icon: "text-yellow-400", btn: "bg-yellow-500/15 hover:bg-yellow-500/25 text-yellow-300 border border-yellow-500/35", label: "GOLD" },
  platinum: { card: "border-slate-400/20 bg-gradient-to-br from-slate-400/5 to-zinc-400/3", badge: "bg-slate-400/15 text-slate-300", price: "text-slate-300", icon: "text-slate-300", btn: "bg-slate-400/15 hover:bg-slate-400/25 text-slate-200 border border-slate-400/35", label: "PLATINUM" },
  max: { card: "border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-cyan-500/3", badge: "bg-blue-500/15 text-blue-400", price: "text-blue-400", icon: "text-blue-400", btn: "bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/35", label: "MAX" },
  epyc7: { card: "border-red-500/20 bg-gradient-to-br from-red-500/5 to-orange-500/3", badge: "bg-red-500/15 text-red-400", price: "text-red-400", icon: "text-red-400", btn: "bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/35", label: "EPYC 7" },
  epyc9: { card: "border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-violet-500/3", badge: "bg-purple-500/15 text-purple-400", price: "text-purple-400", icon: "text-purple-400", btn: "bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/35", label: "EPYC 9" },
  ultimate: { card: "border-amber-500/25 bg-gradient-to-br from-amber-500/6 to-orange-500/3", badge: "bg-amber-500/15 text-amber-400", price: "text-amber-400", icon: "text-amber-400", btn: "bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/35", label: "ULTIMATE" },
};

const VPSPlans = () => {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<CheckoutPlan | null>(null);

  const openCheckout = (plan: VPSPlan, tier: string) => {
    setSelectedPlan({
      name: `VPS ${tier} — ${plan.cores} / ${plan.ram}`,
      type: "vps",
      ram: plan.ram,
      cpu: `${plan.cpu} (${plan.cores})`,
      storage: plan.storage,
      price: plan.price,
    });
    setCheckoutOpen(true);
  };

  const PlanGrid = ({ plans, theme, tier }: { plans: VPSPlan[]; theme: ThemeKey; tier: string }) => {
    const t = themes[theme];
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan, i) => (
          <motion.div key={plan.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.45, ease: [0.16, 1, 0.3, 1] }} className="group">
            <Card className={`${t.card} h-full card-lift transition-all duration-300`}>
              <CardContent className="p-5 space-y-4 flex flex-col h-full">
                <div className="flex items-center justify-between">
                  <Badge className={`text-xs ${t.badge}`} style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {theme === "ultimate" && <Crown className="h-3 w-3 mr-1" />}
                    {theme === "max" && <Zap className="h-3 w-3 mr-1" />}
                    {plan.ram} RAM
                  </Badge>
                  <div className="text-right">
                    <span className={`font-extrabold text-2xl ${t.price}`} style={{ fontFamily: "'Outfit', sans-serif" }}>₹{plan.price}</span>
                    <span className="text-xs text-muted-foreground">/mo</span>
                  </div>
                </div>
                <div className="space-y-2 text-sm flex-1">
                  {[
                    { icon: Cpu, text: plan.cpu },
                    { icon: Server, text: plan.cores },
                    { icon: MemoryStick, text: `${plan.ram} ${plan.ramType}` },
                    { icon: HardDrive, text: plan.storage },
                    { icon: Shield, text: "DDoS Protection" },
                    { icon: Wifi, text: "99.99% Uptime" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground/70 transition-colors">
                      <Icon className={`h-3.5 w-3.5 ${t.icon} shrink-0`} />
                      <span className="text-xs">{text}</span>
                    </div>
                  ))}
                </div>
                <CurrencyConverter amount={plan.price} />
                <Button onClick={() => openCheckout(plan, tier)} className={`w-full gap-1.5 text-xs font-semibold tracking-wider ${t.btn}`} variant="outline" size="sm">
                  <ShoppingCart className="h-3.5 w-3.5" /> ORDER NOW
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  };

  const SectionHeader = ({ title, subtitle, theme }: { title: string; subtitle: string; theme: ThemeKey }) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 mt-10 first:mt-0">
      <Badge className={`text-[10px] tracking-widest mb-2 ${themes[theme].badge}`}>{themes[theme].label}</Badge>
      <h2 className="text-xl font-bold tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>{title}</h2>
      <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      <Navbar />
      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-xs text-primary mb-6">ZEYRONCLOUD VPS</div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
              VPS <span className="text-primary text-glow">Plans</span>
            </h1>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">Enterprise-grade Intel & AMD VPS hosting with NVMe storage, DDoS protection & 99.99% uptime.</p>
          </motion.div>

          <Tabs defaultValue="intel" className="max-w-5xl mx-auto">
            <div className="flex justify-center mb-8">
              <TabsList className="inline-flex gap-1 bg-secondary/50 p-1 rounded-xl border border-border/50">
                <TabsTrigger value="intel" className="text-xs tracking-wider rounded-lg data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400 px-5 py-2">
                  <span className="h-2 w-2 rounded-full bg-blue-400 inline-block mr-2" />INTEL
                </TabsTrigger>
                <TabsTrigger value="amd" className="text-xs tracking-wider rounded-lg data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400 px-5 py-2">
                  <span className="h-2 w-2 rounded-full bg-red-400 inline-block mr-2" />AMD
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="intel">
              <SectionHeader title="Intel Gold Series" subtitle="Xeon Gold 6338 · DDR4 3200MT/s · Budget Performance" theme="gold" />
              <PlanGrid plans={intelGoldPlans} theme="gold" tier="Intel Gold" />

              <SectionHeader title="Intel Platinum" subtitle="Xeon Platinum 8375C · DDR4 3200MT/s · High Performance" theme="platinum" />
              <PlanGrid plans={intelPlatinumPlans} theme="platinum" tier="Intel Platinum" />

              <SectionHeader title="MAX Performance" subtitle="Xeon Platinum 8468 · DDR5 4800MT/s · Peak Intel Power" theme="max" />
              <PlanGrid plans={intelMaxPlans} theme="max" tier="Intel MAX" />
            </TabsContent>

            <TabsContent value="amd">
              <SectionHeader title="AMD EPYC 7 Series" subtitle="EPYC 7763 · DDR4 3200MT/s · Solid Multi-threaded Power" theme="epyc7" />
              <PlanGrid plans={amdEpyc7Plans} theme="epyc7" tier="AMD EPYC 7" />

              <SectionHeader title="AMD EPYC 9 Series" subtitle="EPYC 9V74 · DDR5 4800MT/s · Next-gen Efficiency" theme="epyc9" />
              <PlanGrid plans={amdEpyc9Plans} theme="epyc9" tier="AMD EPYC 9" />

              <SectionHeader title="Ultimate Performance" subtitle="EPYC 9V45 · DDR5 6400MT/s · Maximum AMD Power" theme="ultimate" />
              <PlanGrid plans={amdUltimatePlans} theme="ultimate" tier="AMD Ultimate" />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
      <CheckoutDialog open={checkoutOpen} onOpenChange={setCheckoutOpen} plan={selectedPlan} />
    </div>
  );
};

export default VPSPlans;
