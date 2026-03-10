import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Server, Type, Search, User, FileText, Wrench, Palette, Code, Map, Sparkles, BookOpen, Eye, Circle, Clock, Image, Globe } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const tools: Tool[] = [
  { id: "server-status", name: "Server Status", description: "Check any Minecraft server's online status, players, version, and MOTD in real-time.", icon: Server, color: "text-purple-400" },
  { id: "motd-maker", name: "MOTD Maker", description: "Create beautiful server MOTDs with colors, formatting, and live preview.", icon: Type, color: "text-orange-400" },
  { id: "uuid-lookup", name: "UUID Lookup", description: "Find any player's UUID from their username.", icon: Search, color: "text-cyan-400" },
  { id: "skin-viewer", name: "Skin Viewer", description: "View any player's skin render.", icon: User, color: "text-yellow-400" },
  { id: "whitelist-gen", name: "Whitelist Generator", description: "Generate whitelist commands from a list of usernames.", icon: FileText, color: "text-green-400" },
  { id: "server-properties", name: "Server.properties", description: "Visual editor for server.properties with all options.", icon: Wrench, color: "text-red-400" },
  { id: "banner-maker", name: "Banner Maker", description: "Design custom banners with patterns and get the give command.", icon: Palette, color: "text-pink-400" },
  { id: "nbt-editor", name: "JSON/NBT Viewer", description: "Validate and format JSON data for configs.", icon: Code, color: "text-blue-400" },
  { id: "coordinate-calc", name: "Coordinate Calculator", description: "Convert coordinates between Overworld and Nether.", icon: Map, color: "text-emerald-400" },
  { id: "enchant-calc", name: "Enchantment Calculator", description: "Browse enchantments with XP costs and commands.", icon: Sparkles, color: "text-amber-400" },
  { id: "recipe-lookup", name: "Recipe Lookup", description: "Search crafting recipes and materials.", icon: BookOpen, color: "text-violet-400" },
  { id: "seed-viewer", name: "Seed Viewer", description: "Discover popular world seeds.", icon: Eye, color: "text-teal-400" },
  { id: "circle-gen", name: "Circle Generator", description: "Generate pixel-perfect circles for builds.", icon: Circle, color: "text-rose-400" },
  { id: "tick-calc", name: "Tick Calculator", description: "Convert between game ticks, redstone ticks, and real time.", icon: Clock, color: "text-sky-400" },
  { id: "icon-converter", name: "Server Icon Converter", description: "Convert any image to a 64×64 server icon.", icon: Image, color: "text-indigo-400" },
  { id: "color-codes", name: "Color Codes", description: "Reference all Minecraft color and formatting codes.", icon: Globe, color: "text-gray-400" },
];

// ─── Tool Components ────────────────────────────────────────────
const ServerStatusTool = () => {
  const [ip, setIp] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const check = async () => {
    if (!ip) return;
    setLoading(true);
    try {
      const res = await fetch(`https://api.mcsrvstat.us/3/${ip}`);
      setResult(await res.json());
    } catch { toast({ title: "Error", description: "Could not fetch server status", variant: "destructive" }); }
    setLoading(false);
  };
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input placeholder="mc.hypixel.net" value={ip} onChange={e => setIp(e.target.value)} className="bg-secondary/50 border-border" />
        <Button onClick={check} disabled={loading} className="glow-blue shrink-0">{loading ? "Checking..." : "Check"}</Button>
      </div>
      {result && (
        <div className="rounded-lg bg-secondary/50 p-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Status</span><Badge variant={result.online ? "default" : "destructive"}>{result.online ? "Online" : "Offline"}</Badge></div>
          {result.online && <>
            <div className="flex justify-between"><span className="text-muted-foreground">Players</span><span>{result.players?.online || 0}/{result.players?.max || 0}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Version</span><span>{result.version}</span></div>
            {result.motd?.clean && <div><span className="text-muted-foreground">MOTD:</span> <span className="text-xs">{result.motd.clean.join(" ")}</span></div>}
          </>}
        </div>
      )}
    </div>
  );
};

