import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink, Save, UserPlus, Trash2, Users, Plus, Newspaper,
  Settings2, Gift, Sparkles, Image, Ticket, Tag, Zap, Webhook,
  Bell, LayoutDashboard, PanelLeftClose, PanelLeft, ChevronRight
} from "lucide-react";
import {
  getSettings, saveSettings, checkIsAdmin, DEFAULT_SETTINGS,
  getNews, addNewsItem, updateNewsItem, deleteNewsItem,
} from "@/lib/storage";
import type { SiteSettings, NewsItem } from "@/lib/storage";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import ThemeToggle from "@/components/ThemeToggle";
import logo from "@/assets/zeyroncloud-logo.png";

import AdminTickets from "@/components/admin/AdminTickets";
import AdminCoupons from "@/components/admin/AdminCoupons";
import AdminFlashSales from "@/components/admin/AdminFlashSales";
import AdminTriggers from "@/components/admin/AdminTriggers";
import AdminWebhooks from "@/components/admin/AdminWebhooks";
import AdminNotifications from "@/components/admin/AdminNotifications";
import AdminDashboard from "@/components/admin/AdminDashboard";

const settingsFields: { key: keyof SiteSettings; label: string; multiline?: boolean }[] = [
  { key: "heroTitle1", label: "Hero Title Line 1" },
  { key: "heroTitle2", label: "Hero Title Line 2 (highlighted)" },
  { key: "heroTitle3", label: "Hero Title Line 3" },
  { key: "heroDescription", label: "Hero Description", multiline: true },
  { key: "featuresTitle", label: "Features Section Title" },
  { key: "featuresSubtitle", label: "Features Subtitle" },
  { key: "pricingTitle", label: "Pricing Section Title" },
  { key: "pricingSubtitle", label: "Pricing Subtitle" },
];

type TabId = "dashboard" | "tickets" | "alerts" | "content" | "news" | "coupons" | "flashsales" | "triggers" | "webhooks" | "booster" | "logo" | "admins";

const tabs: { id: TabId; label: string; icon: any; group: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, group: "Overview" },
  { id: "tickets", label: "Tickets", icon: Ticket, group: "Overview" },
  { id: "alerts", label: "Alerts", icon: Bell, group: "Overview" },
  { id: "content", label: "Content", icon: Settings2, group: "Manage" },
  { id: "news", label: "News", icon: Newspaper, group: "Manage" },
  { id: "coupons", label: "Coupons", icon: Tag, group: "Manage" },
  { id: "flashsales", label: "Flash Sales", icon: Zap, group: "Manage" },
  { id: "triggers", label: "Triggers", icon: Zap, group: "Automation" },
  { id: "webhooks", label: "Webhooks", icon: Webhook, group: "Automation" },
  { id: "booster", label: "Booster", icon: Sparkles, group: "Settings" },
  { id: "logo", label: "Logo", icon: Image, group: "Settings" },
  { id: "admins", label: "Admins", icon: Users, group: "Settings" },
];

const groups = ["Overview", "Manage", "Automation", "Settings"];

const contentVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.2 } },
};

