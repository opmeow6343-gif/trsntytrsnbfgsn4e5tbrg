import { motion } from "framer-motion";
import { Terminal, BarChart3, FolderOpen, Database, Settings, Cpu } from "lucide-react";

const panelFeatures = [
  { icon: BarChart3, title: "Real-time Monitoring", desc: "Monitor CPU, memory, disk, and network usage in real-time with detailed metrics." },
  { icon: Terminal, title: "Advanced Console", desc: "Full terminal access with command history, syntax highlighting, and more." },
  { icon: FolderOpen, title: "File Management", desc: "Built-in file manager with drag-and-drop support, file editor, and zip handling." },
  { icon: Database, title: "Database Access", desc: "Direct database management with MySQL support and automated backups." },
  { icon: Settings, title: "One-Click Installer", desc: "Install mods, plugins, and modpacks with a single click from the panel." },
  { icon: Cpu, title: "Resource Control", desc: "Fine-tune CPU, RAM, and storage allocation in real time for optimal performance." },
];

const tabs = ["Console Access", "Mods Installer", "Plugin Installer", "Config & Properties", "Version Changer"];

const ControlPanelSection = () => {
  return (
    <section className="relative py-28 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <motion.span className="text-[10px] font-medium text-primary tracking-[0.25em] uppercase block mb-3 font-mono">
            CONTROL PANEL
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter font-display">
            Powerful Control Panel
            <br />
            <span className="gradient-text">Everything You Need</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-sm max-w-lg mx-auto">
            Manage your servers with our intuitive panel — monitoring, console, files, databases, and more.
          </p>
        </motion.div>

        {/* Panel Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="rounded-2xl glass gradient-border overflow-hidden">
            {/* Tab bar */}
            <div className="flex items-center gap-1 px-4 py-3 border-b border-border/15 overflow-x-auto">
              {tabs.map((tab, i) => (
                <motion.button
                  key={tab}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors ${
                    i === 0
                      ? "bg-primary/10 text-primary border border-primary/15"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  {tab}
                </motion.button>
              ))}
            </div>

            {/* Fake terminal */}
            <div className="p-6 font-mono text-xs space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-primary">gp.zeyroncloud.com</span>
                <span className="text-border">|</span>
                <span>Server Console</span>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="space-y-1.5 pt-2"
              >
                <p className="text-muted-foreground/70">[INFO] Starting minecraft server version 1.21.4</p>
                <p className="text-muted-foreground/70">[INFO] Loading properties</p>
                <p className="text-muted-foreground/70">[INFO] Default game type: SURVIVAL</p>
                <p className="text-primary/70">[INFO] Preparing level "world"</p>
                <p className="text-primary/70">[INFO] Preparing start region for dimension minecraft:overworld</p>
                <p className="text-muted-foreground/70">[INFO] Time elapsed: 2847 ms</p>
                <p className="text-primary font-medium">[INFO] Done (4.218s)! For help, type "help"</p>
                <div className="flex items-center gap-1 pt-1">
                  <span className="text-primary">{'>'}</span>
                  <motion.span
                    className="h-3 w-[2px] bg-primary"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {panelFeatures.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="rounded-xl glass gradient-border p-5 card-hover group"
            >
              <div className="flex items-start gap-3">
                <motion.div
                  className="shrink-0 rounded-lg bg-primary/8 border border-primary/10 p-2"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.4 }}
                >
                  <feature.icon className="h-4 w-4 text-primary" />
                </motion.div>
                <div>
                  <h3 className="font-bold text-sm mb-1 font-display">{feature.title}</h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ControlPanelSection;
