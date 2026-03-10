import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      <Navbar />
      <main className="pt-24 pb-16 relative z-10 flex items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center px-4"
        >
          <h1 className="text-8xl font-extrabold text-primary text-glow mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>404</h1>
          <p className="text-xl font-bold tracking-wider mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>PAGE NOT FOUND</p>
          <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto">
            The page <span className="text-primary font-mono text-xs">{location.pathname}</span> doesn't exist.
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/">
              <Button className="glow-primary gap-2 font-semibold text-sm">
                <Home className="h-4 w-4" /> Go Home
              </Button>
            </Link>
            <Button variant="outline" onClick={() => window.history.back()} className="gap-2 text-sm border-primary/30">
              <ArrowLeft className="h-4 w-4" /> Go Back
            </Button>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