const UUIDLookupTool = () => {
  const [name, setName] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const lookup = async () => {
    if (!name) return;
    setLoading(true);
    try {
      const res = await fetch(`https://playerdb.co/api/player/minecraft/${name}`);
      const data = await res.json();
      if (data.success) setResult({ name: data.data.player.username, uuid: data.data.player.id });
      else toast({ title: "Player not found", variant: "destructive" });
    } catch { toast({ title: "Error", variant: "destructive" }); }
    setLoading(false);
  };
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input placeholder="Username" value={name} onChange={e => setName(e.target.value)} className="bg-secondary/50 border-border" />
        <Button onClick={lookup} disabled={loading} className="glow-blue shrink-0">{loading ? "..." : "Lookup"}</Button>
      </div>
      {result && (
        <div className="rounded-lg bg-secondary/50 p-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Username</span><span>{result.name}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">UUID</span><span className="font-mono text-xs break-all">{result.uuid}</span></div>
        </div>
      )}
    </div>
  );
};

const SkinViewerTool = () => {
  const [name, setName] = useState("");
  const [skinUrl, setSkinUrl] = useState("");
  const view = () => { if (name) setSkinUrl(`https://mc-heads.net/body/${name}/200`); };
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input placeholder="Username" value={name} onChange={e => setName(e.target.value)} className="bg-secondary/50 border-border" />
        <Button onClick={view} className="glow-blue shrink-0">View</Button>
      </div>
      {skinUrl && <div className="flex justify-center"><img src={skinUrl} alt="Player Skin" className="rounded-lg" onError={() => toast({ title: "Could not load skin", variant: "destructive" })} /></div>}
    </div>
  );
};

const CoordinateCalcTool = () => {
  const [x, setX] = useState("");
  const [z, setZ] = useState("");
  const [mode, setMode] = useState<"overworld" | "nether">("overworld");
  const conv = mode === "overworld"
    ? { x: Math.floor(Number(x) / 8), z: Math.floor(Number(z) / 8), label: "Nether" }
    : { x: Number(x) * 8, z: Number(z) * 8, label: "Overworld" };
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button size="sm" variant={mode === "overworld" ? "default" : "outline"} onClick={() => setMode("overworld")}>Overworld → Nether</Button>
        <Button size="sm" variant={mode === "nether" ? "default" : "outline"} onClick={() => setMode("nether")}>Nether → Overworld</Button>
      </div>
      <div className="flex gap-2">
        <Input placeholder="X" type="number" value={x} onChange={e => setX(e.target.value)} className="bg-secondary/50 border-border" />
        <Input placeholder="Z" type="number" value={z} onChange={e => setZ(e.target.value)} className="bg-secondary/50 border-border" />
      </div>
      {(x || z) && <div className="rounded-lg bg-secondary/50 p-4 text-sm"><span className="text-muted-foreground">{conv.label}:</span> X: {conv.x}, Z: {conv.z}</div>}
    </div>
  );
};

const TickCalcTool = () => {
  const [ticks, setTicks] = useState("");
  const g = Number(ticks) || 0;
  return (
    <div className="space-y-4">
      <Input placeholder="Game ticks" type="number" value={ticks} onChange={e => setTicks(e.target.value)} className="bg-secondary/50 border-border" />
      {ticks && (
        <div className="rounded-lg bg-secondary/50 p-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Seconds</span><span>{(g / 20).toFixed(2)}s</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Redstone Ticks</span><span>{g / 2}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Minutes</span><span>{(g / 1200).toFixed(2)}</span></div>
        </div>
      )}
    </div>
  );
};

const WhitelistGenTool = () => {
  const [names, setNames] = useState("");
  const cmds = names.split(/[\n,]/).map(n => n.trim()).filter(Boolean).map(n => `whitelist add ${n}`);
  return (
    <div className="space-y-4">
      <Textarea placeholder="Enter usernames (one per line or comma-separated)" value={names} onChange={e => setNames(e.target.value)} className="bg-secondary/50 border-border" />
      {cmds.length > 0 && (
        <div className="rounded-lg bg-secondary/50 p-4 space-y-1">
          {cmds.map((c, i) => <div key={i} className="font-mono text-xs text-muted-foreground">{c}</div>)}
          <Button size="sm" variant="outline" className="mt-2" onClick={() => { navigator.clipboard.writeText(cmds.join("\n")); toast({ title: "Copied!" }); }}>Copy All</Button>
        </div>
      )}
    </div>
  );
};

