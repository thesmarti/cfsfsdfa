
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Moon, Sun, Check } from "lucide-react";

export const ThemePreviewSelector = () => {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(
    localStorage.getItem('theme') as 'light' | 'dark' || 'light'
  );

  const setTheme = (theme: 'light' | 'dark') => {
    const root = window.document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    localStorage.setItem('theme', theme);
    setCurrentTheme(theme);
  };

  useEffect(() => {
    // Initialize theme based on localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Theme Selection</h3>
      <p className="text-muted-foreground mb-4">
        Choose between light and dark mode for your site
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Light Theme Preview */}
        <Card 
          className={`cursor-pointer hover:shadow-md transition-all overflow-hidden border-2 ${currentTheme === 'light' ? 'border-primary' : 'border-border'}`}
          onClick={() => setTheme('light')}
        >
          <div className="bg-white p-3 flex justify-between items-center border-b">
            <div className="h-3 w-24 bg-gray-200 rounded"></div>
            <div className="flex gap-1">
              <div className="h-3 w-3 bg-gray-200 rounded-full"></div>
              <div className="h-3 w-3 bg-gray-200 rounded-full"></div>
            </div>
          </div>
          <CardContent className="bg-gray-50 p-4 h-36 relative">
            <div className="absolute top-2 right-2">
              {currentTheme === 'light' && (
                <div className="bg-primary text-white rounded-full p-1">
                  <Check size={14} />
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Sun size={16} className="text-amber-500" />
              <span className="text-sm font-medium">Light Mode</span>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-white rounded"></div>
              <div className="h-3 w-3/4 bg-white rounded"></div>
              <div className="h-8 w-1/2 bg-blue-100 rounded mt-4"></div>
            </div>
          </CardContent>
        </Card>

        {/* Dark Theme Preview */}
        <Card 
          className={`cursor-pointer hover:shadow-md transition-all overflow-hidden border-2 ${currentTheme === 'dark' ? 'border-primary' : 'border-border'}`}
          onClick={() => setTheme('dark')}
        >
          <div className="bg-gray-900 p-3 flex justify-between items-center border-b border-gray-800">
            <div className="h-3 w-24 bg-gray-700 rounded"></div>
            <div className="flex gap-1">
              <div className="h-3 w-3 bg-gray-700 rounded-full"></div>
              <div className="h-3 w-3 bg-gray-700 rounded-full"></div>
            </div>
          </div>
          <CardContent className="bg-gray-800 p-4 h-36 relative">
            <div className="absolute top-2 right-2">
              {currentTheme === 'dark' && (
                <div className="bg-primary text-white rounded-full p-1">
                  <Check size={14} />
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Moon size={16} className="text-indigo-400" />
              <span className="text-sm font-medium text-gray-200">Dark Mode</span>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-gray-700 rounded"></div>
              <div className="h-3 w-3/4 bg-gray-700 rounded"></div>
              <div className="h-8 w-1/2 bg-indigo-900 rounded mt-4"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
