import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Copy, Check, Gamepad2, Users, Globe } from "lucide-react";

const ZeyronMCSection = () => {
  const [copied, setCopied] = useState(false);
  const IP = "play.zeyronmc.fun";

  const handleCopy = () => {
    navigator.clipboard.writeText(IP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative py-28 overflow-hidden">
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, hsl(160 100% 45% / 0.06), transparent 70%)" }}
      />

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-[11px] font-medium text-primary mb-6">
            <Gamepad2 className="h-3.5 w-3.5" />
            ZEYRONMC NETWORK
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter font-display mb-4">
            Join <span className="gradient-text">ZeyronMC</span>
          </h2>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto mb-8 leading-relaxed">
            Jump into our official Minecraft network — featuring survival, minigames, and a growing community. Java & Bedrock supported.
          </p>

          <motion.div
            className="inline-flex items-center gap-3 rounded-2xl glass gradient-border px-6 py-4 mb-8"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-left">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Server IP</p>
              <p className="text-lg font-bold font-mono text-primary tracking-wide">{IP}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopy}
              className="gap-1.5 text-xs border-primary/30 hover:bg-primary/10"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied!" : "Copy IP"}
            </Button>
          </motion.div>

          <div className="flex items-center justify-center gap-8 text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              Java & Bedrock
            </span>
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Growing Community
            </span>
            <span className="flex items-center gap-2">
              <Gamepad2 className="h-4 w-4 text-primary" />
              Survival & Minigames
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ZeyronMCSection;
