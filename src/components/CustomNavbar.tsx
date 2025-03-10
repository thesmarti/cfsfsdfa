
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';

export const Navbar = () => {
  const { settings } = useSiteSettings();
  const gradientClass = settings.colors.uiGradient || 'bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500';
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <span className={`font-display text-xl font-bold ${gradientClass} text-transparent bg-clip-text`}>
              LOLCoupons
            </span>
          </Link>
          
          <nav className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin">
                <Settings size={16} className="mr-2" />
                Admin
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};
