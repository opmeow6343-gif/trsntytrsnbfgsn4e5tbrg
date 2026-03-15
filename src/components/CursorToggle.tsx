import { motion } from "framer-motion";
import { MousePointer, MousePointerClick } from "lucide-react";

interface CursorToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

const CursorToggle = ({ enabled, onToggle }: CursorToggleProps) => {
  return (
    <motion.button
      onClick={onToggle}
      className="h-8 w-8 rounded-full bg-secondary/50 border border-border/30 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title={enabled ? "Disable custom cursor" : "Enable custom cursor"}
    >
      <motion.div
        key={enabled ? "on" : "off"}
        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {enabled ? <MousePointerClick className="h-3.5 w-3.5" /> : <MousePointer className="h-3.5 w-3.5" />}
      </motion.div>
    </motion.button>
  );
};

export default CursorToggle;