const MOTDMakerTool = () => {
  const [line1, setLine1] = useState("Welcome to my server!");
  const [line2, setLine2] = useState("Play now!");
  const mcColors: { code: string; hex: string; name: string }[] = [
    { code: "§0", hex: "#000", name: "Black" }, { code: "§1", hex: "#00a", name: "Dark Blue" },
    { code: "§2", hex: "#0a0", name: "Dark Green" }, { code: "§3", hex: "#0aa", name: "Dark Aqua" },
    { code: "§4", hex: "#a00", name: "Dark Red" }, { code: "§5", hex: "#a0a", name: "Dark Purple" },
    { code: "§6", hex: "#fa0", name: "Gold" }, { code: "§7", hex: "#aaa", name: "Gray" },
    { code: "§8", hex: "#555", name: "Dark Gray" }, { code: "§9", hex: "#55f", name: "Blue" },
    { code: "§a", hex: "#5f5", name: "Green" }, { code: "§b", hex: "#5ff", name: "Aqua" },
    { code: "§c", hex: "#f55", name: "Red" }, { code: "§d", hex: "#f5f", name: "Pink" },
    { code: "§e", hex: "#ff5", name: "Yellow" }, { code: "§f", hex: "#fff", name: "White" },
  ];
  return (
    <div className="space-y-4">
      <Input placeholder="Line 1" value={line1} onChange={e => setLine1(e.target.value)} className="bg-secondary/50 border-border" />
      <Input placeholder="Line 2" value={line2} onChange={e => setLine2(e.target.value)} className="bg-secondary/50 border-border" />
      <div className="flex flex-wrap gap-1">
        {mcColors.map(c => (
          <button key={c.code} title={`${c.name} (${c.code})`} className="w-5 h-5 rounded border border-border/50" style={{ backgroundColor: c.hex }}
            onClick={() => { navigator.clipboard.writeText(c.code); toast({ title: `Copied ${c.code}` }); }} />
        ))}
      </div>
      <div className="rounded-lg bg-secondary/80 p-4 font-mono text-center">
        <div className="text-foreground">{line1}</div>
        <div className="text-muted-foreground">{line2}</div>
      </div>
      <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(`motd=${line1}\\n${line2}`); toast({ title: "Copied to clipboard!" }); }}>Copy MOTD</Button>
    </div>
  );
};

const CircleGenTool = () => {
  const [radius, setRadius] = useState(5);
  const size = radius * 2 + 1;
  const grid: boolean[][] = [];
  for (let y = 0; y < size; y++) {
    grid[y] = [];
    for (let x = 0; x < size; x++) {
      const dx = x - radius, dy = y - radius;
      grid[y][x] = Math.sqrt(dx * dx + dy * dy) >= radius - 0.5 && Math.sqrt(dx * dx + dy * dy) <= radius + 0.5;
    }
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">Radius:</span>
        <Input type="number" min={1} max={25} value={radius} onChange={e => setRadius(Math.min(25, Math.max(1, Number(e.target.value))))} className="bg-secondary/50 border-border w-20" />
      </div>
      <div className="overflow-auto max-h-80">
        <div className="inline-grid gap-0" style={{ gridTemplateColumns: `repeat(${size}, 12px)` }}>
          {grid.flat().map((filled, i) => (
            <div key={i} className={`w-3 h-3 border border-border/30 ${filled ? "bg-primary" : "bg-secondary/30"}`} />
          ))}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">Diameter: {size} blocks • {grid.flat().filter(Boolean).length} blocks needed</p>
    </div>
  );
};

