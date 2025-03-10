import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { NavButton } from "@/types";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";

export const Navbar = () => {
  const { settings } = useSiteSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const isAdminPage = location.pathname === "/admin";
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Filter out disabled nav buttons
  const enabledButtons = settings.navBar.buttons.filter(button => button.enabled);
  
  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 py-4 transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      {settings.navBar.enableParticles && (
        <ParticlesBackground
          color={settings.navBar.particlesColor}
          density={settings.navBar.particlesDensity}
        />
      )}
      
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 z-10">
            {settings.navBar.showLogo && settings.navBar.logoUrl && (
              <img
                src={settings.navBar.logoUrl}
                alt="Logo"
                className="h-14 w-auto transition-transform duration-300 hover:scale-110"
              />
            )}
            {settings.navBar.showText && settings.navBar.siteTitle && (
              <span className="text-2xl font-bold">{settings.navBar.siteTitle}</span>
            )}
          </Link>
          
          <div className="hidden md:flex items-center gap-6 z-10">
            <NavigationMenu>
              <NavigationMenuList>
                {enabledButtons.map((button) => (
                  <NavigationMenuItem key={button.id}>
                    <Link to={button.path}>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        {button.label}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
            
            {settings.navBar.showAdminButton && !isAdminPage && (
              <Button asChild>
                <Link to="/admin">Admin</Link>
              </Button>
            )}
          </div>
          
          <div className="md:hidden flex items-center gap-2 z-10">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col gap-4 mt-8">
                  {enabledButtons.map((button) => (
                    <Link
                      key={button.id}
                      to={button.path}
                      className="px-4 py-2 hover:bg-secondary rounded-md transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {button.label}
                    </Link>
                  ))}
                  
                  {settings.navBar.showAdminButton && !isAdminPage && (
                    <Link
                      to="/admin"
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};
