import { supabase } from "@/integrations/supabase/client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const from = (table: string) => (supabase as any).from(table);

// ─── Types ──────────────────────────────────────────────────────────────────
export interface TicketMessage {
  id: string;
  sender: "user" | "admin";
  text: string;
  imageUrl?: string;
  timestamp: string;
  isTriggered?: boolean;
}

export interface Ticket {
  id: string;
  email: string;
  type: "minecraft" | "bot" | "booster" | "vps";
  specs: Record<string, string>;
  messages: TicketMessage[];
  status: "open" | "closed";
  createdAt: string;
  referralCode?: string;
  lastUserMessageAt?: string;
}

export interface SiteSettings {
  heroTitle1: string;
  heroTitle2: string;
  heroTitle3: string;
  heroDescription: string;
  featuresTitle: string;
  featuresSubtitle: string;
  pricingTitle: string;
  pricingSubtitle: string;
  mcTitle: string;
  mcSubtitle: string;
  botTitle: string;
  botSubtitle: string;
  boosterPerksEnabled: string;
  logoUrl: string;
}

export interface Trigger {
  id: string;
  keyword: string;
  responseText: string;
  responseImage?: string;
  enabled: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  type: "news" | "offer";
  badge?: string;
  expiresAt?: string;
  createdAt: string;
  active: boolean;
}

export interface CouponCode {
  id: string;
  code: string;
  discountPercent: number;
  maxUses: number;
  usesLeft: number;
  planRestriction?: string;
  active: boolean;
  createdAt: string;
}

export interface FlashSale {
  id: string;
  title: string;
  description: string;
  discountPercent: number;
  endTime: string;
  active: boolean;
  createdAt: string;
}

export interface CartItem {
  id: string;
  type: "minecraft" | "bot";
  cpu: string;
  ram: string;
  storage: string;
  price: number;
  players?: number;
}

export interface WebhookSettings {
  discordWebhookUrl: string;
  enabled: boolean;
  discordPingId: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  heroTitle1: "POWER YOUR",
  heroTitle2: "GAME SERVERS",
  heroTitle3: "WITH ZEYRONCLOUD",
  heroDescription: "Premium hosting for Minecraft, Hytale, Palworld, Rust & more. DDoS protection, instant deployment, and 24/7 expert support.",
  featuresTitle: "WHY ZEYRONCLOUD?",
  featuresSubtitle: "Built for gamers and developers who demand performance, reliability, and support.",
  pricingTitle: "OUR PLANS",
  pricingSubtitle: "Simple, transparent pricing. Order via Discord for instant setup.",
  mcTitle: "MINECRAFT HOSTING",
  mcSubtitle: "Configure your perfect Minecraft server. Starting at just ₹15/GB RAM per month.",
  botTitle: "DISCORD BOT HOSTING",
  botSubtitle: "Reliable hosting for your Discord bots. Starting at ₹25/512MB per month.",
  boosterPerksEnabled: "true",
  logoUrl: "",
};

// ─── Admin Role ─────────────────────────────────────────────────────────────
export const checkIsAdmin = async (): Promise<boolean> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return false;
  const { data } = await (supabase.rpc as any)("has_role", {
    _user_id: session.user.id,
    _role: "admin",
  });
  return !!data;
};

// ─── Tickets (Database) ─────────────────────────────────────────────────────
export const createTicket = async (
  email: string,
  type: Ticket["type"],
  specs: Record<string, string>,
  couponCode?: string,
  discountPercent?: number,
): Promise<Ticket> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  if (couponCode && discountPercent && specs.Price) {
    const priceMatch = specs.Price.match(/₹([\d,]+)/);
    if (priceMatch) {
      const originalPrice = parseInt(priceMatch[1].replace(/,/g, ""));
      const discountedPrice = Math.round(originalPrice * (1 - discountPercent / 100));
      specs["Original Price"] = specs.Price;
      specs.Price = `₹${discountedPrice}/mo`;
      specs["Coupon"] = `${couponCode} (${discountPercent}% off)`;
    }
  }

  const { error } = await from("tickets").insert({
    id, user_id: session.user.id, email, type, specs, status: "open",
    last_user_message_at: new Date().toISOString(),
  });
  if (error) throw error;
  sendDiscordWebhook({ id, email, type, specs });
  return { id, email, type, specs, messages: [], status: "open", createdAt: new Date().toISOString() };
};