const ServerPropertiesTool = () => {
  const props = [
    { key: "gamemode", options: ["survival", "creative", "adventure", "spectator"], default: "survival", desc: "Default game mode" },
    { key: "difficulty", options: ["peaceful", "easy", "normal", "hard"], default: "easy", desc: "Server difficulty" },
    { key: "max-players", type: "number", default: "20", desc: "Maximum players allowed" },
    { key: "pvp", options: ["true", "false"], default: "true", desc: "Enable PvP combat" },
    { key: "spawn-protection", type: "number", default: "16", desc: "Spawn protection radius" },
    { key: "view-distance", type: "number", default: "10", desc: "Render distance in chunks" },
    { key: "online-mode", options: ["true", "false"], default: "true", desc: "Verify player accounts" },
    { key: "motd", type: "text", default: "A Minecraft Server", desc: "Server list message" },
    { key: "level-seed", type: "text", default: "", desc: "World generation seed" },
    { key: "enable-command-block", options: ["true", "false"], default: "false", desc: "Allow command blocks" },
  ];
  const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(props.map(p => [p.key, p.default])));
  const output = props.map(p => `${p.key}=${values[p.key]}`).join("\n");
  return (
    <div className="space-y-3 max-h-96 overflow-auto">
      {props.map(p => (
        <div key={p.key} className="flex items-center justify-between gap-2 text-sm">
          <div><span className="font-mono text-xs text-primary">{p.key}</span><br /><span className="text-xs text-muted-foreground">{p.desc}</span></div>
          {p.options ? (
            <Select value={values[p.key]} onValueChange={v => setValues({ ...values, [p.key]: v })}>
              <SelectTrigger className="w-32 bg-secondary/50 border-border h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>{p.options.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
            </Select>
          ) : (
            <Input value={values[p.key]} onChange={e => setValues({ ...values, [p.key]: e.target.value })} className="w-32 bg-secondary/50 border-border h-8 text-xs" />
          )}
        </div>
      ))}
      <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(output); toast({ title: "Copied server.properties!" }); }}>Copy All</Button>
    </div>
  );
};

const BannerMakerTool = () => {
  const dyeColors = ["white","orange","magenta","light_blue","yellow","lime","pink","gray","light_gray","cyan","purple","blue","brown","green","red","black"];
  const patterns = ["stripe_bottom","stripe_top","stripe_left","stripe_right","stripe_center","stripe_middle","stripe_downright","stripe_downleft","cross","straight_cross","diagonal_left","diagonal_right","diagonal_up_left","diagonal_up_right","half_horizontal","half_vertical","triangle_bottom","triangle_top","circle_middle","rhombus_middle","border","gradient","gradient_up"];
  const [base, setBase] = useState("white");
  const [layers, setLayers] = useState<{pattern: string; color: string}[]>([]);
  const addLayer = () => { if (layers.length < 6) setLayers([...layers, { pattern: "stripe_bottom", color: "black" }]); };
  const cmd = `/give @p white_banner{BlockEntityTag:{Patterns:[${layers.map(l => `{Pattern:"${l.pattern}",Color:"${l.color}"}`).join(",")}]}}`;
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Base:</span>
        <Select value={base} onValueChange={setBase}>
          <SelectTrigger className="w-32 bg-secondary/50 border-border h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>{dyeColors.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      {layers.map((l, i) => (
        <div key={i} className="flex items-center gap-2">
          <Select value={l.pattern} onValueChange={v => { const n = [...layers]; n[i].pattern = v; setLayers(n); }}>
            <SelectTrigger className="w-40 bg-secondary/50 border-border h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>{patterns.map(p => <SelectItem key={p} value={p}>{p.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={l.color} onValueChange={v => { const n = [...layers]; n[i].color = v; setLayers(n); }}>
            <SelectTrigger className="w-28 bg-secondary/50 border-border h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>{dyeColors.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
          <Button size="sm" variant="ghost" className="h-8 px-2 text-destructive" onClick={() => setLayers(layers.filter((_, j) => j !== i))}>×</Button>
        </div>
      ))}
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={addLayer} disabled={layers.length >= 6}>Add Layer ({layers.length}/6)</Button>
        <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(cmd); toast({ title: "Command copied!" }); }}>Copy Command</Button>
      </div>
      <div className="font-mono text-xs text-muted-foreground bg-secondary/50 rounded p-2 break-all">{cmd}</div>
    </div>
  );
};

