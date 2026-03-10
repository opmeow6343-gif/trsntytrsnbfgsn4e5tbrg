import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const DISCORD_INVITE = "https://discord.gg/pBXUVRne";

interface Props { open: boolean; onOpenChange: (open: boolean) => void; }

const DiscordOrderDialog = ({ open, onOpenChange }: Props) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="glass-strong border-border/15 max-w-sm rounded-xl">
      <DialogHeader>
        <DialogTitle className="font-bold text-base font-display">Website Billing is Off</DialogTitle>
        <DialogDescription className="text-muted-foreground text-xs">Order from our Discord by creating a ticket.</DialogDescription>
      </DialogHeader>
      <motion.div
        className="rounded-xl glass gradient-border p-6 text-center space-y-4"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
      >
        <div className="mx-auto w-14 h-14 rounded-xl bg-primary/10 border border-primary/12 flex items-center justify-center">
          <MessageCircle className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="font-bold text-sm font-display">Order via Discord</p>
          <p className="text-xs text-muted-foreground mt-1">Create a ticket for instant help.</p>
        </div>
        <a href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer" className="block">
          <Button className="w-full glow-primary gap-2 text-xs font-semibold h-10 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
            <ExternalLink className="h-3.5 w-3.5" /> Join Discord & Order
          </Button>
        </a>
      </motion.div>
    </DialogContent>
  </Dialog>
);

export default DiscordOrderDialog;
