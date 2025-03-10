
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search, Menu, X, Tag } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ThemeToggle } from '@/components/ThemeToggle';
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
  const getUiGradient = () => {
    if (settings.colors.uiGradient) {
      return settings.colors.uiGradient;
    }
    return 'bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500';
  };

  const textGradientClass = settings.colors.uiGradient || 'bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500';
  const buttonGradientClass = settings.colors.uiGradient || 'bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500';

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
          <Link to="/" className="flex items-center space-x-2">
            {settings.navBar.showLogo && (
              <img 
                src={settings.navBar.logoUrl} 
                alt="Logo" 
                className="h-8 w-auto" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/50x50?text=Logo';
                }}
              />
            )}
            {settings.navBar.showText && (
              <span className={`font-display font-semibold text-xl bg-clip-text text-transparent ${textGradientClass}`}>
                {settings.navBar.siteTitle}
              </span>
            )}
            {!settings.navBar.showLogo && !settings.navBar.showText && (
              <>
                <Tag size={24} className={`text-transparent bg-clip-text ${textGradientClass}`} />
                <span className={`font-display font-semibold text-xl bg-clip-text text-transparent ${textGradientClass}`}>
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
                    variant={location.pathname === button.path ? 'default' : 'ghost'} 
                    className={`${
                      location.pathname === button.path 
                        ? buttonGradientClass + ' text-white border-none' 
                        : 'hover:text-transparent hover:bg-clip-text hover:' + buttonGradientClass
                    }`}
                  >
                    {button.label}
                  </Button>
                </Link>
              ))}
              
              {/* Admin button - only visible if settings allow it */}
              {settings.navBar.showAdminButton && (
                <Link to="/admin">
                  <Button 
                    variant={location.pathname === '/admin' ? 'default' : 'ghost'} 
                    className={`${
                      location.pathname === '/admin' 
                        ? buttonGradientClass + ' border-none text-white dark:text-white' 
                        : 'hover:text-transparent hover:bg-clip-text hover:' + buttonGradientClass
                    }`}
                  >
                    Admin
                  </Button>
                </Link>
              )}

              <div className="ml-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <Input 
                  placeholder="Search coupons..." 
                  className="pl-9 w-[200px] transition-all duration-300 focus:w-[300px]"
                />
              </div>
              
              <ThemeToggle />
            </nav>
          )}

          {/* Mobile Menu Button and Theme Toggle */}
          {isMobile && (
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        {isMobile && isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-background/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-border animate-slide-down z-50">
            <div className="container py-4 px-4 flex flex-col space-y-2">
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <Input 
                  placeholder="Search coupons..." 
                  className="pl-9 w-full"
                />
              </div>
              
              <Separator className="my-2" />
              
              {settings.navBar.buttons.filter(btn => btn.enabled).map(button => (
                <Link key={button.id} to={button.path}>
                  <Button 
                    variant={location.pathname === button.path ? 'default' : 'ghost'} 
                    className={`w-full justify-start ${
                      location.pathname === button.path 
                        ? buttonGradientClass + ' border-none text-white dark:text-white' 
                        : ''
                    }`}
                  >
                    {button.label}
                  </Button>
                </Link>
              ))}
              
              {/* Admin button - only visible if settings allow it */}
              {settings.navBar.showAdminButton && (
                <Link to="/admin">
                  <Button 
                    variant={location.pathname === '/admin' ? 'default' : 'ghost'} 
                    className={`w-full justify-start ${
                      location.pathname === '/admin' 
                        ? buttonGradientClass + ' border-none text-white dark:text-white' 
                        : ''
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
