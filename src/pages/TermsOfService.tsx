import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import SEOHead from "@/components/SEOHead";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background animated-bg">
      <SEOHead title="Terms of Service — ZeyronCloud" description="ZeyronCloud terms of service and refund policy." path="/tos" />
      <AnimatedBackground />
      <Navbar />
      <main className="pt-28 pb-20 relative z-10">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-xs text-primary mb-6 font-mono tracking-widest">LEGAL</div>
            <h1 className="font-display text-3xl font-black tracking-tight md:text-5xl mb-3">
              TERMS OF <span className="gradient-text">SERVICE</span>
            </h1>
            <p className="text-muted-foreground text-sm">& Refund Policy</p>
            <p className="text-xs text-muted-foreground mt-2">Last Updated: February 17, 2026</p>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                title: "1. Acceptance of Service",
                content: `By purchasing any Minecraft or Bot hosting plan from ZeyronCloud, via our website or Discord, you agree to these terms. Failure to follow these rules will result in immediate suspension without a refund.`,
              },
              {
                title: "2. Refund & Cancellation Policy",
                content: `We aim to be fair, but hosting resources are allocated immediately upon purchase.`,
                list: [
                  "**24-Hour Window:** Refunds are only available within 24 hours of the initial purchase.",
                  "**Refund Amount:** Only 80% of the payment will be refunded (to cover transaction fees and setup costs).",
                  "**Final Sale:** After 24 hours, all payments are 100% non-refundable.",
                  "**Chargeback Policy:** Raising a dispute or chargeback through your payment provider (UPI/Bank) is strictly prohibited. Any such action will result in immediate termination of all active services and a permanent ban from our website and Discord.",
                  "**How to Request:** You must open a Ticket on our website or contact support via Discord: https://discord.gg/zeyron.",
                ],
              },
              {
                title: "3. Premium Service Rules",
                content: "Premium plans come with exclusive perks but require strict adherence to the following:",
                list: [
                  "**Discord Membership:** If you leave our Discord server during an active plan, your Premium Role and dedicated support access will be revoked until you rejoin or renew.",
                  "**Panel Restrictions:** You are prohibited from changing the server name or description directly from the hosting panel. If you need a change, please contact support.",
                  "**Rule Violations:** Any breach of these rules will result in immediate server suspension without prior warning.",
                ],
              },
              {
                title: "4. Fair Usage & Reselling",
                content: "",
                list: [
                  "**Reselling:** You are allowed to resell our services ONLY if you inform our administration beforehand and receive written approval.",
                  '**Resource Abuse:** If your bot or Minecraft server uses excessive CPU/RAM beyond your plan\'s limits (causing lag for others), we reserve the right to throttle or suspend your instance.',
                ],
              },
              {
                title: '5. "Permanent" Server Guarantee',
                content: 'Servers sold as "Permanent" come with a 1-year (12 months) uptime guarantee. After the first year, ZeyronCloud is not liable for data loss or hardware decommissioning, and the "Permanent" status may be reviewed based on hardware costs.',
              },
              {
                title: "6. Termination of Service",
                content: "We reserve the right to terminate any service for:",
                list: [
                  "Hosting illegal content or malware.",
                  "Using the hosting for DDoS attacks or crypto-mining.",
                  "Abusing our staff on Discord or through tickets.",
                ],
              },
              {
                title: "7. Limitation of Liability",
                content: "ZeyronCloud shall not be held liable for any indirect, incidental, or consequential damages arising from the use or inability to use our services. Our total liability is limited to the amount paid for the specific service in question.",
              },
              {
                title: "8. Data & Privacy",
                content: "We collect only the minimum data necessary to provide our services (email, Discord ID, server configurations). We do not sell or share your data with third parties. Server data is retained for 30 days after service termination.",
              },
              {
                title: "9. Modifications to Terms",
                content: "ZeyronCloud reserves the right to modify these terms at any time. Users will be notified of significant changes via Discord or email. Continued use of our services after changes constitutes acceptance of the new terms.",
              },
              {
                title: "10. Contact",
                content: "For questions about these terms, contact us via Discord: https://discord.gg/BdFNqyNuKD or email us at support@zeyroncloud.com.",
              },
              {
                title: "Ownership",
                content: "ZeyronCloud is owned and operated by Ahamo and Akshit.",
              },
            ].map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="rounded-xl glass gradient-border p-6"
              >
                <h2 className="font-display text-xs font-bold tracking-widest text-primary mb-3 uppercase">
                  {section.title}
                </h2>
                {section.content && <p className="text-sm text-muted-foreground leading-relaxed mb-3">{section.content}</p>}
                {section.list && (
                  <ul className="space-y-2">
                    {section.list.map((item, j) => (
                      <li key={j} className="text-sm text-muted-foreground leading-relaxed flex gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<span class="text-foreground font-semibold">$1</span>') }} />
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
