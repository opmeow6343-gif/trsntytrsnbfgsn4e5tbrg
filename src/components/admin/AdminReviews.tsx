import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Trash2, Star, MessageSquare } from "lucide-react";

interface Review {
  id: string;
  name: string;
  text: string;
  stars: number;
  user_email: string;
  created_at: string;
}

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    const { data } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
    setReviews((data || []) as Review[]);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Review deleted" }); fetchReviews(); }
  };

  if (loading) return <div className="text-center py-8 text-muted-foreground text-sm">Loading reviews...</div>;

  return (
    <Card className="border-border/50 bg-card/50 shadow-sm">
      <CardHeader>
        <CardTitle className="font-display text-sm tracking-wider flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" /> USER REVIEWS ({reviews.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {reviews.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-8">No user reviews yet.</p>
        ) : (
          reviews.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-start justify-between rounded-lg bg-secondary/50 px-4 py-3 gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold">{r.name}</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: r.stars }).map((_, j) => (
                      <Star key={j} className="h-3 w-3 fill-primary text-primary" />
                    ))}
                  </div>
                  <Badge variant="outline" className="text-[10px]">{r.user_email}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{r.text}</p>
                <p className="text-[10px] text-muted-foreground/50 mt-1">{new Date(r.created_at).toLocaleDateString()}</p>
              </div>
              <Button size="icon" variant="ghost" onClick={() => handleDelete(r.id)} className="h-8 w-8 text-destructive hover:text-destructive shrink-0">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </motion.div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default AdminReviews;
