import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import SEOHead from "@/components/SEOHead";
import { Badge } from "@/components/ui/badge";
import { Check, X, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const features = [
  { name: "RAM Options", intel: "2–32 GB", amd: "2–32 GB", premium: "2–32 GB" },
  { name: "CPU", intel: "Intel Xeon", amd: "AMD Ryzen 9", premium: "AMD Ryzen 9 Premium" },
  { name: "Storage", intel: "5 GB/GB NVMe", amd: "5 GB/GB NVMe", premium: "5 GB/GB NVMe" },
  { name: "Price per GB", intel: "₹15/GB", amd: "₹30/GB", premium: "₹45/GB" },
  { name: "DDoS Protection", intel: true, amd: true, premium: true },
  { name: "99.99% Uptime", intel: true, amd: true, premium: true },
  { name: "Auto Backups", intel: true, amd: true, premium: true },
  { name: "Mod Support", intel: true, amd: true, premium: true },
  { name: "Dedicated IP", intel: false, amd: true, premium: true },
  { name: "Priority Support", intel: false, amd: false, premium: true },
  { name: "Custom JAR Upload", intel: true, amd: true, premium: true },
  { name: "Subdomain Included", intel: true, amd: true, premium: true },
  { name: "Instant Setup", intel: true, amd: true, premium: true },
  { name: "Performance Tier", intel: "Standard", amd: "High", premium: "Ultra" },
  { name: "Max Players (32GB)", intel: "500", amd: "500", premium: "500" },
  { name: "Recommended For", intel: "Budget servers", amd: "Modded gameplay", premium: "Competitive / Large" },
];

const plans = [
  { key: "intel" as const, name: "Intel", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20", badge: "bg-green-500/15 text-green-400" },
  { key: "amd" as const, name: "AMD", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", badge: "bg-red-500/15 text-red-400" },
  { key: "premium" as const, name: "Premium", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", badge: "bg-amber-500/15 text-amber-400", icon: Crown },
];

const PlanComparison = () => (
  <div className="min-h-screen bg-background relative">
    <SEOHead title="Compare Plans — ZeyronCloud" description="Compare Intel, AMD, and Premium Minecraft hosting plans side by side." path="/compare" />
    <AnimatedBackground />
    <Navbar />
    <main className="pt-24 pb-16 relative z-10">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-xs text-primary mb-6">COMPARE PLANS</div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-display">
            Side-by-Side <span className="gradient-text">Comparison</span>
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-sm">Find the perfect plan for your server.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-5xl mx-auto overflow-x-auto"
        >
          <table className="w-full border-collapse min-w-[600px]">
            <thead>
              <tr>
                <th className="text-left py-4 px-4 text-xs text-muted-foreground font-medium uppercase tracking-wider">Feature</th>
                {plans.map((p) => (
                  <th key={p.key} className="py-4 px-4 text-center">
                    <Badge className={`text-xs ${p.badge} gap-1`}>
                      {p.icon && <p.icon className="h-3 w-3" />}
                      {p.name}
                    </Badge>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((f, i) => (
                <motion.tr
                  key={f.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.4 }}
                  className="border-t border-border/30 hover:bg-secondary/30 transition-colors"
                >
                  <td className="py-3 px-4 text-xs font-medium text-foreground">{f.name}</td>
                  {(["intel", "amd", "premium"] as const).map((key) => {
                    const val = f[key];
                    return (
                      <td key={key} className="py-3 px-4 text-center text-xs">
                        {val === true ? (
                          <Check className={`h-4 w-4 mx-auto ${plans.find(p => p.key === key)!.color}`} />
                        ) : val === false ? (
                          <X className="h-4 w-4 mx-auto text-muted-foreground/40" />
                        ) : (
                          <span className="text-muted-foreground">{val}</span>
                        )}
                      </td>
                    );
                  })}
                </motion.tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center gap-3 mt-10">
            {plans.map((p) => (
              <Link key={p.key} to="/minecraft-plans">
                <Button variant="outline" size="sm" className={`text-xs gap-1.5 ${p.border} ${p.color} hover:${p.bg}`}>
                  {p.icon && <p.icon className="h-3 w-3" />}
                  View {p.name} Plans
                </Button>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
    <Footer />
  </div>
);

export default PlanComparison;
