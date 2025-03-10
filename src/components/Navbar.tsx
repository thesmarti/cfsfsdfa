
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Menu, Tag } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  const { settings } = useSiteSettings();

  // Handle scroll events for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Check if the user is on the admin panel
  const isAdmin = location.pathname.includes('/admin');
  
  // Determine what gradient to use for UI elements
  const getGradient = () => {
    return settings.colors.uiGradient || 'bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500';
  };

  const textGradientClass = getGradient();
  const buttonGradientClass = getGradient();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'py-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm' 
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between">
          {/* Logo and brand */}
          <Link to="/" className="flex items-center space-x-3">
            {settings.navBar.showLogo && (
              <img 
                src={settings.navBar.logoUrl} 
                alt="Logo" 
                className="h-14 w-auto transition-transform duration-300 hover:scale-105" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/50x50?text=Logo';
                }}
              />
            )}
            {settings.navBar.showText && (
              <span className={`font-display font-semibold text-2xl bg-clip-text text-transparent ${textGradientClass}`}>
                {settings.navBar.siteTitle}
              </span>
            )}
            {!settings.navBar.showLogo && !settings.navBar.showText && (
              <>
                <Tag size={28} className={`text-transparent bg-clip-text ${textGradientClass}`} />
                <span className={`font-display font-semibold text-2xl bg-clip-text text-transparent ${textGradientClass}`}>
                  LOLCoupons
                </span>
              </>
            )}
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="flex items-center space-x-1">
              {settings.navBar.buttons.filter(btn => btn.enabled).map(button => (
                <Link key={button.id} to={button.path}>
                  <Button 
                    variant={location.pathname === button.path ? 'gradient' : 'ghost'} 
                    className={`${
                      location.pathname === button.path 
                        ? buttonGradientClass
                        : `hover:text-transparent hover:bg-clip-text hover:${buttonGradientClass}`
                    }`}
                  >
                    {button.label}
                  </Button>
                </Link>
              ))}
              
              {/* Admin button */}
              {settings.navBar.showAdminButton && (
                <Link to="/admin">
                  <Button 
                    variant={location.pathname === '/admin' ? 'gradient' : 'ghost'} 
                    className={`${
                      location.pathname === '/admin' 
                        ? buttonGradientClass
                        : `hover:text-transparent hover:bg-clip-text hover:${buttonGradientClass}`
                    }`}
                  >
                    Admin
                  </Button>
                </Link>
              )}
            </nav>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
                className={`hover:text-transparent hover:bg-clip-text hover:${buttonGradientClass}`}
              >
                {isMenuOpen ? <Menu size={24} className="rotate-90 transition-transform duration-200" /> : <Menu size={24} />}
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        {isMobile && isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-background/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-border animate-slide-down z-50">
            <div className="container py-4 px-4 flex flex-col space-y-2">
              <Separator className="my-2" />
              
              {settings.navBar.buttons.filter(btn => btn.enabled).map(button => (
                <Link key={button.id} to={button.path}>
                  <Button 
                    variant={location.pathname === button.path ? 'gradient' : 'ghost'} 
                    className={`w-full justify-start ${
                      location.pathname === button.path 
                        ? buttonGradientClass
                        : `hover:text-transparent hover:bg-clip-text hover:${buttonGradientClass}`
                    }`}
                  >
                    {button.label}
                  </Button>
                </Link>
              ))}
              
              {/* Admin button - mobile */}
              {settings.navBar.showAdminButton && (
                <Link to="/admin">
                  <Button 
                    variant={location.pathname === '/admin' ? 'gradient' : 'ghost'} 
                    className={`w-full justify-start ${
                      location.pathname === '/admin' 
                        ? buttonGradientClass
                        : `hover:text-transparent hover:bg-clip-text hover:${buttonGradientClass}`
                    }`}
                  >
                    Admin
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
