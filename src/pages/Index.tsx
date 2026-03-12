import Navbar from "@/components/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import StatsMarquee from "@/components/landing/StatsMarquee";
import TechLogosMarquee from "@/components/landing/TechLogosMarquee";
import GamesSection from "@/components/landing/GamesSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import PricingPreview from "@/components/landing/PricingPreview";
import FAQPreview from "@/components/landing/FAQPreview";
import DiscordBanner from "@/components/landing/DiscordBanner";
import CTASection from "@/components/landing/CTASection";
import SectionDivider from "@/components/landing/SectionDivider";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="ZeyronCloud — Premium Game Server Hosting" description="Premium game server hosting for Minecraft, Palworld, Rust, Valheim & more. 99.99% uptime, DDoS protection, instant setup." path="/" />
      <Navbar />
      <main>
        <HeroSection />
        <StatsMarquee />
        <TechLogosMarquee />
        <SectionDivider />
        <GamesSection />
        <SectionDivider />
        <FeaturesSection />
        <SectionDivider />
        <HowItWorksSection />
        <SectionDivider />
        <TestimonialsSection />
        <SectionDivider />
        <PricingPreview />
        <SectionDivider />
        <FAQPreview />
        <DiscordBanner />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
