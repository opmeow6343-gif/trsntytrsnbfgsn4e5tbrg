import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BackToTop from "@/components/BackToTop";
import CustomCursor from "@/components/CustomCursor";
import FlashSaleBanner from "@/components/FlashSaleBanner";
import FloatingOrdersButton from "@/components/FloatingOrdersButton";
import { useState, useEffect } from "react";

const Index = lazy(() => import("./pages/Index"));
const MinecraftHosting = lazy(() => import("./pages/MinecraftHosting"));
const MinecraftPlans = lazy(() => import("./pages/MinecraftPlans"));
const BotHosting = lazy(() => import("./pages/BotHosting"));
const BotPlans = lazy(() => import("./pages/BotPlans"));
const MinecraftTools = lazy(() => import("./pages/MinecraftTools"));
const BoosterPlans = lazy(() => import("./pages/BoosterPlans"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminSettings = lazy(() => import("./pages/AdminSettings"));
const NewsPage = lazy(() => import("./pages/NewsPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PlanComparison = lazy(() => import("./pages/PlanComparison"));
const VPSPlans = lazy(() => import("./pages/VPSPlans"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const FreeServer = lazy(() => import("./pages/FreeServer"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <CustomCursor />
          <FlashSaleBanner />
          <FloatingOrdersButton />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/minecraft" element={<MinecraftHosting />} />
              <Route path="/minecraft-plans" element={<MinecraftPlans />} />
              <Route path="/bot-hosting" element={<BotHosting />} />
              <Route path="/bot-plans" element={<BotPlans />} />
              <Route path="/tools" element={<MinecraftTools />} />
              <Route path="/booster-plans" element={<BoosterPlans />} />
              <Route path="/tos" element={<TermsOfService />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="/vps-plans" element={<VPSPlans />} />
              <Route path="/compare" element={<PlanComparison />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/free-server" element={<FreeServer />} />
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
