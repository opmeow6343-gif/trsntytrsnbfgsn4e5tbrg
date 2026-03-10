import { useState, useCallback } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import BackToTop from "@/components/BackToTop";
import PageTransition from "@/components/PageTransition";
import CustomCursor from "@/components/CustomCursor";
import LoadingScreen from "@/components/LoadingScreen";
import FlashSaleBanner from "@/components/FlashSaleBanner";
import Index from "./pages/Index";
import MinecraftHosting from "./pages/MinecraftHosting";
import MinecraftPlans from "./pages/MinecraftPlans";
import BotHosting from "./pages/BotHosting";
import BotPlans from "./pages/BotPlans";
import MinecraftTools from "./pages/MinecraftTools";
import BoosterPlans from "./pages/BoosterPlans";
import TermsOfService from "./pages/TermsOfService";
import AdminLogin from "./pages/AdminLogin";
import AdminSettings from "./pages/AdminSettings";
import NewsPage from "./pages/NewsPage";
import CartPage from "./pages/CartPage";
import AuthPage from "./pages/AuthPage";
import FAQPage from "./pages/FAQPage";
import NotFound from "./pages/NotFound";
import PlanComparison from "./pages/PlanComparison";
import VPSPlans from "./pages/VPSPlans";
import ProfilePage from "./pages/ProfilePage";
import ResetPassword from "./pages/ResetPassword";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/minecraft" element={<PageTransition><MinecraftHosting /></PageTransition>} />
        <Route path="/minecraft-plans" element={<PageTransition><MinecraftPlans /></PageTransition>} />
        <Route path="/bot-hosting" element={<PageTransition><BotHosting /></PageTransition>} />
        <Route path="/bot-plans" element={<PageTransition><BotPlans /></PageTransition>} />
        <Route path="/tools" element={<PageTransition><MinecraftTools /></PageTransition>} />
        <Route path="/booster-plans" element={<PageTransition><BoosterPlans /></PageTransition>} />
        <Route path="/tos" element={<PageTransition><TermsOfService /></PageTransition>} />
        <Route path="/news" element={<PageTransition><NewsPage /></PageTransition>} />
        <Route path="/cart" element={<PageTransition><CartPage /></PageTransition>} />
        <Route path="/auth" element={<PageTransition><AuthPage /></PageTransition>} />
        <Route path="/faq" element={<PageTransition><FAQPage /></PageTransition>} />
        <Route path="/admin" element={<PageTransition><AdminLogin /></PageTransition>} />
        <Route path="/admin/settings" element={<PageTransition><AdminSettings /></PageTransition>} />
        <Route path="/vps-plans" element={<PageTransition><VPSPlans /></PageTransition>} />
        <Route path="/compare" element={<PageTransition><PlanComparison /></PageTransition>} />
        <Route path="/profile" element={<PageTransition><ProfilePage /></PageTransition>} />
        <Route path="/reset-password" element={<PageTransition><ResetPassword /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  const [loaded, setLoaded] = useState(false);
  const handleLoadComplete = useCallback(() => setLoaded(true), []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AnimatePresence>
          {!loaded && <LoadingScreen key="loader" onComplete={handleLoadComplete} />}
        </AnimatePresence>
        {loaded && (
          <BrowserRouter>
            <CustomCursor />
            <FlashSaleBanner />
            <AnimatedRoutes />
            <BackToTop />
          </BrowserRouter>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
