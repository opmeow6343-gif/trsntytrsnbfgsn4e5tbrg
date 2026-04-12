import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import AnimatedBackground from "@/components/AnimatedBackground";
import WelcomeSection from "@/components/landing/WelcomeSection";
import TrustStatsSection from "@/components/landing/TrustStatsSection";
import ZeyronMCSection from "@/components/landing/ZeyronMCSection";
import FAQPreview from "@/components/landing/FAQPreview";

const WhyUsPage = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      <SEOHead
        title="Why ZeyronCloud — Trusted Game Hosting"
        description="Discover why thousands of gamers trust ZeyronCloud. See our stats, community, and what makes us different."
        path="/why-us"
      />
      <Navbar />
      <main className="relative z-10">
        <div className="pt-24 pb-8 text-center container mx-auto px-4">
          <span className="text-[10px] font-medium text-primary tracking-[0.25em] uppercase block mb-3 font-mono">
            WHY US
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter font-display mb-4">
            Why Choose <span className="gradient-text">ZeyronCloud</span>?
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Trusted by gamers worldwide for performance, reliability, and support.
          </p>
        </div>
        <WelcomeSection />
        <TrustStatsSection />
        <ZeyronMCSection />
        <FAQPreview />
      </main>
      <Footer />
    </div>
  );
};

export default WhyUsPage;
