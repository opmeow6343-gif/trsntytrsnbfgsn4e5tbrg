import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Server, Shield, CreditCard, Zap, MessageCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const faqCategories = [
  {
    title: "General",
    icon: HelpCircle,
    items: [
      { q: "What is ZeyronCloud?", a: "ZeyronCloud is a premium game server hosting provider offering high-performance servers for Minecraft, Palworld, Rust, Valheim, and more. We provide instant setup, DDoS protection, and 24/7 support." },
      { q: "How do I get started?", a: "Simply choose a plan from our hosting pages, complete your order, and your server will be set up within minutes. You can also join our Discord for instant assistance." },
      { q: "What games do you support?", a: "We support Minecraft (Java & Bedrock), Palworld, Rust, Valheim, Terraria, 7 Days to Die, ARK, Satisfactory, Hytale, and more. Check our Games section for the full list." },
      { q: "Do you offer a free trial?", a: "We don't offer free trials, but our starter plans are very affordable. If you're not satisfied, reach out to our support team within 24 hours." },
    ],
  },
  {
    title: "Servers & Performance",
    icon: Server,
    items: [
      { q: "What hardware do your servers use?", a: "Our servers run on enterprise-grade hardware with NVMe SSDs, high-clock-speed CPUs (5.0GHz+), and DDR5 RAM for maximum performance." },
      { q: "Where are your servers located?", a: "We have server locations optimized for low latency. Contact us on Discord for specific location details." },
      { q: "What is your uptime guarantee?", a: "We guarantee 99.99% uptime. Our infrastructure includes redundant power, networking, and automatic failover systems." },
      { q: "Can I upgrade my plan later?", a: "Yes! You can upgrade your plan at any time. Contact our support team and we'll handle the migration seamlessly with zero downtime." },
    ],
  },
  {
    title: "Security & Protection",
    icon: Shield,
    items: [
      { q: "Do you provide DDoS protection?", a: "Yes, all our servers come with enterprise-grade DDoS protection included at no extra cost. We mitigate attacks automatically." },
      { q: "Are my files backed up?", a: "We perform regular backups of your server data. You can also create manual backups at any time through your server panel." },
      { q: "Is my data secure?", a: "Absolutely. We use encrypted connections, secure data centers, and follow industry best practices to keep your data safe." },
    ],
  },
  {
    title: "Billing & Payments",
    icon: CreditCard,
    items: [
      { q: "What payment methods do you accept?", a: "We accept UPI payments through FamPay. Simply place your order and follow the payment instructions." },
      { q: "How does billing work?", a: "We offer monthly billing cycles. Your server remains active as long as your subscription is current." },
      { q: "Can I get a refund?", a: "We offer refunds on a case-by-case basis. Contact our support team within 24 hours of purchase if you're not satisfied." },
      { q: "Do you offer discounts?", a: "Yes! We regularly offer coupon codes and special promotions. Follow us on Discord to stay updated on deals." },
    ],
  },
  {
    title: "Bot Hosting & Boosters",
    icon: Zap,
    items: [
      { q: "What is bot hosting?", a: "We host Discord bots 24/7 so they stay online without you needing to keep your computer running. Just upload your bot code and we handle the rest." },
      { q: "What languages are supported for bots?", a: "We support Node.js (JavaScript/TypeScript) and Python bots. Contact us if you need support for other languages." },
      { q: "What are Discord boosters?", a: "Our booster service provides Discord Nitro boosts for your server at competitive prices, helping you unlock perks and features." },
    ],
  },
];

const FAQPage = () => (
  <div className="min-h-screen bg-background animated-bg">
    <AnimatedBackground />
    <Navbar />
    <main className="pt-24 pb-16 relative z-10">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-primary font-medium mb-4">
            <HelpCircle className="h-3 w-3" /> Frequently Asked Questions
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-black tracking-tight mb-3">
            GOT <span className="text-primary text-glow">QUESTIONS?</span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            Find answers to common questions about our hosting services, billing, and more.
          </p>
        </motion.div>

        {/* FAQ Categories */}
        <div className="space-y-6">
          {faqCategories.map((cat, ci) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: ci * 0.1 }}
              className="glass rounded-xl gradient-border overflow-hidden"
            >
              <div className="flex items-center gap-3 px-6 pt-5 pb-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/12 flex items-center justify-center">
                  <cat.icon className="h-4 w-4 text-primary" />
                </div>
                <h2 className="font-display text-base font-bold">{cat.title}</h2>
              </div>
              <Accordion type="single" collapsible className="px-6 pb-4">
                {cat.items.map((item, i) => (
                  <AccordionItem key={i} value={`${ci}-${i}`} className="border-border/10">
                    <AccordionTrigger className="text-sm font-medium hover:no-underline hover:text-primary transition-colors py-3">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-xs leading-relaxed">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-12 text-center glass rounded-xl gradient-border p-8"
        >
          <MessageCircle className="h-8 w-8 text-primary mx-auto mb-3" />
          <h3 className="font-display text-lg font-bold mb-2">Still have questions?</h3>
          <p className="text-muted-foreground text-xs mb-5">
            Our support team is available 24/7 on Discord. Create a ticket and we'll help you out!
          </p>
          <a href="https://discord.gg/pBXUVRne" target="_blank" rel="noopener noreferrer">
            <Button className="glow-primary gap-2 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
              <ExternalLink className="h-3.5 w-3.5" /> Join Discord
            </Button>
          </a>
        </motion.div>
      </div>
    </main>
    <Footer />
  </div>
);

export default FAQPage;
