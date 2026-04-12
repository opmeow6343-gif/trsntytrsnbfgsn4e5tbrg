import Navbar from "@/components/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import GamesSection from "@/components/landing/GamesSection";
import FeaturesShowcase from "@/components/landing/FeaturesShowcase";
import PricingPreview from "@/components/landing/PricingPreview";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import DiscordBanner from "@/components/landing/DiscordBanner";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import AnimatedBackground from "@/components/AnimatedBackground";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      <SEOHead title="ZeyronCloud — Premium Game Server Hosting" description="Premium game server hosting for Minecraft, Palworld, Rust, Valheim & more. 99.99% uptime, DDoS protection, instant setup." path="/" />
      <Navbar />
      <main>
        <HeroSection />
        <GamesSection />
        <FeaturesShowcase />
        <PricingPreview />
        <TestimonialsSection />
        <DiscordBanner />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
