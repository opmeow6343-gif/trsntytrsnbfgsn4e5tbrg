import { motion, useInView, animate } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Shield, Server, Clock, Users, Cpu, Globe, Zap, Award } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts";

const AnimatedCounter = ({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) => {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, value, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v * 100) / 100),
    });
    return () => controls.stop();
  }, [isInView, value]);

  return <span ref={ref}>{prefix}{Number.isInteger(value) ? Math.round(display) : display.toFixed(2)}{suffix}</span>;
};

const uptimeData = [
  { name: "Jan", uptime: 99.98 },
  { name: "Feb", uptime: 99.99 },
  { name: "Mar", uptime: 99.99 },
  { name: "Apr", uptime: 100 },
  { name: "May", uptime: 99.99 },
  { name: "Jun", uptime: 99.98 },
  { name: "Jul", uptime: 99.99 },
  { name: "Aug", uptime: 100 },
  { name: "Sep", uptime: 99.99 },
  { name: "Oct", uptime: 99.99 },
  { name: "Nov", uptime: 100 },
  { name: "Dec", uptime: 99.99 },
];

const resourceData = [
  { name: "CPU", value: 35, color: "hsl(160, 100%, 45%)" },
  { name: "RAM", value: 45, color: "hsl(200, 100%, 50%)" },
  { name: "Storage", value: 20, color: "hsl(45, 100%, 55%)" },
];

const performanceData = [
  { name: "Mon", tps: 19.8 },
  { name: "Tue", tps: 19.9 },
  { name: "Wed", tps: 20 },
  { name: "Thu", tps: 19.7 },
  { name: "Fri", tps: 19.9 },
  { name: "Sat", tps: 20 },
  { name: "Sun", tps: 19.8 },
];

const stats = [
  { icon: Server, label: "Active Services", value: 1000, suffix: "+" },
  { icon: Cpu, label: "Server Plans", value: 60, suffix: "+" },
  { icon: Globe, label: "Games Supported", value: 20, suffix: "+" },
  { icon: Users, label: "Satisfied Customers", value: 3000, suffix: "+" },
];

const TrustStatsSection = () => {
  return (
    <section className="relative py-28 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <motion.span className="text-[10px] font-medium text-primary tracking-[0.25em] uppercase block mb-3 font-mono">
            INFRASTRUCTURE
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter font-display">
            Built for{" "}
            <span className="gradient-text">Reliability</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-sm max-w-lg mx-auto">
            Real-time metrics from our infrastructure. Transparent performance you can trust.
          </p>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-16">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -4 }}
              className="rounded-xl glass gradient-border p-5 text-center card-hover"
            >
              <stat.icon className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="font-extrabold text-2xl text-foreground font-display">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {/* Uptime */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="rounded-xl glass gradient-border p-6"
          >
            <h3 className="text-sm font-bold mb-1 font-display">Uptime History</h3>
            <p className="text-[10px] text-muted-foreground mb-4">12-month average: 99.99%</p>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={uptimeData}>
                  <defs>
                    <linearGradient id="uptimeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(160, 100%, 45%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(160, 100%, 45%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[99.95, 100.01]} tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={35} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '11px' }} />
                  <Area type="monotone" dataKey="uptime" stroke="hsl(160, 100%, 45%)" fill="url(#uptimeGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Resource Pie */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="rounded-xl glass gradient-border p-6"
          >
            <h3 className="text-sm font-bold mb-1 font-display">Resource Allocation</h3>
            <p className="text-[10px] text-muted-foreground mb-4">Optimized for gaming workloads</p>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={resourceData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={5} dataKey="value">
                    {resourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {resourceData.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                  {d.name}
                </div>
              ))}
            </div>
          </motion.div>

          {/* TPS Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="rounded-xl glass gradient-border p-6"
          >
            <h3 className="text-sm font-bold mb-1 font-display">Server TPS (Weekly)</h3>
            <p className="text-[10px] text-muted-foreground mb-4">Avg 19.9 TPS — near perfect</p>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[19, 20.2]} tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '11px' }} />
                  <Bar dataKey="tps" fill="hsl(160, 100%, 45%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TrustStatsSection;
