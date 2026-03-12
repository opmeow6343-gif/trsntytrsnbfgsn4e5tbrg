import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { createTicket, addMessage, validateCoupon, useCoupon } from "@/lib/storage";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Cpu, MemoryStick, HardDrive, Users, IndianRupee,
  Upload, CheckCircle2, Loader2, Tag, ArrowRight, ArrowLeft,
  MessageCircle, Copy, Sparkles, ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import qrInr from "@/assets/qr-inr.png";
import qrPkr from "@/assets/qr-pkr.png";

export interface CheckoutPlan {
  name: string;
  type: "minecraft" | "bot" | "booster" | "vps";
  ram: string;
  cpu: string;
  storage: string;
  price: number;
  players?: number;
  cpuType?: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: CheckoutPlan | null;
}

type Currency = "INR" | "PKR";

const INR_TO_PKR = 3.3;
const DISCORD_INVITE = "https://discord.gg/zeyron";

const currencyConfig: Record<Currency, { symbol: string; label: string; flag: string; qr: string; paymentMethod: string; accountInfo: string; accountName: string }> = {
  INR: { symbol: "₹", label: "INR", flag: "🇮🇳", qr: qrInr, paymentMethod: "UPI", accountInfo: "", accountName: "" },
  PKR: { symbol: "Rs", label: "PKR", flag: "🇵🇰", qr: qrPkr, paymentMethod: "NayaPay", accountInfo: "MuhammadArshad.@nayapay", accountName: "MUHAMMAD ARSHAD" },
};

const detectCurrency = (): Currency => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz.startsWith("Asia/Karachi") || tz.startsWith("Asia/Islamabad")) return "PKR";
  } catch {}
  return "INR";
};

