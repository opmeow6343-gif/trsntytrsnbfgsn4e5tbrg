import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Puzzle, GitBranch, Package } from "lucide-react";

import pluginInstaller from "@/assets/screenshots/plugin-installer.png";
import versionChanger from "@/assets/screenshots/version-changer.png";
import modInstaller from "@/assets/screenshots/mod-installer.png";

const features = [
  {
    id: "plugins",
    label: "Plugin Installer",
    icon: Puzzle,
    image: pluginInstaller,
    title: "One-Click Plugin Installer",
    desc: "Browse and install thousands of Spigot and Modrinth plugins directly from your panel. Search, filter, and manage your plugins without ever touching a file manager.",
  },
  {
    id: "versions",
    label: "Version Changer",
    icon: GitBranch,
    image: versionChanger,
    title: "Instant Version Changer",
    desc: "Switch between Vanilla, Paper, Fabric, Forge, NeoForge, Velocity, and more with a single click. Access hundreds of builds and MC versions effortlessly.",
  },
  {
    id: "mods",
    label: "Mod Installer",
    icon: Package,
    image: modInstaller,
    title: "Built-in Mod Installer",
    desc: "Install Fabric and Forge mods from Modrinth directly in your panel. Browse popular mods like Lithium, FabricAPI, and more — no manual downloads needed.",
  },
];

const FeaturesShowcase = () => {
  return (
    <section className="relative py-28 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-[11px] font-medium text-primary mb-6">
            <Puzzle className="h-3.5 w-3.5" />
            POWERFUL PANEL FEATURES
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter font-display">
            Everything you need,{" "}
            <span className="gradient-text">built-in</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-sm max-w-xl mx-auto">
            Our custom panel comes loaded with tools to manage your server — no SSH or FTP required.
          </p>
        </motion.div>

        <Tabs defaultValue="plugins" className="max-w-5xl mx-auto">
          <div className="flex justify-center mb-8">
            <TabsList className="inline-flex gap-1 bg-secondary/50 p-1 rounded-xl border border-border/50">
              {features.map((f) => (
                <TabsTrigger
                  key={f.id}
                  value={f.id}
                  className="text-xs tracking-wider rounded-lg px-5 py-2.5 gap-2 data-[state=active]:bg-primary/15 data-[state=active]:text-primary"
                >
                  <f.icon className="h-3.5 w-3.5" />
                  {f.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {features.map((f) => (
            <TabsContent key={f.id} value={f.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid md:grid-cols-2 gap-8 items-center"
              >
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold font-display">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      No SSH needed
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      One-click install
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      Auto-updates
                    </span>
                  </div>
                </div>
                <div className="rounded-xl overflow-hidden border border-border/30 shadow-2xl shadow-black/20">
                  <img
                    src={f.image}
                    alt={f.title}
                    className="w-full h-auto"
                    loading="lazy"
                  />
                </div>
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default FeaturesShowcase;
