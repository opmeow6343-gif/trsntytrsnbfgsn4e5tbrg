import Navbar from "@/components/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import WelcomeSection from "@/components/landing/WelcomeSection";
import GamesSection from "@/components/landing/GamesSection";
import AdvantagesSection from "@/components/landing/AdvantagesSection";
import TrustStatsSection from "@/components/landing/TrustStatsSection";
import ControlPanelSection from "@/components/landing/ControlPanelSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import FeaturesShowcase from "@/components/landing/FeaturesShowcase";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import PricingPreview from "@/components/landing/PricingPreview";
import ComparisonTable from "@/components/landing/ComparisonTable";
import FAQPreview from "@/components/landing/FAQPreview";
import DiscordBanner from "@/components/landing/DiscordBanner";
import CTASection from "@/components/landing/CTASection";
import ZeyronMCSection from "@/components/landing/ZeyronMCSection";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="ZeyronCloud — Premium Game Server Hosting" description="Premium game server hosting for Minecraft, Palworld, Rust, Valheim & more. 99.99% uptime, DDoS protection, instant setup." path="/" />
      <Navbar />
      <main>
        <HeroSection />
        <WelcomeSection />
        <GamesSection />
        <FeaturesShowcase />
        <AdvantagesSection />
        <TrustStatsSection />
        <ControlPanelSection />
        <FeaturesSection />
        <PricingPreview />
        <ZeyronMCSection />
        <HowItWorksSection />
        <ComparisonTable />
        <TestimonialsSection />
        <FAQPreview />
        <DiscordBanner />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