const CheckoutDialog = ({ open, onOpenChange, plan }: Props) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [currency, setCurrency] = useState<Currency>(detectCurrency);
  const [upiId, setUpiId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [utr, setUtr] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] = useState<{ valid: boolean; discount: number; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [ticketId, setTicketId] = useState("");
  const [panelEmail, setPanelEmail] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const fetchSettings = async () => {
      const { data } = await (supabase as any).from("site_settings").select("*").in("key", ["upi_id"]);
      if (data) {
        data.forEach((r: any) => {
          if (r.key === "upi_id") setUpiId(r.value);
        });
      }
    };
    fetchSettings();
  }, [open]);

  useEffect(() => {
    if (!open) { setStep(1); setFile(null); setPreview(null); setUtr(""); setCouponCode(""); setCouponResult(null); setTicketId(""); setPanelEmail(""); }
  }, [open]);

  const basePrice = plan?.price || 0;
  const convertedPrice = currency === "PKR" ? Math.round(basePrice * INR_TO_PKR) : basePrice;
  const finalPrice = couponResult?.valid
    ? Math.round(convertedPrice * (1 - couponResult.discount / 100))
    : convertedPrice;
  const cc = currencyConfig[currency];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { toast({ title: "File too large", description: "Max 5 MB", variant: "destructive" }); return; }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleCoupon = async () => {
    if (!couponCode.trim()) return;
    const result = await validateCoupon(couponCode.trim(), plan?.type);
    setCouponResult(result);
  };

  const handleSubmit = async () => {
    if (!plan || !file || !utr.trim()) return;

    if (!session) {
      toast({ title: "Login required", description: "Please log in to place an order.", variant: "destructive" });
      onOpenChange(false);
      navigate("/auth");
      return;
    }

    setSubmitting(true);
    try {
      const ext = file.name.split(".").pop() || "png";
      const path = `${session.user.id}/${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("payment-screenshots").upload(path, file);
      if (uploadErr) throw uploadErr;

      const { data: { publicUrl } } = supabase.storage.from("payment-screenshots").getPublicUrl(path);

      const specs: Record<string, string> = {
        Plan: plan.name,
        RAM: plan.ram,
        CPU: plan.cpu,
        Storage: plan.storage,
        Currency: currency,
        "Payment Method": cc.paymentMethod,
        Price: `${cc.symbol}${finalPrice}/mo`,
        "Transaction ID (UTR)": utr.trim(),
        "Payment Screenshot": publicUrl,
        "Panel Email": panelEmail.trim(),
      };
      if (plan.players) specs["Players"] = String(plan.players);
      if (couponResult?.valid) {
        specs["Original Price"] = `${cc.symbol}${convertedPrice}/mo`;
        specs["Coupon"] = `${couponCode} (${couponResult.discount}% off)`;
      }
      if (cc.accountInfo) specs["Account Name"] = cc.accountInfo;

      const ticket = await createTicket(session.user.email, plan.type, specs, couponResult?.valid ? couponCode : undefined, couponResult?.valid ? couponResult.discount : undefined);

      const summary = `📦 **New Order (${currency})**\n${Object.entries(specs).filter(([k]) => k !== "Payment Screenshot").map(([k, v]) => `• ${k}: ${v}`).join("\n")}`;
      await addMessage(ticket.id, "user", summary, publicUrl);

      if (couponResult?.valid) await useCoupon(couponCode);

      setTicketId(ticket.id);
      setStep(4);
    } catch (err: any) {
      console.error(err);
      toast({ title: "Error", description: err.message || "Failed to submit order", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const copyOrderId = () => {
    navigator.clipboard.writeText(ticketId);
    toast({ title: "Copied!", description: `Order ID: ${ticketId}` });
  };

  if (!plan) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong border-border/15 max-w-md rounded-xl p-0 overflow-hidden">
        {/* Progress bar */}
        <div className="flex h-1">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`flex-1 transition-colors duration-300 ${step >= s ? "bg-primary" : "bg-muted/30"}`} />
          ))}
        </div>

        <div className="p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="font-bold text-base font-display">
              {step === 1 && "Order Summary"}
              {step === 2 && `Pay via ${cc.paymentMethod}`}
              {step === 3 && "Upload Payment Proof"}
              {step === 4 && "Order Confirmed!"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs">
              {step === 1 && "Review your plan, select currency, and proceed."}
              {step === 2 && `Scan the QR or use the details below to pay ${cc.symbol}${finalPrice}.`}
              {step === 3 && "Upload your payment screenshot and transaction ID."}
              {step === 4 && "Your order has been submitted successfully."}
            </DialogDescription>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {/* Step 1: Plan Summary + Currency */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                {/* Panel Registration Alert */}
                <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2.5 space-y-1.5">
                  <p className="text-[11px] text-amber-400 font-semibold">⚠️ Make sure you have registered on our Panel</p>
                  <a href="https://gp.zeyroncloud.com" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-amber-500/30 text-amber-400 hover:bg-amber-500/10">
                      <ExternalLink className="h-3 w-3" /> Register on Panel
                    </Button>
                  </a>
                </div>

                {/* Panel Email */}
                <div className="space-y-2">
                  <Label className="text-xs">Panel Email <span className="text-destructive">*</span></Label>
                  <Input value={panelEmail} onChange={e => setPanelEmail(e.target.value)} placeholder="Email used on gp.zeyroncloud.com" className="text-xs h-8" type="email" />
                  <p className="text-[10px] text-muted-foreground">Enter the email you registered with on the panel.</p>
                </div>

                {/* Currency Selector */}
                <div className="flex gap-2">
                  {(["INR", "PKR"] as Currency[]).map(c => (
                    <button
                      key={c}
                      onClick={() => { setCurrency(c); setCouponResult(null); }}
                      className={`flex-1 flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-semibold transition-all ${
                        currency === c
                          ? "border-primary bg-primary/10 text-primary shadow-sm shadow-primary/20"
                          : "border-border/30 bg-muted/5 text-muted-foreground hover:border-border/50"
                      }`}
                    >
                      <span className="text-base">{currencyConfig[c].flag}</span>
                      {currencyConfig[c].label}
                      <span className="text-[10px] opacity-60">({currencyConfig[c].paymentMethod})</span>
                    </button>
                  ))}
                </div>

                <div className="rounded-xl glass gradient-border p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm font-display">{plan.name}</span>
                    <Badge className="bg-primary/15 text-primary text-xs">{plan.type.toUpperCase()}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5"><Cpu className="h-3 w-3 text-primary" />{plan.cpu}</div>
                    <div className="flex items-center gap-1.5"><MemoryStick className="h-3 w-3 text-primary" />{plan.ram}</div>
                    <div className="flex items-center gap-1.5"><HardDrive className="h-3 w-3 text-primary" />{plan.storage}</div>
                    {plan.players && <div className="flex items-center gap-1.5"><Users className="h-3 w-3 text-primary" />Up to {plan.players} players</div>}
                  </div>
                </div>

                {/* Coupon */}
                <div className="space-y-2">
                  <Label className="text-xs">Coupon Code (optional)</Label>
                  <div className="flex gap-2">
                    <Input value={couponCode} onChange={e => { setCouponCode(e.target.value); setCouponResult(null); }} placeholder="Enter code" className="text-xs h-8" />
                    <Button variant="outline" size="sm" onClick={handleCoupon} className="text-xs h-8 px-3 shrink-0">
                      <Tag className="h-3 w-3 mr-1" /> Apply
                    </Button>
                  </div>
                  {couponResult && (
                    <p className={`text-[10px] ${couponResult.valid ? "text-green-400" : "text-destructive"}`}>{couponResult.message}</p>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-center justify-between rounded-lg bg-primary/5 border border-primary/10 px-4 py-3">
                  <span className="text-xs text-muted-foreground">Total</span>
                  <div className="flex items-center gap-2">
                    {couponResult?.valid && <span className="text-xs text-muted-foreground line-through">{cc.symbol}{convertedPrice}</span>}
                    <span className="font-extrabold text-lg text-primary font-display">{cc.symbol}{finalPrice}<span className="text-xs text-muted-foreground font-normal">/mo</span></span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <a href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full text-xs gap-1.5 border-border/30">
                      <MessageCircle className="h-3 w-3" /> Order via Discord
                    </Button>
                  </a>
                  <Button size="sm" onClick={() => setStep(2)} disabled={!panelEmail.trim()} className="flex-1 text-xs gap-1.5 glow-primary">
                    Pay with {cc.paymentMethod} <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: QR Code */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4 text-center">
                <div className="rounded-xl glass gradient-border p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-muted-foreground">Amount to Pay</span>
                    <span className="font-extrabold text-xl text-primary font-display">{cc.symbol}{finalPrice}</span>
                  </div>

                  <img src={cc.qr} alt={`${cc.paymentMethod} QR Code`} className="w-48 h-48 mx-auto rounded-lg bg-white p-2 object-contain" />

                  {currency === "INR" && upiId && (
                    <div className="mt-3">
                      <p className="text-[10px] text-muted-foreground mb-1">Or pay to UPI ID:</p>
                      <button
                        onClick={() => { navigator.clipboard.writeText(upiId); toast({ title: "Copied!", description: upiId }); }}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 border border-primary/15 px-3 py-1.5 text-xs font-mono text-primary hover:bg-primary/15 transition-colors"
                      >
                        <IndianRupee className="h-3 w-3" /> {upiId}
                      </button>
                    </div>
                  )}

                  {currency === "PKR" && cc.accountInfo && (
                    <div className="mt-3 space-y-2">
                      <div>
                        <p className="text-[10px] text-muted-foreground mb-1">NayaPay ID:</p>
                        <button
                          onClick={() => { navigator.clipboard.writeText(cc.accountInfo); toast({ title: "Copied!", description: cc.accountInfo }); }}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 border border-primary/15 px-3 py-1.5 text-xs font-mono text-primary hover:bg-primary/15 transition-colors"
                        >
                          {cc.accountInfo}
                        </button>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground mb-1">Account Name:</p>
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 border border-primary/15 px-3 py-1.5 text-xs font-semibold text-primary">
                          {cc.accountName}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-[10px] text-muted-foreground">After payment, click below to upload proof.</p>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setStep(1)} className="flex-1 text-xs gap-1.5">
                    <ArrowLeft className="h-3 w-3" /> Back
                  </Button>
                  <Button size="sm" onClick={() => setStep(3)} className="flex-1 text-xs gap-1.5 glow-primary">
                    I've Paid <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Upload Proof */}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs">Payment Screenshot *</Label>
                  <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/40 hover:border-primary/40 p-4 cursor-pointer transition-colors bg-muted/5">
                    {preview ? (
                      <img src={preview} alt="Payment proof" className="max-h-40 rounded-lg object-contain" />
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-muted-foreground/40 mb-2" />
                        <p className="text-xs text-muted-foreground">Click to upload (max 5 MB)</p>
                      </>
                    )}
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Transaction ID / UTR Number *</Label>
                  <Input value={utr} onChange={e => setUtr(e.target.value)} placeholder="e.g. 412345678901" className="text-xs h-9" />
                </div>

                {!session && (
                  <p className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
                    ⚠️ You need to log in before submitting. You'll be redirected.
                  </p>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setStep(2)} className="flex-1 text-xs gap-1.5">
                    <ArrowLeft className="h-3 w-3" /> Back
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSubmit}
                    disabled={!file || !utr.trim() || submitting}
                    className="flex-1 text-xs gap-1.5 glow-primary"
                  >
                    {submitting ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
                    {submitting ? "Submitting…" : "Submit Order"}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Success */}
            {step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4 py-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                  className="w-16 h-16 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto"
                >
                  <Sparkles className="h-8 w-8 text-primary" />
                </motion.div>

                <div>
                  <h3 className="font-display font-bold text-base mb-1">Order Submitted!</h3>
                  <p className="text-xs text-muted-foreground">We'll verify your payment and set up your server shortly.</p>
                </div>

                <div className="rounded-lg bg-muted/10 border border-border/20 px-4 py-3">
                  <p className="text-[10px] text-muted-foreground mb-1">Order ID</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-mono text-sm text-primary font-semibold">{ticketId}</span>
                    <button onClick={copyOrderId} className="text-muted-foreground hover:text-primary transition-colors">
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => { onOpenChange(false); navigate("/profile"); }} className="flex-1 text-xs gap-1.5">
                    My Orders
                  </Button>
                  <Button size="sm" onClick={() => onOpenChange(false)} className="flex-1 text-xs gap-1.5 glow-primary">
                    Done <CheckCircle2 className="h-3 w-3" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutDialog;
