import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Newspaper, Gift, Clock, Megaphone } from "lucide-react";
import { getNews } from "@/lib/storage";
import type { NewsItem } from "@/lib/storage";

const NewsPage = () => {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNews().then(all => {
      setItems(all.filter(n => n.active));
      setLoading(false);
    });
  }, []);

  const news = items.filter(n => n.type === "news");
  const offers = items.filter(n => n.type === "offer");

  const ItemCard = ({ item, index }: { item: NewsItem; index: number }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 }}>
      <Card className={`border-border/50 bg-card card-hover-glow ${item.type === "offer" ? "border-amber-500/20" : ""}`}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <div className={`rounded-lg p-1.5 ${item.type === "offer" ? "bg-amber-500/15" : "bg-primary/10"}`}>
                {item.type === "offer" ? <Gift className="h-4 w-4 text-amber-400" /> : <Newspaper className="h-4 w-4 text-primary" />}
              </div>
              {item.badge && <Badge className={`text-xs font-display ${item.type === "offer" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "bg-primary/20 text-primary border border-primary/30"}`}>{item.badge}</Badge>}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0"><Clock className="h-3 w-3" />{new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
          </div>
          <h3 className={`font-display text-base font-bold tracking-wide mb-2 ${item.type === "offer" ? "text-amber-400" : "text-foreground"}`}>{item.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{item.content}</p>
        </CardContent>
      </Card>
    </motion.div>
  );

  const Empty = ({ label }: { label: string }) => (
    <div className="text-center py-16 text-muted-foreground">
      <div className="rounded-full bg-secondary/50 w-16 h-16 flex items-center justify-center mx-auto mb-4"><Megaphone className="h-7 w-7 opacity-30" /></div>
      <p className="text-sm">No {label} yet — check back soon!</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background animated-bg">
      <AnimatedBackground /><Navbar />
      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <h1 className="font-display text-3xl font-black tracking-tight md:text-5xl">NEWS & <span className="text-primary text-glow">OFFERS</span></h1>
            <p className="mt-4 text-muted-foreground">Stay updated with the latest ZeyronCloud announcements.</p>
          </motion.div>
          {loading ? (
            <div className="space-y-4">{[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}</div>
          ) : (
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="all" className="font-display text-xs tracking-wider">ALL ({items.length})</TabsTrigger>
                <TabsTrigger value="news" className="font-display text-xs tracking-wider">NEWS ({news.length})</TabsTrigger>
                <TabsTrigger value="offers" className="font-display text-xs tracking-wider">OFFERS ({offers.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="all">{items.length === 0 ? <Empty label="posts" /> : <div className="space-y-4">{items.map((item, i) => <ItemCard key={item.id} item={item} index={i} />)}</div>}</TabsContent>
              <TabsContent value="news">{news.length === 0 ? <Empty label="news" /> : <div className="space-y-4">{news.map((item, i) => <ItemCard key={item.id} item={item} index={i} />)}</div>}</TabsContent>
              <TabsContent value="offers">{offers.length === 0 ? <Empty label="offers" /> : <div className="space-y-4">{offers.map((item, i) => <ItemCard key={item.id} item={item} index={i} />)}</div>}</TabsContent>
            </Tabs>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NewsPage;