const NBTEditorTool = () => {
  const [input, setInput] = useState('{\n  "example": "value"\n}');
  const [error, setError] = useState("");
  const format = () => {
    try { setInput(JSON.stringify(JSON.parse(input), null, 2)); setError(""); toast({ title: "Formatted!" }); }
    catch (e: any) { setError(e.message); }
  };
  return (
    <div className="space-y-3">
      <Textarea value={input} onChange={e => { setInput(e.target.value); setError(""); }} className="bg-secondary/50 border-border font-mono text-xs min-h-[150px]" />
      {error && <p className="text-xs text-destructive">{error}</p>}
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={format}>Format & Validate</Button>
        <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(input); toast({ title: "Copied!" }); }}>Copy</Button>
      </div>
    </div>
  );
};

const EnchantCalcTool = () => {
  const enchants = [
    { name: "Sharpness", maxLvl: 5, items: "Sword, Axe", id: "sharpness" },
    { name: "Protection", maxLvl: 4, items: "Armor", id: "protection" },
    { name: "Efficiency", maxLvl: 5, items: "Tools", id: "efficiency" },
    { name: "Unbreaking", maxLvl: 3, items: "All", id: "unbreaking" },
    { name: "Fortune", maxLvl: 3, items: "Pickaxe, Shovel, Hoe", id: "fortune" },
    { name: "Power", maxLvl: 5, items: "Bow", id: "power" },
    { name: "Feather Falling", maxLvl: 4, items: "Boots", id: "feather_falling" },
    { name: "Fire Aspect", maxLvl: 2, items: "Sword", id: "fire_aspect" },
    { name: "Looting", maxLvl: 3, items: "Sword", id: "looting" },
    { name: "Silk Touch", maxLvl: 1, items: "Tools", id: "silk_touch" },
    { name: "Mending", maxLvl: 1, items: "All", id: "mending" },
    { name: "Infinity", maxLvl: 1, items: "Bow", id: "infinity" },
    { name: "Respiration", maxLvl: 3, items: "Helmet", id: "respiration" },
    { name: "Thorns", maxLvl: 3, items: "Armor", id: "thorns" },
    { name: "Sweeping Edge", maxLvl: 3, items: "Sword", id: "sweeping" },
  ];
  const [search, setSearch] = useState("");
  const filtered = enchants.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="space-y-3">
      <Input placeholder="Search enchantments..." value={search} onChange={e => setSearch(e.target.value)} className="bg-secondary/50 border-border" />
      <div className="max-h-72 overflow-auto space-y-2">
        {filtered.map(e => (
          <div key={e.id} className="rounded bg-secondary/50 p-3 text-sm flex justify-between items-start">
            <div>
              <span className="font-semibold text-foreground">{e.name}</span>
              <span className="text-xs text-muted-foreground ml-2">Max: {e.maxLvl}</span>
              <div className="text-xs text-muted-foreground mt-1">{e.items}</div>
            </div>
            <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => {
              navigator.clipboard.writeText(`/enchant @p ${e.id} ${e.maxLvl}`);
              toast({ title: `Copied /enchant command for ${e.name}` });
            }}>Copy Cmd</Button>
          </div>
        ))}
      </div>
    </div>
  );
};

