import Navbar from "@/components/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import StatsMarquee from "@/components/landing/StatsMarquee";
import TechLogosMarquee from "@/components/landing/TechLogosMarquee";
import WelcomeSection from "@/components/landing/WelcomeSection";
import GamesSection from "@/components/landing/GamesSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import AdvantagesSection from "@/components/landing/AdvantagesSection";
import TrustStatsSection from "@/components/landing/TrustStatsSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import PricingPreview from "@/components/landing/PricingPreview";
import FAQPreview from "@/components/landing/FAQPreview";
import DiscordBanner from "@/components/landing/DiscordBanner";
import CTASection from "@/components/landing/CTASection";
import SectionDivider from "@/components/landing/SectionDivider";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="ZeyronCloud — Premium Game Server Hosting" description="Premium game server hosting for Minecraft, Palworld, Rust, Valheim & more. 99.99% uptime, DDoS protection, instant setup." path="/" />
      <Navbar />
      <main>
        <HeroSection />
        <StatsMarquee />
        <TechLogosMarquee />
        <SectionDivider />
        <WelcomeSection />
        <SectionDivider />
        <GamesSection />
        <SectionDivider />
        <AdvantagesSection />
        <SectionDivider />
        <TrustStatsSection />
        <SectionDivider />
        <FeaturesSection />
        <SectionDivider />
        <HowItWorksSection />
        <SectionDivider />
        <PricingPreview />
        <SectionDivider />
        <TestimonialsSection />
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
