import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight } from "lucide-react";

const faqs = [
  {
    q: "How fast is the server setup?",
    a: "Your server is deployed instantly after checkout. No waiting, no manual provisioning — it's fully automated.",
  },
  {
    q: "What games do you support?",
    a: "We support Minecraft (Java & Bedrock), Palworld, Rust, Valheim, 7 Days to Die, ARK, Terraria, Satisfactory, and more coming soon.",
  },
  {
    q: "Do you offer DDoS protection?",
    a: "Yes! All plans include enterprise-grade DDoS mitigation at no extra cost, keeping your server online 24/7.",
  },
  {
    q: "Can I upgrade my plan later?",
    a: "Absolutely. You can upgrade or downgrade your plan at any time through our support team on Discord with zero downtime.",
  },
];

const FAQPreview = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 font-display">
            Got <span className="gradient-text">Questions</span>?
          </h2>
          <p className="text-muted-foreground text-sm">Quick answers to the most common ones.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="glass rounded-xl px-5 border-none gradient-border"
              >
                <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline py-4">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/faq")}
            className="text-primary text-sm gap-1.5 hover:bg-primary/5"
          >
            View all FAQs <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQPreview;