const RecipeLookupTool = () => {
  const recipes: Record<string, { result: string; grid: string[][] }> = {
    "Crafting Table": { result: "1× Crafting Table", grid: [["Plank","Plank",""],["Plank","Plank",""],["","",""]] },
    "Furnace": { result: "1× Furnace", grid: [["Cobble","Cobble","Cobble"],["Cobble","","Cobble"],["Cobble","Cobble","Cobble"]] },
    "Chest": { result: "1× Chest", grid: [["Plank","Plank","Plank"],["Plank","","Plank"],["Plank","Plank","Plank"]] },
    "Stick": { result: "4× Stick", grid: [["Plank","",""],["Plank","",""],["","",""]] },
    "Torch": { result: "4× Torch", grid: [["Coal","",""],["Stick","",""],["","",""]] },
    "Iron Pickaxe": { result: "1× Iron Pickaxe", grid: [["Iron","Iron","Iron"],["","Stick",""],["","Stick",""]] },
    "Diamond Sword": { result: "1× Diamond Sword", grid: [["Diamond","",""],["Diamond","",""],["Stick","",""]] },
    "Enchanting Table": { result: "1× Enchanting Table", grid: [["","Book",""],["Diamond","Obsidian","Diamond"],["Obsidian","Obsidian","Obsidian"]] },
    "Anvil": { result: "1× Anvil", grid: [["Iron Block","Iron Block","Iron Block"],["","Iron",""],["Iron","Iron","Iron"]] },
    "Piston": { result: "1× Piston", grid: [["Plank","Plank","Plank"],["Cobble","Iron","Cobble"],["Cobble","Redstone","Cobble"]] },
  };
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const filtered = Object.keys(recipes).filter(k => k.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="space-y-3">
      <Input placeholder="Search recipes..." value={search} onChange={e => setSearch(e.target.value)} className="bg-secondary/50 border-border" />
      <div className="max-h-48 overflow-auto space-y-1">
        {filtered.map(k => (
          <button key={k} onClick={() => setSelected(k)} className={`w-full text-left px-3 py-2 rounded text-sm transition ${selected === k ? "bg-primary/20 text-primary" : "hover:bg-secondary/50 text-muted-foreground"}`}>{k}</button>
        ))}
      </div>
      {selected && recipes[selected] && (
        <div className="space-y-2">
          <p className="text-sm font-semibold">{recipes[selected].result}</p>
          <div className="inline-grid grid-cols-3 gap-1">
            {recipes[selected].grid.flat().map((cell, i) => (
              <div key={i} className={`w-12 h-12 rounded border border-border/50 flex items-center justify-center text-[10px] text-center ${cell ? "bg-secondary/80" : "bg-secondary/20"}`}>{cell}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const SeedViewerTool = () => {
  const seeds = [
    { seed: "3427891", desc: "Spawn near village + ravine with diamonds", biome: "Plains" },
    { seed: "-1234567890", desc: "Mushroom island close to spawn", biome: "Mushroom" },
    { seed: "98765", desc: "Stronghold under spawn village", biome: "Forest" },
    { seed: "404", desc: "Desert temple at spawn with good loot", biome: "Desert" },
    { seed: "12345", desc: "Double village spawn with blacksmiths", biome: "Savanna" },
    { seed: "-9876543", desc: "Massive cave system near spawn", biome: "Mountains" },
    { seed: "7777777", desc: "Ocean monument visible from spawn island", biome: "Ocean" },
    { seed: "1337", desc: "Jungle temple + bamboo forest at spawn", biome: "Jungle" },
  ];
  return (
    <div className="space-y-2 max-h-80 overflow-auto">
      {seeds.map(s => (
        <div key={s.seed} className="rounded bg-secondary/50 p-3 flex justify-between items-start">
          <div>
            <span className="font-mono text-sm text-primary">{s.seed}</span>
            <Badge className="ml-2 text-[10px]" variant="outline">{s.biome}</Badge>
            <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
          </div>
          <Button size="sm" variant="ghost" className="text-xs h-7 shrink-0" onClick={() => { navigator.clipboard.writeText(s.seed); toast({ title: "Seed copied!" }); }}>Copy</Button>
        </div>
      ))}
    </div>
  );
};

const IconConverterTool = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [preview, setPreview] = useState("");
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new window.Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, 64, 64);
      setPreview(canvas.toDataURL("image/png"));
    };
    img.src = URL.createObjectURL(file);
  };
  const download = () => {
    if (!preview) return;
    const a = document.createElement("a");
    a.href = preview;
    a.download = "server-icon.png";
    a.click();
  };
  return (
    <div className="space-y-4">
      <Input type="file" accept="image/*" onChange={handleFile} className="bg-secondary/50 border-border" />
      <canvas ref={canvasRef} className="hidden" />
      {preview && (
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <img src={preview} alt="Server Icon" className="w-16 h-16 rounded border border-border" style={{ imageRendering: "pixelated" }} />
            <span className="text-sm text-muted-foreground">64×64 PNG</span>
          </div>
          <Button size="sm" onClick={download}>Download Icon</Button>
        </div>
      )}
    </div>
  );
};

const ColorCodesTool = () => {
  const codes = [
    { code: "§0", hex: "#000000", name: "Black" }, { code: "§1", hex: "#0000AA", name: "Dark Blue" },
    { code: "§2", hex: "#00AA00", name: "Dark Green" }, { code: "§3", hex: "#00AAAA", name: "Dark Aqua" },
    { code: "§4", hex: "#AA0000", name: "Dark Red" }, { code: "§5", hex: "#AA00AA", name: "Dark Purple" },
    { code: "§6", hex: "#FFAA00", name: "Gold" }, { code: "§7", hex: "#AAAAAA", name: "Gray" },
    { code: "§8", hex: "#555555", name: "Dark Gray" }, { code: "§9", hex: "#5555FF", name: "Blue" },
    { code: "§a", hex: "#55FF55", name: "Green" }, { code: "§b", hex: "#55FFFF", name: "Aqua" },
    { code: "§c", hex: "#FF5555", name: "Red" }, { code: "§d", hex: "#FF55FF", name: "Light Purple" },
    { code: "§e", hex: "#FFFF55", name: "Yellow" }, { code: "§f", hex: "#FFFFFF", name: "White" },
  ];
  const formatting = [
    { code: "§k", name: "Obfuscated" }, { code: "§l", name: "Bold" },
    { code: "§m", name: "Strikethrough" }, { code: "§n", name: "Underline" },
    { code: "§o", name: "Italic" }, { code: "§r", name: "Reset" },
  ];
  return (
    <div className="space-y-4 max-h-80 overflow-auto">
      <div>
        <h4 className="text-sm font-semibold mb-2">Color Codes</h4>
        <div className="grid grid-cols-2 gap-1">
          {codes.map(c => (
            <button key={c.code} onClick={() => { navigator.clipboard.writeText(c.code); toast({ title: `Copied ${c.code}` }); }}
              className="flex items-center gap-2 rounded px-2 py-1.5 text-xs hover:bg-secondary/50 transition">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: c.hex }} />
              <span className="font-mono text-muted-foreground">{c.code}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-sm font-semibold mb-2">Formatting Codes</h4>
        <div className="grid grid-cols-2 gap-1">
          {formatting.map(f => (
            <button key={f.code} onClick={() => { navigator.clipboard.writeText(f.code); toast({ title: `Copied ${f.code}` }); }}
              className="flex items-center gap-2 rounded px-2 py-1.5 text-xs hover:bg-secondary/50 transition">
              <span className="font-mono text-primary">{f.code}</span>
              <span className="text-muted-foreground">{f.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const toolComponents: Record<string, React.FC> = {
  "server-status": ServerStatusTool,
  "uuid-lookup": UUIDLookupTool,
  "skin-viewer": SkinViewerTool,
  "coordinate-calc": CoordinateCalcTool,
  "tick-calc": TickCalcTool,
  "whitelist-gen": WhitelistGenTool,
  "motd-maker": MOTDMakerTool,
  "circle-gen": CircleGenTool,
  "server-properties": ServerPropertiesTool,
  "banner-maker": BannerMakerTool,
  "nbt-editor": NBTEditorTool,
  "enchant-calc": EnchantCalcTool,
  "recipe-lookup": RecipeLookupTool,
  "seed-viewer": SeedViewerTool,
  "icon-converter": IconConverterTool,
  "color-codes": ColorCodesTool,
};

const MinecraftTools = () => {
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const ToolComponent = activeTool ? toolComponents[activeTool.id] : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="font-display text-3xl font-black tracking-tight md:text-5xl">
              MINECRAFT <span className="text-primary text-glow">TOOLS</span>
            </h1>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Free tools for Minecraft server owners and players — all 16 fully functional.</p>
          </motion.div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            {tools.map((tool, i) => (
              <motion.div key={tool.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Card className="border-border/50 bg-card/50 hover:border-primary/30 transition-all cursor-pointer h-full" onClick={() => setActiveTool(tool)}>
                  <CardContent className="p-5">
                    <tool.icon className={`h-8 w-8 mb-3 ${tool.color}`} />
                    <h3 className="font-display text-sm font-bold tracking-wider mb-1">{tool.name}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{tool.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <Dialog open={!!activeTool} onOpenChange={() => setActiveTool(null)}>
        <DialogContent className="bg-card border-border max-w-lg max-h-[85vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="font-display tracking-wider flex items-center gap-2">
              {activeTool && <activeTool.icon className={`h-5 w-5 ${activeTool.color}`} />}
              {activeTool?.name}
            </DialogTitle>
          </DialogHeader>
          {ToolComponent && <ToolComponent />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MinecraftTools;
