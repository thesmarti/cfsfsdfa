
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSiteSettings } from "@/hooks/useSiteSettings";
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
  
  // Update document title and meta based on site settings
  useEffect(() => {
    // Apply SEO settings if available
    if (settings.seo) {
      // Set document title
      document.title = settings.seo.title;
      
      // Update meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', settings.seo.description);
      } else {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        metaDescription.setAttribute('content', settings.seo.description);
        document.head.appendChild(metaDescription);
      }
      
      // Update favicon
      let favIcon = document.querySelector('link[rel="icon"]');
      if (favIcon) {
        favIcon.setAttribute('href', settings.seo.favicon);
      } else {
        favIcon = document.createElement('link');
        favIcon.setAttribute('rel', 'icon');
        favIcon.setAttribute('href', settings.seo.favicon);
        document.head.appendChild(favIcon);
      }
    } else if (settings.navBar.siteTitle) {
      // Fallback to just setting the title from navbar settings
      document.title = settings.navBar.siteTitle;
    }
  }, [settings]);
  
  // Apply dynamic colors and gradients from site settings
  useEffect(() => {
    if (settings.colors) {
      // Apply CSS variables
      document.documentElement.style.setProperty('--custom-primary', settings.colors.primary);
      document.documentElement.style.setProperty('--custom-secondary', settings.colors.secondary);
      document.documentElement.style.setProperty('--custom-accent', settings.colors.accent);
      
      // Apply UI gradient as a CSS variable if it exists
      if (settings.colors.uiGradient) {
        document.documentElement.style.setProperty('--ui-gradient', settings.colors.uiGradient);
      }
    }
  }, [settings.colors]);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
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
