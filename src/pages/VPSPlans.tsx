import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import CurrencyConverter from "@/components/CurrencyConverter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cpu, HardDrive, Shield, Wifi, MemoryStick, ShoppingCart, Crown, Check, Server, Zap } from "lucide-react";
import DiscordOrderDialog from "@/components/DiscordOrderDialog";

interface VPSPlan {
  name: string;
  cpu: string;
  cores: string;
  ram: string;
  ramType: string;
  storage: string;
  price: number;
}

// Intel Gold Series
const intelGoldPlans: VPSPlan[] = [
  { name: "Gold 4vC-16GB", cpu: "Xeon Gold 6338", cores: "4 vCores", ram: "16GB", ramType: "DDR4 3200MT/s", storage: "64GB NVMe SSD", price: 550 },
  { name: "Gold 8vC-32GB", cpu: "Xeon Gold 6338", cores: "8 vCores", ram: "32GB", ramType: "DDR4 3200MT/s", storage: "128GB NVMe SSD", price: 800 },
  { name: "Gold 8vC-64GB", cpu: "Xeon Gold 6338", cores: "8 vCores", ram: "64GB", ramType: "DDR4 3200MT/s", storage: "256GB NVMe SSD", price: 1300 },
];
