
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Menu, Search, Tag } from "lucide-react";

export const Navbar = () => {
  const { settings } = useSiteSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search functionality here
    console.log("Searching for:", searchQuery);
    setIsSearchOpen(false);
  };
  
  // Filter out disabled nav buttons
  const enabledButtons = settings.navBar.buttons.filter(button => button.enabled);
  
  // Render default navigation style
  const renderDefaultNavigation = () => (
    <div className="flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 z-10">
        {settings.navBar.showLogo && settings.navBar.logoUrl && (
          <img
            src={settings.navBar.logoUrl}
            alt="Logo"
            className="h-10 w-auto transition-transform duration-300 hover:scale-110"
          />
        )}
        {settings.navBar.showText && settings.navBar.siteTitle && (
          <span className="text-xl font-bold">{settings.navBar.siteTitle}</span>
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
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSearchOpen(true)}
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </Button>
        
        {settings.navBar.showAdminButton && !isAdminPage && (
          <Button asChild>
            <Link to="/admin">Admin</Link>
          </Button>
        )}
      </div>
      
      <div className="md:hidden flex items-center gap-2 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSearchOpen(true)}
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </Button>
        
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
  );
  
  // Render centered navigation style with larger logo and tagline
  const renderCenteredNavigation = () => (
    <div className="flex flex-col items-center">
      <Link to="/" className="flex flex-col items-center z-10 mb-2">
        {settings.navBar.showLogo && settings.navBar.logoUrl && (
          <img
            src={settings.navBar.logoUrl}
            alt="Logo"
            className="h-16 w-auto mb-2 transition-transform duration-300 hover:scale-105"
          />
        )}
        {settings.navBar.showText && settings.navBar.siteTitle && (
          <span className="text-2xl font-bold">{settings.navBar.siteTitle}</span>
        )}
        <span className="text-sm text-muted-foreground mt-1">{settings.navBar.tagline}</span>
      </Link>
      
      <div className="hidden md:flex items-center gap-4 mt-2 z-10">
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
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSearchOpen(true)}
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </Button>
        
        {settings.navBar.showAdminButton && !isAdminPage && (
          <Button asChild>
            <Link to="/admin">Admin</Link>
          </Button>
        )}
      </div>
      
      <div className="md:hidden flex items-center justify-between w-full px-4 mt-2 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSearchOpen(true)}
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </Button>
        
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
  );
  
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
        {settings.navBar.navStyle === 'centered' 
          ? renderCenteredNavigation() 
          : renderDefaultNavigation()
        }
      </div>
      
      {/* Search overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-start justify-center pt-20">
          <div className="w-full max-w-2xl p-4">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="search"
                placeholder="Search for coupons..."
                className="pr-10 text-lg py-6"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setIsSearchOpen(false)}
              >
                ✕
              </Button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
