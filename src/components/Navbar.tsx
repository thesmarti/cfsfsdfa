
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Search, Menu, X, Tag } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();

  // Check if the user is on the admin panel
  const isAdmin = location.pathname.includes('/admin');

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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm' 
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo and brand */}
          <Link to="/" className="flex items-center space-x-2">
            <Tag size={24} className="text-primary" />
            <span className="font-display font-semibold text-xl">LOLCoupons</span>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="flex items-center space-x-1">
              <Link to="/">
                <Button variant="ghost" className={`${location.pathname === '/' ? 'bg-accent' : ''}`}>
                  Home
                </Button>
              </Link>
              <Link to="/categories">
                <Button variant="ghost" className={`${location.pathname === '/categories' ? 'bg-accent' : ''}`}>
                  Categories
                </Button>
              </Link>
              <Link to="/stores">
                <Button variant="ghost" className={`${location.pathname === '/stores' ? 'bg-accent' : ''}`}>
                  Stores
                </Button>
              </Link>
              <Link to="/admin">
                <Button variant="ghost" className={`${location.pathname === '/admin' ? 'bg-accent' : ''}`}>
                  Admin
                </Button>
              </Link>

              <div className="ml-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <Input 
                  placeholder="Search coupons..." 
                  className="pl-9 w-[200px] transition-all duration-300 focus:w-[300px]"
                />
              </div>
            </nav>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          )}
        </div>

        {/* Mobile Navigation */}
        {isMobile && isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border animate-slide-down">
            <div className="container py-4 px-4 flex flex-col space-y-2">
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <Input 
                  placeholder="Search coupons..." 
                  className="pl-9 w-full"
                />
              </div>
              
              <Separator className="my-2" />
              
              <Link to="/">
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start ${location.pathname === '/' ? 'bg-accent' : ''}`}
                >
                  Home
                </Button>
              </Link>
              <Link to="/categories">
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start ${location.pathname === '/categories' ? 'bg-accent' : ''}`}
                >
                  Categories
                </Button>
              </Link>
              <Link to="/stores">
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start ${location.pathname === '/stores' ? 'bg-accent' : ''}`}
                >
                  Stores
                </Button>
              </Link>
              <Link to="/admin">
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start ${location.pathname === '/admin' ? 'bg-accent' : ''}`}
                >
                  Admin
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
