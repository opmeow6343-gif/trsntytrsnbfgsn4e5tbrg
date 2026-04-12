import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import AnimatedBackground from "@/components/AnimatedBackground";
import FeaturesSection from "@/components/landing/FeaturesSection";
import FeaturesShowcase from "@/components/landing/FeaturesShowcase";
import ControlPanelSection from "@/components/landing/ControlPanelSection";
import AdvantagesSection from "@/components/landing/AdvantagesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";

const FeaturesPage = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      <SEOHead
        title="Features — ZeyronCloud"
        description="Explore ZeyronCloud's powerful features: DDoS protection, NVMe storage, custom control panel, instant setup, and more."
        path="/features"
      />
      <Navbar />
      <main className="relative z-10">
        <div className="pt-24 pb-8 text-center container mx-auto px-4">
          <span className="text-[10px] font-medium text-primary tracking-[0.25em] uppercase block mb-3 font-mono">
            PLATFORM
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter font-display mb-4">
            Powerful <span className="gradient-text">Features</span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Everything you need to run your game servers like a pro.
          </p>
        </div>
        <FeaturesSection />
        <FeaturesShowcase />
        <ControlPanelSection />
        <AdvantagesSection />
        <HowItWorksSection />
      </main>
      <Footer />
    </div>
  );
};

export default FeaturesPage;