export const createCartTicket = async (
  email: string,
  items: CartItem[],
  couponCode?: string,
  discountPercent?: number,
): Promise<Ticket> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  const totalPrice = items.reduce((s, i) => s + i.price, 0);
  const discount = couponCode && discountPercent ? Math.round(totalPrice * discountPercent / 100) : 0;
  const finalPrice = totalPrice - discount;

  const specs: Record<string, string> = { "Items": String(items.length) };
  items.forEach((item, i) => {
    const prefix = items.length > 1 ? `Item ${i + 1}` : "";
    const p = prefix ? `${prefix} ` : "";
    specs[`${p}Type`] = item.type === "minecraft" ? "Minecraft" : "Bot";
    specs[`${p}RAM`] = item.ram;
    specs[`${p}Storage`] = item.storage;
    specs[`${p}CPU`] = item.cpu;
    if (item.players) specs[`${p}Players`] = String(item.players);
    specs[`${p}Price`] = `₹${item.price}/mo`;
  });

  if (couponCode && discountPercent) {
    specs["Coupon"] = `${couponCode} (${discountPercent}% off)`;
    specs["Discount"] = `−₹${discount}`;
  }
  specs["Total"] = `₹${finalPrice}/mo`;

  const type = items.every(i => i.type === "minecraft") ? "minecraft" : items.every(i => i.type === "bot") ? "bot" : "minecraft";

  const { error } = await from("tickets").insert({
    id, user_id: session.user.id, email, type, specs, status: "open",
    last_user_message_at: new Date().toISOString(),
  });
  if (error) throw error;
  sendDiscordWebhook({ id, email, type, specs });
  return { id, email, type, specs, messages: [], status: "open", createdAt: new Date().toISOString() };
};

const mapMessages = (messages: any[]): TicketMessage[] =>
  (messages || []).map((m: any) => ({
    id: m.id, sender: m.sender, text: m.text,
    imageUrl: m.image_url || undefined,
    timestamp: m.created_at,
    isTriggered: m.is_triggered || false,
  }));

const mapTicket = (t: any, messages: TicketMessage[]): Ticket => ({
  id: t.id, email: t.email, type: t.type,
  specs: t.specs as Record<string, string>,
  messages, status: t.status,
  createdAt: t.created_at,
  referralCode: t.referral_code,
  lastUserMessageAt: t.last_user_message_at,
});

export const getAllTickets = async (): Promise<Ticket[]> => {
  const { data: tickets, error } = await from("tickets").select("*").order("created_at", { ascending: false });
  if (error) { console.error("Failed to fetch tickets:", error); return []; }
  if (!tickets || tickets.length === 0) return [];
  const ids = tickets.map((t: any) => t.id);
  const { data: msgs } = await from("ticket_messages").select("*").in("ticket_id", ids).order("created_at");
  const byTicket: Record<string, TicketMessage[]> = {};
  mapMessages(msgs).forEach(m => {
    const tid = (msgs || []).find((raw: any) => raw.id === m.id)?.ticket_id;
    if (tid) { if (!byTicket[tid]) byTicket[tid] = []; byTicket[tid].push(m); }
  });
  return tickets.map((t: any) => mapTicket(t, byTicket[t.id] || []));
};

export const getTicketById = async (id: string): Promise<Ticket | null> => {
  const { data: t, error } = await from("tickets").select("*").eq("id", id).maybeSingle();
  if (error) { console.error("Failed to fetch ticket:", error); return null; }
  if (!t) return null;
  const { data: msgs } = await from("ticket_messages").select("*").eq("ticket_id", id).order("created_at");
  return mapTicket(t, mapMessages(msgs));
};

export const addMessage = async (
  ticketId: string, sender: "user" | "admin", text: string,
  imageUrl?: string, isTriggered?: boolean
) => {
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 4);
  await from("ticket_messages").insert({
    id, ticket_id: ticketId, sender, text,
    image_url: imageUrl || null, is_triggered: isTriggered || false,
  });

  if (sender === "user" && !isTriggered) {
    try {
      const { data: ticket } = await from("tickets").select("email").eq("id", ticketId).maybeSingle();
      sendDiscordNeedsReply(ticketId, ticket?.email || "Unknown");
    } catch {}
  }
};

export const closeTicket = async (ticketId: string) => {
  await from("tickets").update({ status: "closed" }).eq("id", ticketId);
};

export const updateTicketStatus = async (ticketId: string, status: string) => {
  await from("tickets").update({ status }).eq("id", ticketId);
};

