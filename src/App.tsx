
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import Index from "./pages/Index";
import CouponDetail from "./pages/CouponDetail";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const { settings } = useSiteSettings();

  // Check for saved theme preference or use system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, []);
  
  // Update document title based on site settings
  useEffect(() => {
    if (settings.navBar.siteTitle) {
      document.title = settings.navBar.siteTitle;
    }
  }, [settings.navBar.siteTitle]);
  
  // Apply dynamic colors from site settings
  useEffect(() => {
    if (settings.colors) {
      // Apply CSS variables
      document.documentElement.style.setProperty('--custom-primary', settings.colors.primary);
      document.documentElement.style.setProperty('--custom-secondary', settings.colors.secondary);
      document.documentElement.style.setProperty('--custom-accent', settings.colors.accent);
    }
  }, [settings.colors]);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ParticlesBackground />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/coupon/:id" element={<CouponDetail />} />
            <Route path="/admin" element={<AdminPanel />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
