import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink } from "lucide-react";

const DISCORD_LINK = "https://discord.gg/KWaU6GMmgs";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-28 relative overflow-hidden">
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(160 100% 45% / 0.05), transparent 70%)", top: "20%", left: "5%" }}
        animate={{ y: [0, -30, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-2xl mx-auto text-center rounded-2xl glass gradient-border p-10 md:p-14 overflow-hidden"
        >
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, hsl(160 100% 45% / 0.06), transparent 70%)" }}
            animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="relative z-10">
            <motion.h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter mb-4 font-display">
              Ready to{" "}
              <motion.span className="gradient-text inline-block" whileInView={{ rotateY: [90, 0] }} viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.8 }}>
                Start?
              </motion.span>
            </motion.h2>
            <motion.p className="text-muted-foreground text-sm max-w-md mx-auto mb-8 leading-relaxed">
              Join thousands of gamers on ZeyronCloud. Deploy in under 60 seconds.
            </motion.p>
            <motion.div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}>
                <Button size="lg" onClick={() => window.open("https://client.zeyroncloud.com/register", "_blank")} className="glow-primary gap-2 px-8 text-sm font-bold group rounded-xl h-11 bg-primary text-primary-foreground hover:bg-primary/90 relative overflow-hidden">
                  <span className="shine-line absolute inset-0" />
                  <span className="relative z-10 flex items-center gap-2">
                    Visit Billing
                    <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                      <ArrowRight className="h-4 w-4" />
                    </motion.span>
                  </span>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}>
                <a href={DISCORD_LINK} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="gap-2 px-8 text-sm border-border/30 hover:border-primary/30 rounded-xl h-11">
                    <ExternalLink className="h-4 w-4" /> Discord
                  </Button>
                </a>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-muted-foreground/30 mt-8"
        >
          Owned By <span className="text-muted-foreground/50 font-semibold">Ahamo</span> and <span className="text-muted-foreground/50 font-semibold">Akshit</span>
        </motion.p>
      </div>
    </section>
  );
};

export default CTASection;
