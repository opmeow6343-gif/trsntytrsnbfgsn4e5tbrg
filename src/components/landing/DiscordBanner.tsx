import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ExternalLink, Users } from "lucide-react";

const DiscordBanner = () => (
  <section className="py-16 px-4">
    <motion.div
      className="max-w-3xl mx-auto relative rounded-2xl overflow-hidden glass gradient-border p-8 sm:p-12 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(235_80%_55%/0.12)] via-transparent to-[hsl(160_100%_45%/0.08)] pointer-events-none" />

      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {/* Discord icon */}
        <motion.div
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[hsl(235_86%_65%/0.15)] mb-5"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 24 24" className="w-7 h-7 text-[hsl(235_86%_65%)]" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z" />
          </svg>
        </motion.div>

        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3 font-display">
          Join the <span className="gradient-text">Community</span>
        </h3>
        <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6 leading-relaxed">
          Connect with 2,000+ gamers, get instant support, share your builds, and stay updated on new features and deals.
        </p>

        <div className="flex items-center justify-center gap-6 mb-8">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">2,000+</span>
            <span className="text-xs text-muted-foreground">Members</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
            </span>
            <span className="text-xs text-muted-foreground">Online now</span>
          </div>
        </div>

        <motion.a
          href="https://discord.gg/pBXUVRne"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size="lg"
            className="glow-primary gap-2 px-8 text-sm font-bold h-12 rounded-xl bg-[hsl(235_86%_65%)] hover:bg-[hsl(235_86%_60%)] text-white"
          >
            <ExternalLink className="h-4 w-4" />
            Join Discord Server
          </Button>
        </motion.a>
      </motion.div>
    </motion.div>
  </section>
);

export default DiscordBanner;
