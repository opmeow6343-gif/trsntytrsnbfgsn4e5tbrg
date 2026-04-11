import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Quote, Send, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Review {
  id: string;
  name: string;
  text: string;
  stars: number;
  created_at: string;
  user_id: string;
}

const TestimonialsSection = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [stars, setStars] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchReviews();
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s?.user?.id) {
        supabase.rpc("has_role", { _user_id: s.user.id, _role: "admin" }).then(({ data }) => setIsAdmin(!!data));
      }
    });
  }, []);

  const fetchReviews = async () => {
    const { data } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
    setReviews((data || []) as Review[]);
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!session) { toast({ title: "Please sign in to leave a review", variant: "destructive" }); return; }
    if (!name.trim() || !text.trim()) { toast({ title: "Name and review are required", variant: "destructive" }); return; }
    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert({
      user_id: session.user.id,
      user_email: session.user.email,
      name: name.trim(),
      text: text.trim(),
      stars,
    });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
    else { toast({ title: "Review submitted! 🎉" }); setName(""); setText(""); setStars(5); setShowForm(false); await fetchReviews(); }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (!error) { toast({ title: "Review deleted" }); await fetchReviews(); }
  };

  // Combine static testimonials with DB reviews
  const staticReviews: Review[] = [
    { id: "s1", name: "Aarav K.", text: "Best MC hosting. Zero lag with 80+ players. DDoS protection is rock solid.", stars: 5, created_at: "", user_id: "" },
    { id: "s2", name: "Priya S.", text: "Bot running 3 months, zero restarts. Incredible value for the price.", stars: 5, created_at: "", user_id: "" },
    { id: "s3", name: "Rohan M.", text: "Ryzen 9 performance is insane — 20 TPS with 100+ players consistently.", stars: 5, created_at: "", user_id: "" },
  ];
  const allReviews = [...reviews, ...staticReviews];

  return (
    <section className="py-28 relative overflow-hidden">
      <motion.div className="absolute top-20 right-10 opacity-[0.03]" animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}>
        <Quote className="h-40 w-40 text-primary" />
      </motion.div>

      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-14">
          <motion.span className="text-[10px] font-medium text-primary tracking-[0.25em] uppercase block mb-3 font-mono" initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            REVIEWS
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter font-display">
            Trusted by{" "}
            <motion.span className="gradient-text inline-block" whileInView={{ scale: [0.8, 1.08, 1] }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
              Gamers
            </motion.span>
          </h2>
        </motion.div>

        {/* Scrollable reviews */}
        <div className="relative max-w-5xl mx-auto">
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
            {allReviews.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="min-w-[280px] max-w-[320px] snap-start shrink-0 rounded-xl glass gradient-border p-5 relative overflow-hidden card-hover"
              >
                <Quote className="absolute top-4 right-4 h-7 w-7 text-primary/5" />

                {isAdmin && t.user_id && (
                  <button onClick={() => handleDelete(t.id)} className="absolute top-3 right-3 z-10 p-1.5 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}

                <div className="flex items-center gap-3 mb-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/15 flex items-center justify-center font-bold text-xs text-primary font-display">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-xs font-display">{t.name}</p>
                    <div className="flex gap-0.5 mt-0.5">
                      {Array.from({ length: t.stars }).map((_, j) => (
                        <Star key={j} className="h-2.5 w-2.5 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{t.text}</p>

                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-[1px]"
                  style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.25), transparent)" }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + i * 0.05, duration: 0.8 }}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Trustpilot CTA + Write a review */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-10">
          {/* Trustpilot banner */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-lg mx-auto glass gradient-border rounded-xl p-6 text-center mb-6"
          >
            <div className="flex justify-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} className="h-5 w-5 fill-[#00b67a] text-[#00b67a]" />
              ))}
            </div>
            <p className="text-sm font-semibold mb-1">Rate us 5 Stars on Trustpilot!</p>
            <p className="text-xs text-muted-foreground mb-4">Your feedback helps us grow and serve you better.</p>
            <a href="https://www.trustpilot.com/review/zeyroncloud.com" target="_blank" rel="noopener noreferrer">
              <Button className="gap-2 bg-[#00b67a] hover:bg-[#00a06a] text-white text-xs">
                <Star className="h-3.5 w-3.5 fill-white" />
                Review us on Trustpilot
                <ExternalLink className="h-3 w-3" />
              </Button>
            </a>
          </motion.div>

          {/* Write a site review */}
          <div className="text-center">
            {!showForm ? (
              <Button variant="outline" onClick={() => setShowForm(true)} className="gap-2 text-xs border-border/30 hover:border-primary/30 rounded-lg">
                <Send className="h-3.5 w-3.5" /> Write a Review
              </Button>
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto glass gradient-border rounded-xl p-6 space-y-4">
                <h3 className="font-display text-sm font-bold">Leave a Review</h3>
                <Input placeholder="Your name" value={name} onChange={e => setName(e.target.value)} className="bg-secondary/50 border-border text-xs" />
                <Textarea placeholder="Your review..." value={text} onChange={e => setText(e.target.value)} className="bg-secondary/50 border-border text-xs min-h-[80px]" />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Rating:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button key={s} onClick={() => setStars(s)} className="transition-transform hover:scale-125">
                        <Star className={`h-5 w-5 ${s <= stars ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1 text-xs">Cancel</Button>
                  <Button onClick={handleSubmit} disabled={submitting} className="flex-1 glow-primary text-xs gap-1.5">
                    <Send className="h-3.5 w-3.5" /> {submitting ? "Submitting..." : "Submit"}
                  </Button>
                </div>
                {!session && <p className="text-[10px] text-muted-foreground">You need to <a href="/auth" className="text-primary hover:underline">sign in</a> to submit a review.</p>}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