export const getLastSender = (ticket: Ticket): "user" | "admin" | null => {
  if (ticket.messages.length === 0) return null;
  return ticket.messages[ticket.messages.length - 1].sender;
};

// ─── Triggers ────────────────────────────────────────────────────────────────
export const getTriggers = async (): Promise<Trigger[]> => {
  const { data, error } = await from("triggers").select("*").order("created_at");
  if (error) { console.error("Failed to fetch triggers:", error); return []; }
  return (data || []).map((t: any) => ({
    id: t.id, keyword: t.keyword, responseText: t.response_text,
    responseImage: t.response_image || undefined, enabled: t.enabled,
  }));
};

export const addTrigger = async (trigger: Omit<Trigger, "id">): Promise<string> => {
  const id = Date.now().toString(36);
  await from("triggers").insert({
    id, keyword: trigger.keyword, response_text: trigger.responseText,
    response_image: trigger.responseImage || null, enabled: trigger.enabled,
  });
  return id;
};

export const toggleTriggerEnabled = async (id: string, enabled: boolean) => {
  await from("triggers").update({ enabled }).eq("id", id);
};

export const deleteTriggerById = async (id: string) => {
  await from("triggers").delete().eq("id", id);
};

export const checkTriggers = async (text: string): Promise<Trigger | null> => {
  const { data, error } = await from("triggers").select("*").eq("enabled", true);
  if (error || !data) { console.error("Failed to check triggers:", error); return null; }
  const lower = text.toLowerCase();
  const triggers: Trigger[] = data.map((t: any) => ({
    id: t.id, keyword: t.keyword, responseText: t.response_text,
    responseImage: t.response_image || undefined, enabled: t.enabled,
  }));
  return triggers.find(t => lower.includes(t.keyword.toLowerCase())) || null;
};

// ─── Site Settings ───────────────────────────────────────────────────────────
export const getSettings = async (): Promise<SiteSettings> => {
  const { data, error } = await from("site_settings").select("*");
  if (error) { console.error("Failed to fetch settings:", error); return { ...DEFAULT_SETTINGS }; }
  if (!data || data.length === 0) return { ...DEFAULT_SETTINGS };
  const map: Record<string, string> = {};
  data.forEach((r: any) => { map[r.key] = r.value; });
  return { ...DEFAULT_SETTINGS, ...map } as SiteSettings;
};

export const saveSettings = async (settings: SiteSettings) => {
  const entries = Object.entries(settings);
  for (const [key, value] of entries) {
    await from("site_settings").upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
  }
};

// ─── News ────────────────────────────────────────────────────────────────────
export const getNews = async (): Promise<NewsItem[]> => {
  const { data } = await from("news_items").select("*").order("created_at", { ascending: false });
  return (data || []).map((n: any) => ({
    id: n.id, title: n.title, content: n.content, type: n.type,
    badge: n.badge || undefined, expiresAt: n.expires_at || undefined,
    createdAt: n.created_at, active: n.active,
  }));
};

export const addNewsItem = async (item: Omit<NewsItem, "id" | "createdAt">) => {
  const id = Date.now().toString(36);
  await from("news_items").insert({
    id, title: item.title, content: item.content, type: item.type,
    badge: item.badge || null, expires_at: item.expiresAt || null, active: item.active,
  });
};

export const updateNewsItem = async (id: string, updates: { active?: boolean }) => {
  await from("news_items").update(updates).eq("id", id);
};

export const deleteNewsItem = async (id: string) => {
  await from("news_items").delete().eq("id", id);
};

// ─── Coupons ────────────────────────────────────────────────────────────────
export const getCoupons = async (): Promise<CouponCode[]> => {
  const { data } = await from("coupons").select("*").order("created_at", { ascending: false });
  return (data || []).map((c: any) => ({
    id: c.id, code: c.code, discountPercent: c.discount_percent,
    maxUses: c.max_uses, usesLeft: c.uses_left,
    planRestriction: c.plan_restriction || undefined,
    active: c.active, createdAt: c.created_at,
  }));
};

export const createCoupon = async (coupon: { code: string; discountPercent: number; maxUses: number; planRestriction?: string; active: boolean }) => {
  const id = Date.now().toString(36);
  await from("coupons").insert({
    id, code: coupon.code, discount_percent: coupon.discountPercent,
    max_uses: coupon.maxUses, uses_left: coupon.maxUses,
    plan_restriction: coupon.planRestriction || null, active: coupon.active,
  });
};

export const updateCoupon = async (id: string, updates: { active?: boolean }) => {
  await from("coupons").update(updates).eq("id", id);
};