const AdminSettings = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabId>("dashboard");
  const [settings, setSettingsState] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [newsTitle, setNewsTitle] = useState("");
  const [newsContent, setNewsContent] = useState("");
  const [newsType, setNewsType] = useState<"news" | "offer">("news");
  const [newsBadge, setNewsBadge] = useState("");
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);

  const [admins, setAdmins] = useState<string[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");

  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const isAdmin = await checkIsAdmin();
      if (!isAdmin) { navigate("/admin"); return; }
      const [s, n] = await Promise.all([getSettings(), getNews()]);
      setSettingsState(s);
      setNewsItems(n);
      loadAdmins();
      if (s.logoUrl) setLogoPreview(s.logoUrl);
      setLoading(false);
    };
    init();
  }, [navigate]);

  const loadAdmins = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const res = await supabase.functions.invoke("manage-admin", { body: { action: "list" } });
      if (res.data?.admins) setAdmins(res.data.admins);
    } catch {}
  };

  const handleSave = async () => { await saveSettings(settings); toast({ title: "Settings saved" }); };

  const handleAddNews = async () => {
    if (!newsTitle.trim() || !newsContent.trim()) { toast({ title: "Error", description: "Title and content required", variant: "destructive" }); return; }
    await addNewsItem({ title: newsTitle, content: newsContent, type: newsType, badge: newsBadge || undefined, active: true });
    setNewsItems(await getNews()); setNewsTitle(""); setNewsContent(""); setNewsBadge("");
    toast({ title: "Published!" });
  };

  const handleToggleNews = async (id: string, active: boolean) => { await updateNewsItem(id, { active: !active }); setNewsItems(await getNews()); };
  const handleDeleteNews = async (id: string) => { await deleteNewsItem(id); setNewsItems(await getNews()); };

  const handleToggleBooster = async (enabled: boolean) => {
    const updated = { ...settings, boosterPerksEnabled: enabled ? "true" : "false" };
    setSettingsState(updated);
    await saveSettings(updated);
    toast({ title: enabled ? "Booster perks enabled" : "Booster perks disabled" });
  };

  const handleAddAdmin = async () => {
    if (!newAdminEmail.includes("@")) { toast({ title: "Error", description: "Valid email required", variant: "destructive" }); return; }
    try {
      const res = await supabase.functions.invoke("manage-admin", { body: { action: "add", email: newAdminEmail } });
      if (res.data?.error) { toast({ title: "Error", description: res.data.error, variant: "destructive" }); return; }
      setNewAdminEmail(""); loadAdmins(); toast({ title: "Admin added" });
    } catch { toast({ title: "Error", description: "Failed to add admin", variant: "destructive" }); }
  };

  const handleRemoveAdmin = async (email: string) => {
    try {
      const res = await supabase.functions.invoke("manage-admin", { body: { action: "remove", email } });
      if (res.data?.error) { toast({ title: "Error", description: res.data.error, variant: "destructive" }); return; }
      loadAdmins(); toast({ title: "Admin removed" });
    } catch { toast({ title: "Error", description: "Failed to remove admin", variant: "destructive" }); }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const dataUrl = reader.result as string;
      setLogoPreview(dataUrl);
      const updated = { ...settings, logoUrl: dataUrl };
      setSettingsState(updated as SiteSettings);
      await saveSettings(updated as SiteSettings);
      toast({ title: "Logo updated! Refresh to see changes across the site." });
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-muted-foreground tracking-widest font-mono">LOADING ADMIN</p>
        </motion.div>
      </div>
    );
  }

  const currentTab = tabs.find(t => t.id === tab);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 240 : 64 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        className="fixed left-0 top-0 bottom-0 z-50 bg-card/80 backdrop-blur-xl border-r border-border/50 flex flex-col overflow-hidden"
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 gap-3 border-b border-border/30 shrink-0">
          <motion.img
            src={logo}
            alt="ZeyronCloud"
            className="h-8 w-8 rounded-lg shrink-0"
            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
          />
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <p className="font-display text-sm font-bold tracking-tight">
                  Admin<span className="text-primary"> Panel</span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav groups */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
          {groups.map(group => {
            const groupTabs = tabs.filter(t => t.group === group);
            return (
              <div key={group}>
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-[9px] font-mono text-muted-foreground/60 tracking-[0.2em] uppercase px-2 mb-1.5"
                    >
                      {group}
                    </motion.p>
                  )}
                </AnimatePresence>
                <div className="space-y-0.5">
                  {groupTabs.map((t, i) => {
                    const active = tab === t.id;
                    return (
                      <motion.button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03, duration: 0.3 }}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 relative group ${
                          active
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                        }`}
                      >
                        {active && (
                          <motion.div
                            layoutId="admin-sidebar-active"
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary"
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          />
                        )}
                        <t.icon className={`h-4 w-4 shrink-0 transition-colors ${active ? "text-primary" : ""}`} />
                        <AnimatePresence>
                          {sidebarOpen && (
                            <motion.span
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: "auto" }}
                              exit={{ opacity: 0, width: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden whitespace-nowrap"
                            >
                              {t.label}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom actions */}
        <div className="border-t border-border/30 p-2 space-y-1 shrink-0">
          <motion.button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
          >
            {sidebarOpen ? <PanelLeftClose className="h-4 w-4 shrink-0" /> : <PanelLeft className="h-4 w-4 shrink-0" />}
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="overflow-hidden whitespace-nowrap">
                  Collapse
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
          <a href="/" target="_blank" rel="noopener noreferrer" className="block">
            <motion.div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
              <ExternalLink className="h-4 w-4 shrink-0" />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="overflow-hidden whitespace-nowrap">
                    Visit Website
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </a>
        </div>
      </motion.aside>

      {/* Main content */}
      <motion.main
        initial={false}
        animate={{ marginLeft: sidebarOpen ? 240 : 64 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        className="flex-1 min-h-screen"
      >
        {/* Header */}
        <motion.header
          className="sticky top-0 z-40 h-14 border-b border-border/30 bg-background/80 backdrop-blur-xl flex items-center justify-between px-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-2">
            {currentTab && (
              <motion.div
                key={tab}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2"
              >
                <currentTab.icon className="h-4 w-4 text-primary" />
                <h1 className="font-display text-sm font-bold tracking-wider">{currentTab.label.toUpperCase()}</h1>
                <ChevronRight className="h-3 w-3 text-muted-foreground/40" />
                <span className="text-[10px] text-muted-foreground font-mono">{currentTab.group}</span>
              </motion.div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {tab === "content" && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <Button onClick={handleSave} size="sm" className="glow-primary gap-1.5 text-xs font-display tracking-wider h-8">
                  <Save className="h-3.5 w-3.5" /> SAVE
                </Button>
              </motion.div>
            )}
          </div>
        </motion.header>

        {/* Page content */}
        <div className="p-6 max-w-5xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {tab === "dashboard" && <AdminDashboard />}
              {tab === "tickets" && <AdminTickets />}
              {tab === "alerts" && <AdminNotifications />}

              {tab === "content" && (
                <Card className="border-border/50 bg-card/50 shadow-sm">
                  <CardHeader><CardTitle className="font-display text-sm tracking-wider">SITE TEXT CONTENT</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    {settingsFields.map((f, i) => (
                      <motion.div
                        key={f.key}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <Label className="text-xs text-muted-foreground">{f.label}</Label>
                        {f.multiline ? (
                          <Textarea value={settings[f.key]} onChange={e => setSettingsState({ ...settings, [f.key]: e.target.value })} className="bg-secondary/50 border-border mt-1" />
                        ) : (
                          <Input value={settings[f.key]} onChange={e => setSettingsState({ ...settings, [f.key]: e.target.value })} className="bg-secondary/50 border-border mt-1" />
                        )}
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {tab === "news" && (
                <div className="space-y-4">
                  <Card className="border-border/50 bg-card/50 shadow-sm">
                    <CardHeader><CardTitle className="font-display text-sm tracking-wider flex items-center gap-2"><Plus className="h-4 w-4 text-primary" /> CREATE ANNOUNCEMENT</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant={newsType === "news" ? "default" : "outline"} onClick={() => setNewsType("news")} className="text-xs gap-1"><Newspaper className="h-3.5 w-3.5" />News</Button>
                        <Button size="sm" variant={newsType === "offer" ? "default" : "outline"} onClick={() => setNewsType("offer")} className="text-xs gap-1"><Gift className="h-3.5 w-3.5" />Offer</Button>
                      </div>
                      <Input placeholder="Title" value={newsTitle} onChange={e => setNewsTitle(e.target.value)} className="bg-secondary/50 border-border" />
                      <Textarea placeholder="Content" value={newsContent} onChange={e => setNewsContent(e.target.value)} className="bg-secondary/50 border-border min-h-[80px]" />
                      <Input placeholder="Badge label (optional)" value={newsBadge} onChange={e => setNewsBadge(e.target.value)} className="bg-secondary/50 border-border" />
                      <Button onClick={handleAddNews} className="gap-2 glow-primary font-display text-xs tracking-wider"><Plus className="h-4 w-4" />PUBLISH</Button>
                    </CardContent>
                  </Card>
                  {newsItems.length > 0 && (
                    <Card className="border-border/50 bg-card/50 shadow-sm">
                      <CardHeader><CardTitle className="font-display text-sm tracking-wider">ALL POSTS ({newsItems.length})</CardTitle></CardHeader>
                      <CardContent className="space-y-3">
                        {newsItems.map((n, i) => (
                          <motion.div
                            key={n.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-start justify-between rounded-lg bg-secondary/50 px-4 py-3 gap-3"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant={n.type === "offer" ? "default" : "secondary"} className="text-xs">{n.type}</Badge>
                                {n.badge && <Badge variant="outline" className="text-xs">{n.badge}</Badge>}
                                {n.active ? <Badge className="text-xs bg-primary/20 text-primary">Live</Badge> : <Badge variant="secondary" className="text-xs">Hidden</Badge>}
                              </div>
                              <p className="text-sm font-semibold">{n.title}</p>
                              <p className="text-xs text-muted-foreground truncate">{n.content}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Switch checked={n.active} onCheckedChange={() => handleToggleNews(n.id, n.active)} />
                              <Button size="icon" variant="ghost" onClick={() => handleDeleteNews(n.id)} className="h-8 w-8 text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                            </div>
                          </motion.div>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {tab === "coupons" && <AdminCoupons />}
              {tab === "flashsales" && <AdminFlashSales />}
              {tab === "triggers" && <AdminTriggers />}
              {tab === "webhooks" && <AdminWebhooks />}

              {tab === "booster" && (
                <Card className="border-border/50 bg-card/50 shadow-sm">
                  <CardHeader><CardTitle className="font-display text-sm tracking-wider flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> BOOSTER PERKS</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-xs text-muted-foreground">Toggle booster and media plans on or off.</p>
                    <div className="flex items-center gap-3 rounded-lg bg-secondary/50 px-4 py-3">
                      <Label className="text-sm font-medium flex-1">Enable Booster & Media Plans</Label>
                      <Switch checked={settings.boosterPerksEnabled === "true"} onCheckedChange={handleToggleBooster} />
                    </div>
                    <div className="rounded-lg bg-secondary/30 px-4 py-3 text-xs text-muted-foreground">
                      {settings.boosterPerksEnabled === "true"
                        ? "✅ Booster and media plans are currently ACTIVE."
                        : "❌ Booster and media plans are currently DISABLED."}
                    </div>
                  </CardContent>
                </Card>
              )}

              {tab === "logo" && (
                <Card className="border-border/50 bg-card/50 shadow-sm">
                  <CardHeader><CardTitle className="font-display text-sm tracking-wider flex items-center gap-2"><Image className="h-4 w-4 text-primary" /> SITE LOGO</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-xs text-muted-foreground">Upload a new logo for the website. Recommended size: 256×256px, PNG or WebP.</p>
                    <div className="flex items-center gap-6">
                      {logoPreview && (
                        <motion.div className="shrink-0" whileHover={{ scale: 1.05 }}>
                          <img src={logoPreview} alt="Current logo" className="h-20 w-20 rounded-xl object-cover border border-border/50 shadow-md" />
                          <p className="text-[10px] text-muted-foreground mt-1 text-center">Current</p>
                        </motion.div>
                      )}
                      <div className="flex-1">
                        <Input type="file" accept="image/*" onChange={handleLogoUpload} className="bg-secondary/50 border-border text-xs" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {tab === "admins" && (
                <Card className="border-border/50 bg-card/50 shadow-sm">
                  <CardHeader><CardTitle className="font-display text-sm tracking-wider flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> MANAGE ADMINS</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {admins.map((email, i) => (
                        <motion.div
                          key={email}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3"
                        >
                          <span className="text-sm">{email}</span>
                          <Button size="sm" variant="ghost" onClick={() => handleRemoveAdmin(email)} className="text-destructive hover:text-destructive h-8"><Trash2 className="h-4 w-4" /></Button>
                        </motion.div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input placeholder="Email of registered user" type="email" value={newAdminEmail} onChange={e => setNewAdminEmail(e.target.value)} className="bg-secondary/50 border-border" />
                      <Button onClick={handleAddAdmin} variant="outline" className="gap-1 shrink-0"><UserPlus className="h-4 w-4" /> Add</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">The user must have an account first.</p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.main>
    </div>
  );
};

export default AdminSettings;
