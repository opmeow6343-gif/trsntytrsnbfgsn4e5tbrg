import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, UserPlus, Trash2, Users, Plus, Newspaper, Settings2, Gift, Sparkles, Image, Ticket, Tag, Zap, Webhook, Bell, LayoutDashboard } from "lucide-react";
import {
  getSettings, saveSettings, checkIsAdmin, DEFAULT_SETTINGS,
  getNews, addNewsItem, updateNewsItem, deleteNewsItem,
} from "@/lib/storage";
import type { SiteSettings, NewsItem } from "@/lib/storage";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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

const AdminSettings = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabId>("dashboard");
  const [settings, setSettingsState] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

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

  const tabs: { id: TabId; label: string; icon: any }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "tickets", label: "Tickets", icon: Ticket },
    { id: "alerts", label: "Alerts", icon: Bell },
    { id: "content", label: "Content", icon: Settings2 },
    { id: "news", label: "News", icon: Newspaper },
    { id: "coupons", label: "Coupons", icon: Tag },
    { id: "flashsales", label: "Flash Sales", icon: Zap },
    { id: "triggers", label: "Triggers", icon: Zap },
    { id: "webhooks", label: "Webhooks", icon: Webhook },
    { id: "booster", label: "Booster", icon: Sparkles },
    { id: "logo", label: "Logo", icon: Image },
    { id: "admins", label: "Admins", icon: Users },
  ];

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <span className="font-display text-lg font-bold tracking-wider">ADMIN <span className="text-primary">PANEL</span></span>
          </div>
          <div className="flex items-center gap-2">
            {tab === "content" && (
              <Button onClick={handleSave} className="glow-blue gap-2 font-display text-xs tracking-wider"><Save className="h-4 w-4" /> SAVE</Button>
            )}
            <a href="/" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs"><ExternalLink className="h-3 w-3" /> Visit Website</Button>
            </a>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map(t => (
            <Button key={t.id} size="sm" variant={tab === t.id ? "default" : "outline"} onClick={() => setTab(t.id)} className="gap-1.5 text-[11px] font-display tracking-wider"><t.icon className="h-3 w-3" />{t.label}</Button>
          ))}
        </div>

        {tab === "dashboard" && <AdminDashboard />}
        {tab === "tickets" && <AdminTickets />}
        {tab === "alerts" && <AdminNotifications />}

        {tab === "content" && (
          <Card className="border-border/50 bg-card/50">
            <CardHeader><CardTitle className="font-display text-sm tracking-wider">SITE TEXT CONTENT</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {settingsFields.map(f => (
                <div key={f.key}>
                  <Label className="text-xs text-muted-foreground">{f.label}</Label>
                  {f.multiline ? (
                    <Textarea value={settings[f.key]} onChange={e => setSettingsState({ ...settings, [f.key]: e.target.value })} className="bg-secondary/50 border-border mt-1" />
                  ) : (
                    <Input value={settings[f.key]} onChange={e => setSettingsState({ ...settings, [f.key]: e.target.value })} className="bg-secondary/50 border-border mt-1" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {tab === "news" && (
          <div className="space-y-4">
            <Card className="border-border/50 bg-card/50">
              <CardHeader><CardTitle className="font-display text-sm tracking-wider flex items-center gap-2"><Plus className="h-4 w-4 text-primary" /> CREATE ANNOUNCEMENT</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Button size="sm" variant={newsType === "news" ? "default" : "outline"} onClick={() => setNewsType("news")} className="text-xs gap-1"><Newspaper className="h-3.5 w-3.5" />News</Button>
                  <Button size="sm" variant={newsType === "offer" ? "default" : "outline"} onClick={() => setNewsType("offer")} className="text-xs gap-1"><Gift className="h-3.5 w-3.5" />Offer</Button>
                </div>
                <Input placeholder="Title" value={newsTitle} onChange={e => setNewsTitle(e.target.value)} className="bg-secondary/50 border-border" />
                <Textarea placeholder="Content" value={newsContent} onChange={e => setNewsContent(e.target.value)} className="bg-secondary/50 border-border min-h-[80px]" />
                <Input placeholder="Badge label (optional)" value={newsBadge} onChange={e => setNewsBadge(e.target.value)} className="bg-secondary/50 border-border" />
                <Button onClick={handleAddNews} className="gap-2 glow-blue font-display text-xs tracking-wider"><Plus className="h-4 w-4" />PUBLISH</Button>
              </CardContent>
            </Card>
            {newsItems.length > 0 && (
              <Card className="border-border/50 bg-card/50">
                <CardHeader><CardTitle className="font-display text-sm tracking-wider">ALL POSTS ({newsItems.length})</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {newsItems.map(n => (
                    <div key={n.id} className="flex items-start justify-between rounded-lg bg-secondary/50 px-4 py-3 gap-3">
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
                    </div>
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
          <Card className="border-border/50 bg-card/50">
            <CardHeader><CardTitle className="font-display text-sm tracking-wider flex items-center gap-2"><Sparkles className="h-4 w-4 text-purple-400" /> BOOSTER PERKS</CardTitle></CardHeader>
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
          <Card className="border-border/50 bg-card/50">
            <CardHeader><CardTitle className="font-display text-sm tracking-wider flex items-center gap-2"><Image className="h-4 w-4 text-primary" /> SITE LOGO</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground">Upload a new logo for the website. Recommended size: 256×256px, PNG or WebP.</p>
              <div className="flex items-center gap-6">
                {logoPreview && (
                  <div className="shrink-0">
                    <img src={logoPreview} alt="Current logo" className="h-20 w-20 rounded-xl object-cover border border-border/50" />
                    <p className="text-[10px] text-muted-foreground mt-1 text-center">Current</p>
                  </div>
                )}
                <div className="flex-1">
                  <Input type="file" accept="image/*" onChange={handleLogoUpload} className="bg-secondary/50 border-border text-xs" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {tab === "admins" && (
          <Card className="border-border/50 bg-card/50">
            <CardHeader><CardTitle className="font-display text-sm tracking-wider flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> MANAGE ADMINS</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {admins.map(email => (
                  <div key={email} className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3">
                    <span className="text-sm">{email}</span>
                    <Button size="sm" variant="ghost" onClick={() => handleRemoveAdmin(email)} className="text-destructive hover:text-destructive h-8"><Trash2 className="h-4 w-4" /></Button>
                  </div>
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
      </main>
    </div>
  );
};

export default AdminSettings;