export const deleteCouponById = async (id: string) => {
  await from("coupons").delete().eq("id", id);
};

export const validateCoupon = async (code: string, planType?: string): Promise<{ valid: boolean; discount: number; message: string }> => {
  const { data } = await from("coupons").select("*").ilike("code", code).maybeSingle();
  if (!data) return { valid: false, discount: 0, message: "Invalid coupon code" };
  if (!data.active) return { valid: false, discount: 0, message: "Coupon is inactive" };
  if (data.uses_left <= 0) return { valid: false, discount: 0, message: "Coupon has been fully used" };
  if (data.plan_restriction && planType && data.plan_restriction !== planType)
    return { valid: false, discount: 0, message: `This coupon only works on ${data.plan_restriction} plans` };
  return { valid: true, discount: data.discount_percent, message: `${data.discount_percent}% discount applied!` };
};

export const useCoupon = async (code: string) => {
  const { data } = await from("coupons").select("*").ilike("code", code).maybeSingle();
  if (data && data.uses_left > 0) {
    await from("coupons").update({ uses_left: data.uses_left - 1 }).eq("id", data.id);
  }
};

// ─── Flash Sales ────────────────────────────────────────────────────────────
export const getFlashSales = async (): Promise<FlashSale[]> => {
  const { data } = await from("flash_sales").select("*").order("created_at", { ascending: false });
  return (data || []).map((s: any) => ({
    id: s.id, title: s.title, description: s.description,
    discountPercent: s.discount_percent, endTime: s.end_time,
    active: s.active, createdAt: s.created_at,
  }));
};

export const createFlashSale = async (sale: { title: string; description: string; discountPercent: number; endTime: string; active: boolean }) => {
  await from("flash_sales").insert({
    title: sale.title, description: sale.description,
    discount_percent: sale.discountPercent, end_time: sale.endTime, active: sale.active,
  });
};

export const updateFlashSale = async (id: string, updates: { active?: boolean }) => {
  await from("flash_sales").update(updates).eq("id", id);
};

export const deleteFlashSale = async (id: string) => {
  await from("flash_sales").delete().eq("id", id);
};

// ─── Webhook Settings ────────────────────────────────────────────────────────
export const getWebhookSettings = async (): Promise<WebhookSettings> => {
  const { data } = await from("webhook_settings").select("*").limit(1).maybeSingle();
  return data
    ? { discordWebhookUrl: data.discord_webhook_url, enabled: data.enabled, discordPingId: data.discord_ping_id || "" }
    : { discordWebhookUrl: "", enabled: false, discordPingId: "" };
};

export const saveWebhookSettings = async (settings: WebhookSettings) => {
  const { data: existing } = await from("webhook_settings").select("id").limit(1).maybeSingle();
  if (existing) {
    await from("webhook_settings").update({
      discord_webhook_url: settings.discordWebhookUrl, enabled: settings.enabled,
      discord_ping_id: settings.discordPingId || "",
    }).eq("id", existing.id);
  } else {
    await from("webhook_settings").insert({
      discord_webhook_url: settings.discordWebhookUrl, enabled: settings.enabled,
      discord_ping_id: settings.discordPingId || "",
    });
  }
};

// ─── Cart (localStorage — stays per-browser) ────────────────────────────────
const CART_KEY = "zeyroncloud_cart";
export const getCart = (): CartItem[] => {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); } catch { return []; }
};
export const saveCart = (cart: CartItem[]) => localStorage.setItem(CART_KEY, JSON.stringify(cart));
export const addToCart = (item: Omit<CartItem, "id">): void => {
  const cart = getCart();
  cart.push({ ...item, id: Date.now().toString(36) });
  saveCart(cart);
};
export const removeFromCart = (id: string): void => saveCart(getCart().filter(i => i.id !== id));
export const clearCart = (): void => saveCart([]);

// ─── Discord Webhook ────────────────────────────────────────────────────────
const sendDiscordWebhook = async (ticket: { id: string; email: string; type: string; specs: Record<string, string> }) => {
  try {
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/discord-webhook`;
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
      body: JSON.stringify({ type: "new_ticket", ticket }),
    });
  } catch (e) { console.error("Webhook error:", e); }
};

const sendDiscordNeedsReply = async (ticketId: string, email: string) => {
  try {
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/discord-webhook`;
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
      body: JSON.stringify({ type: "needs_reply", ticketId, email }),
    });
  } catch (e) { console.error("Webhook error:", e); }
};
