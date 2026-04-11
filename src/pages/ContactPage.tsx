import { motion } from "framer-motion";
import { MessageCircle, Mail, ExternalLink, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import SEOHead from "@/components/SEOHead";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-background animated-bg">
      <SEOHead title="Contact Us — ZeyronCloud" description="Get in touch with ZeyronCloud support via Discord or email." path="/contact" />
      <AnimatedBackground />
      <Navbar />
      <main className="pt-28 pb-20 relative z-10">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-xs text-primary mb-6 font-mono tracking-widest">
              SUPPORT
            </div>
            <h1 className="font-display text-3xl font-black tracking-tight md:text-5xl mb-3">
              CONTACT <span className="gradient-text">US</span>
            </h1>
            <p className="text-muted-foreground text-sm">We're here to help. Choose your preferred way to reach us.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Discord */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl glass gradient-border p-8 flex flex-col items-center text-center gap-4"
            >
              <div className="h-14 w-14 rounded-2xl bg-[#5865F2]/15 border border-[#5865F2]/20 flex items-center justify-center">
                <MessageCircle className="h-7 w-7 text-[#5865F2]" />
              </div>
              <h2 className="font-display text-lg font-bold">Discord Tickets</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Open a support ticket on our Discord server for the fastest response. Our team is available 24/7.
              </p>
              <div className="inline-flex items-center gap-1.5 text-xs text-primary/70 bg-primary/5 rounded-full px-3 py-1 border border-primary/10">
                <Users className="h-3 w-3" />
                Recommended
              </div>
              <a href="https://discord.gg/BdFNqyNuKD" target="_blank" rel="noopener noreferrer" className="w-full mt-auto">
                <Button className="w-full gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white">
                  <MessageCircle className="h-4 w-4" />
                  Open Discord Ticket
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </a>
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl glass gradient-border p-8 flex flex-col items-center text-center gap-4"
            >
              <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Mail className="h-7 w-7 text-primary" />
              </div>
              <h2 className="font-display text-lg font-bold">Email Support</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Send us an email and we'll get back to you within 24 hours. For billing and general inquiries.
              </p>
              <div className="text-xs text-muted-foreground/50 bg-muted/30 rounded-full px-3 py-1 border border-border/10">
                Response within 24h
              </div>
              <a href="mailto:support@zeyroncloud.com" className="w-full mt-auto">
                <Button variant="outline" className="w-full gap-2">
                  <Mail className="h-4 w-4" />
                  support@zeyroncloud.com
                </Button>
              </a>
            </motion.div>
          </div>

          {/* Founder credit */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-16 pt-8 border-t border-border/10"
          >
            <p className="text-xs text-muted-foreground/40">
              Owned By <span className="text-foreground/60 font-semibold">Ahamo</span> and <span className="text-foreground/60 font-semibold">Akshit</span>
            </p>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
