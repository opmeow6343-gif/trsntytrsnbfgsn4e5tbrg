import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Server, Cpu, HardDrive, MemoryStick, Zap, ExternalLink, Gift, Shield, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { supabase } from "@/integrations/supabase/client";

const specs = [
  { icon: MemoryStick, label: "RAM", value: "4 GB", desc: "DDR4 ECC Memory" },
  { icon: Cpu, label: "CPU", value: "200%", desc: "vCPU Performance" },
  { icon: HardDrive, label: "Storage", value: "20 GB", desc: "NVMe SSD Disk" },
];

const steps = [
  { num: "01", title: "Join Our Discord", desc: "Click the button below to join the ZeyronCloud Discord server." },
  { num: "02", title: "Create a Ticket", desc: "Open a support ticket in the #create-ticket channel." },
  { num: "03", title: "Request Free Server", desc: "Mention you'd like to claim the free server plan." },
  { num: "04", title: "Get Your Server!", desc: "Our team will set up your server within minutes." },
];

const FreeServer = () => {
  const [enabled, setEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "free_server_enabled")
      .maybeSingle()
      .then(({ data }) => {
        setEnabled(data?.value === "true");
      });
  }, []);

  if (enabled === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!enabled) {
    return (
      <>
        <SEOHead title="Free Server - ZeyronCloud" description="Free Minecraft server hosting by ZeyronCloud" />
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-background pt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md mx-auto px-4"
          >
            <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
              <Server className="h-8 w-8 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold font-display mb-3">Currently Unavailable</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              The free server program is currently paused. Join our Discord to get notified when it's back!
            </p>
            <a href="https://discord.gg/zeyron" target="_blank" rel="noopener noreferrer" className="mt-6 inline-block">
              <Button className="gap-2">
                <ExternalLink className="h-4 w-4" /> Join Discord
              </Button>
            </a>
          </motion.div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEOHead title="Free Server - ZeyronCloud" description="Get a free 4GB RAM Minecraft server from ZeyronCloud" />
      <Navbar />
      <main className="min-h-screen bg-background pt-20 pb-16">
        {/* Hero */}
        <section className="py-20 relative overflow-hidden">
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full pointer-events-none -top-40 -right-40"
            style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.08), transparent 70%)" }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-primary/20 text-primary text-xs font-semibold mb-6"
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Gift className="h-3.5 w-3.5" /> Limited Time Offer
              </motion.div>
              <h1 className="text-4xl md:text-6xl font-extrabold font-display tracking-tighter mb-5">
                Get a <span className="gradient-text">Free Server</span>
              </h1>
              <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto leading-relaxed mb-10">
                Start your Minecraft journey with a powerful free server. No credit card required — just join our Discord and create a ticket!
              </p>
            </motion.div>

            {/* Specs Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-16">
              {specs.map((spec, i) => (
                <motion.div
                  key={spec.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <Card className="glass border-border/30 card-hover text-center">
                    <CardContent className="pt-6 pb-5 px-4">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                        <spec.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-2xl font-extrabold font-display gradient-text mb-1">{spec.value}</div>
                      <div className="text-xs font-semibold text-foreground mb-0.5">{spec.label}</div>
                      <div className="text-[10px] text-muted-foreground">{spec.desc}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How to Claim */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-extrabold font-display tracking-tighter mb-3">
                How to <span className="gradient-text">Claim</span>
              </h2>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Follow these simple steps to get your free server up and running.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {steps.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="glass border-border/30 card-hover h-full">
                    <CardContent className="pt-6 pb-5 px-5">
                      <div className="text-3xl font-black font-display gradient-text mb-3 opacity-40">{step.num}</div>
                      <h3 className="font-bold text-sm mb-1.5">{step.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <a href="https://discord.gg/zeyron" target="_blank" rel="noopener noreferrer">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="glow-primary gap-2.5 px-10 text-sm font-bold rounded-xl h-12 bg-primary text-primary-foreground hover:bg-primary/90">
                    <ExternalLink className="h-4 w-4" /> Join Discord & Claim Now
                  </Button>
                </motion.div>
              </a>
              <p className="text-[10px] text-muted-foreground mt-3">
                Servers are subject to availability. One free server per user.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {[
                { icon: Shield, title: "DDoS Protected", desc: "Enterprise-grade protection included" },
                { icon: Clock, title: "24/7 Uptime", desc: "Your server stays online always" },
                { icon: Users, title: "Active Community", desc: "Get help from our Discord community" },
              ].map((b, i) => (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="glass border-border/30 text-center card-hover">
                    <CardContent className="pt-5 pb-4 px-4">
                      <b.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                      <h3 className="font-bold text-xs mb-1">{b.title}</h3>
                      <p className="text-[10px] text-muted-foreground">{b.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default FreeServer;
