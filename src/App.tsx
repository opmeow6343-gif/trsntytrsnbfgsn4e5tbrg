import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BackToTop from "@/components/BackToTop";
import CustomCursor from "@/components/CustomCursor";
import FlashSaleBanner from "@/components/FlashSaleBanner";
import { useState, useEffect } from "react";

const Index = lazy(() => import("./pages/Index"));
const MinecraftHosting = lazy(() => import("./pages/MinecraftHosting"));
const MinecraftPlans = lazy(() => import("./pages/MinecraftPlans"));
const BotHosting = lazy(() => import("./pages/BotHosting"));
const BotPlans = lazy(() => import("./pages/BotPlans"));
const MinecraftTools = lazy(() => import("./pages/MinecraftTools"));
const AllGames = lazy(() => import("./pages/AllGames"));

const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminSettings = lazy(() => import("./pages/AdminSettings"));
const NewsPage = lazy(() => import("./pages/NewsPage"));

const AuthPage = lazy(() => import("./pages/AuthPage"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PlanComparison = lazy(() => import("./pages/PlanComparison"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ContactPage = lazy(() => import("./pages/ContactPage"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => {
  const [cursorEnabled, setCursorEnabled] = useState(() => {
    const saved = localStorage.getItem("zeyron-custom-cursor");
    return saved !== "false";
  });

  useEffect(() => {
    const handler = (e: Event) => setCursorEnabled((e as CustomEvent).detail);
    window.addEventListener("cursor-toggle", handler);
    return () => window.removeEventListener("cursor-toggle", handler);
  }, []);

  useEffect(() => {
    if (cursorEnabled) {
      document.documentElement.classList.remove("no-custom-cursor");
    } else {
      document.documentElement.classList.add("no-custom-cursor");
    }
  }, [cursorEnabled]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {cursorEnabled && <CustomCursor />}
          <FlashSaleBanner />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/minecraft" element={<MinecraftHosting />} />
              <Route path="/minecraft-plans" element={<MinecraftPlans />} />
              <Route path="/bot-hosting" element={<BotHosting />} />
              <Route path="/bot-plans" element={<BotPlans />} />
              <Route path="/tools" element={<MinecraftTools />} />
              <Route path="/games" element={<AllGames />} />
              
              <Route path="/tos" element={<TermsOfService />} />
              <Route path="/news" element={<NewsPage />} />
              
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              
              <Route path="/compare" element={<PlanComparison />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/contact" element={<ContactPage />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <BackToTop />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
