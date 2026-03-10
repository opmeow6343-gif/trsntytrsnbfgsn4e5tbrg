import { motion } from "framer-motion";

const SectionDivider = () => (
  <div className="flex justify-center py-2">
    <motion.div
      className="h-px w-full max-w-xs bg-gradient-to-r from-transparent via-primary/30 to-transparent"
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    />
  </div>
);

export default SectionDivider;
