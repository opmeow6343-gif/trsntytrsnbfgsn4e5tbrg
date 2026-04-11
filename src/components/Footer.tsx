import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import logo from "@/assets/zeyroncloud-logo.png";
import { ExternalLink, Heart } from "lucide-react";

const DISCORD_LINK = "https://discord.gg/KWaU6GMmgs";

const colVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
  }),
};

const Footer = () => (
  <footer className="border-t border-border/8 bg-surface/50 backdrop-blur-sm py-14 overflow-hidden">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4 mb-10">
        <motion.div custom={0} variants={colVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="col-span-2 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-3 group">
            <motion.img src={logo} alt="ZeyronCloud" className="h-7 w-7 rounded-lg" whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }} transition={{ duration: 0.4 }} />
            <span className="font-bold text-sm font-display">Zeyron<span className="gradient-text">Cloud</span></span>
          </Link>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px]">Premium game server hosting. Fast, reliable, affordable. Trusted by thousands of gamers worldwide.</p>
        </motion.div>

        {[
          { title: "Hosting", links: [{ label: "Minecraft", to: "/minecraft-plans" }, { label: "Bot Hosting", to: "/bot-plans" }, { label: "MC Configurator", to: "/minecraft-hosting" }, { label: "Bot Configurator", to: "/bot-hosting" }] },
          { title: "Resources", links: [{ label: "MC Tools", to: "/tools" }, { label: "News", to: "/news" }, { label: "FAQ", to: "/faq" }, { label: "Terms", to: "/tos" }] },
          { title: "Connect", links: [
            { label: "Discord", to: DISCORD_LINK, external: true },
            { label: "YouTube", to: "https://www.youtube.com/@ZeyronCloud", external: true },
            { label: "Game Panel", to: "https://gp.zeyroncloud.com", external: true },
            { label: "Client Area", to: "https://client.zeyroncloud.com", external: true },
            { label: "Contact Us", to: "/contact" },
            { label: "Sign In", to: "/auth" },
          ] },
        ].map((col, ci) => (
          <motion.div key={col.title} custom={ci + 1} variants={colVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-[9px] font-bold tracking-[0.2em] text-muted-foreground/35 mb-3 uppercase font-mono">{col.title}</p>
            <div className="space-y-2">
              {col.links.map((link) =>
                (link as any).external ? (
                  <motion.a key={link.label} href={link.to} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors" whileHover={{ x: 4 }}>
                    <ExternalLink className="h-3 w-3" /> {link.label}
                  </motion.a>
                ) : (
                  <motion.div key={link.label} whileHover={{ x: 4 }}>
                    <Link to={link.to} className="block text-xs text-muted-foreground hover:text-primary transition-colors">{link.label}</Link>
                  </motion.div>
                )
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div className="pt-5 border-t border-border/8 flex flex-col sm:flex-row items-center justify-between gap-2" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.6 }}>
        <p className="text-[10px] text-muted-foreground/25">© {new Date().getFullYear()} ZeyronCloud</p>
        <p className="text-[10px] text-muted-foreground/20 flex items-center gap-1">
          Owned By <span className="text-muted-foreground/40 font-semibold">Ahamo</span> & <span className="text-muted-foreground/40 font-semibold">Akshit</span>
          <span className="mx-1">•</span>
          Made with{" "}
          <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <Heart className="h-2.5 w-2.5 text-primary/30" />
          </motion.span>{" "}
          for gamers
        </p>
      </motion.div>
    </div>
  </footer>
);

export default Footer;
