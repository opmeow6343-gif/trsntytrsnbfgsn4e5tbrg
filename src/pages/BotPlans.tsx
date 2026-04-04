import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import CurrencyConverter from "@/components/CurrencyConverter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, HardDrive, Shield, Wifi, MemoryStick, ShoppingCart } from "lucide-react";


const botPlans = [
  { ram: "512 MB", ramMb: 512, price: 25, storage: "2.5 GB NVMe" },
  { ram: "1 GB", ramMb: 1024, price: 50, storage: "5 GB NVMe" },
  { ram: "1.5 GB", ramMb: 1536, price: 75, storage: "7.5 GB NVMe" },
  { ram: "2 GB", ramMb: 2048, price: 100, storage: "10 GB NVMe" },
  { ram: "2.5 GB", ramMb: 2560, price: 125, storage: "12.5 GB NVMe" },
  { ram: "3 GB", ramMb: 3072, price: 150, storage: "15 GB NVMe" },
  { ram: "3.5 GB", ramMb: 3584, price: 175, storage: "17.5 GB NVMe" },
  { ram: "4 GB", ramMb: 4096, price: 200, storage: "20 GB NVMe" },
  { ram: "4.5 GB", ramMb: 4608, price: 225, storage: "22.5 GB NVMe" },
  { ram: "5 GB", ramMb: 5120, price: 250, storage: "25 GB NVMe" },
  { ram: "5.5 GB", ramMb: 5632, price: 275, storage: "27.5 GB NVMe" },
  { ram: "6 GB", ramMb: 6144, price: 300, storage: "30 GB NVMe" },
];

const BotPlans = () => {
  const BILLING_URL = "https://billing.zeyroncloud.com";

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      <Navbar />
      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-xs text-primary mb-6">BOT HOSTING</div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>Bot Hosting <span className="text-primary text-glow">Plans</span></h1>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Starting at ₹25/512 MB. All plans include DDR4 RAM, NVMe storage, 99.99% uptime & DDoS protection.</p>
          </motion.div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto">
            {botPlans.map((plan, i) => (
              <motion.div key={plan.ramMb} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03, duration: 0.45 }} className="group">
                <Card className="border-primary/15 bg-gradient-to-br from-primary/5 to-cyan-500/3 h-full card-lift">
                  <CardContent className="p-5 space-y-4 flex flex-col h-full">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-primary/15 text-primary text-xs">{plan.ram}</Badge>
                      <div className="text-right"><span className="font-extrabold text-2xl text-primary" style={{ fontFamily: "'Outfit', sans-serif" }}>₹{plan.price}</span><span className="text-xs text-muted-foreground">/mo</span></div>
                    </div>
                    <div className="space-y-2 text-sm flex-1">
                      {[{ icon: Bot, text: "Optimized for Discord Bots" }, { icon: MemoryStick, text: `${plan.ram} DDR4 RAM` }, { icon: HardDrive, text: plan.storage }, { icon: Shield, text: "DDoS Protection" }, { icon: Wifi, text: "99.99% Uptime" }].map(({ icon: Icon, text }) => (
                        <div key={text} className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground/70 transition-colors"><Icon className="h-3.5 w-3.5 text-primary shrink-0" /><span className="text-xs">{text}</span></div>
                      ))}
                    </div>
                    <CurrencyConverter amount={plan.price} />
                    <Button onClick={() => window.open(BILLING_URL, "_blank")} className="w-full glow-primary gap-1.5 text-xs font-semibold" size="sm">
                      <ShoppingCart className="h-3.5 w-3.5" /> ORDER NOW
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

export default BotPlans;
