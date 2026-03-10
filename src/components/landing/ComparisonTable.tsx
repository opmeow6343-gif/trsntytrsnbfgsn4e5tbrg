import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const features = [
  { name: "Starting Price (per GB)", zeyron: "₹15/mo", other1: "₹30/mo", other2: "₹50/mo" },
  { name: "DDoS Protection", zeyron: true, other1: true, other2: false },
  { name: "Instant Setup", zeyron: true, other1: false, other2: false },
  { name: "NVMe Storage", zeyron: true, other1: false, other2: true },
  { name: "24/7 Live Support", zeyron: true, other1: true, other2: false },
  { name: "Free Subdomain", zeyron: true, other1: false, other2: false },
  { name: "Uptime SLA", zeyron: "99.99%", other1: "99.5%", other2: "99%" },
  { name: "Custom Modpacks", zeyron: true, other1: true, other2: true },
];

const CellValue = ({ value }: { value: boolean | string }) => {
  if (typeof value === "string") return <span className="text-sm font-medium">{value}</span>;
  return value ? (
    <Check className="h-5 w-5 text-primary mx-auto" />
  ) : (
    <X className="h-5 w-5 text-destructive/60 mx-auto" />
  );
};

const ComparisonTable = () => (
  <section className="py-24 px-4">
    <div className="max-w-4xl mx-auto">
      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 font-display">
          Why <span className="gradient-text">ZeyronCloud</span>?
        </h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          See how we stack up against other hosting providers.
        </p>
      </motion.div>

      <motion.div
        className="rounded-2xl overflow-hidden glass gradient-border"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Header */}
        <div className="grid grid-cols-4 text-center text-xs font-semibold uppercase tracking-wider border-b border-border/30">
          <div className="p-4 text-left text-muted-foreground">Feature</div>
          <div className="p-4 bg-primary/10 text-primary">ZeyronCloud</div>
          <div className="p-4 text-muted-foreground">Host A</div>
          <div className="p-4 text-muted-foreground">Host B</div>
        </div>

        {/* Rows */}
        {features.map((f, i) => (
          <motion.div
            key={f.name}
            className="grid grid-cols-4 text-center items-center border-b border-border/20 last:border-b-0"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 * i, duration: 0.4 }}
          >
            <div className="p-3.5 text-left text-sm text-foreground/80">{f.name}</div>
            <div className="p-3.5 bg-primary/5">
              <CellValue value={f.zeyron} />
            </div>
            <div className="p-3.5">
              <CellValue value={f.other1} />
            </div>
            <div className="p-3.5">
              <CellValue value={f.other2} />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default ComparisonTable;
