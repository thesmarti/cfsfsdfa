
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Moon, Sun, Monitor } from "lucide-react";

type ThemeOption = "light" | "dark" | "system";

interface ThemeSelectorProps {
  currentTheme: ThemeOption;
  onThemeChange: (theme: ThemeOption) => void;
}

export const ThemeSelector = ({ currentTheme, onThemeChange }: ThemeSelectorProps) => {
  const [mounted, setMounted] = useState(false);

  // Only show theme selector after component is mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Select Theme Mode</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Light Theme Preview */}
        <Card 
          className={`cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-md ${
            currentTheme === 'light' ? 'ring-2 ring-primary' : 'ring-1 ring-border'
          }`}
          onClick={() => onThemeChange('light')}
        >
          <div className="aspect-video relative">
            <div className="absolute inset-0 bg-white border-b">
              <div className="h-8 bg-gray-100 border-b flex items-center px-4">
                <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                <div className="flex-1"></div>
                <div className="w-20 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="p-4">
                <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 w-full bg-gray-100 rounded mb-1"></div>
                <div className="h-3 w-3/4 bg-gray-100 rounded"></div>
                <div className="mt-4 flex space-x-2">
                  <div className="h-6 w-16 bg-blue-500 rounded"></div>
                  <div className="h-6 w-16 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
            {currentTheme === 'light' && (
              <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                <Check size={14} />
              </div>
            )}
          </div>
          <div className="p-3 text-center font-medium flex items-center justify-center gap-2">
            <Sun size={16} className="text-amber-500" />
            Light
          </div>
        </Card>

        {/* Dark Theme Preview */}
        <Card 
          className={`cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-md ${
            currentTheme === 'dark' ? 'ring-2 ring-primary' : 'ring-1 ring-border'
          }`}
          onClick={() => onThemeChange('dark')}
        >
          <div className="aspect-video relative">
            <div className="absolute inset-0 bg-gray-900 border-b border-gray-800">
              <div className="h-8 bg-gray-800 border-b border-gray-700 flex items-center px-4">
                <div className="w-3 h-3 rounded-full bg-gray-600 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-gray-600 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                <div className="flex-1"></div>
                <div className="w-20 h-4 bg-gray-700 rounded"></div>
              </div>
              <div className="p-4">
                <div className="h-4 w-24 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 w-full bg-gray-800 rounded mb-1"></div>
                <div className="h-3 w-3/4 bg-gray-800 rounded"></div>
                <div className="mt-4 flex space-x-2">
                  <div className="h-6 w-16 bg-blue-600 rounded"></div>
                  <div className="h-6 w-16 bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
            {currentTheme === 'dark' && (
              <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                <Check size={14} />
              </div>
            )}
          </div>
          <div className="p-3 text-center font-medium flex items-center justify-center gap-2">
            <Moon size={16} className="text-indigo-400" />
            Dark
          </div>
        </Card>

        {/* System Theme Preview */}
        <Card 
          className={`cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-md ${
            currentTheme === 'system' ? 'ring-2 ring-primary' : 'ring-1 ring-border'
          }`}
          onClick={() => onThemeChange('system')}
        >
          <div className="aspect-video relative">
            <div className="absolute inset-0">
              <div className="flex h-full">
                <div className="w-1/2 bg-white border-r">
                  <div className="h-8 bg-gray-100 border-b flex items-center px-2">
                    <div className="w-2 h-2 rounded-full bg-gray-300 mr-1"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  </div>
                  <div className="p-2">
                    <div className="h-3 w-12 bg-gray-200 rounded mb-1"></div>
                    <div className="h-2 w-full bg-gray-100 rounded"></div>
                  </div>
                </div>
                <div className="w-1/2 bg-gray-900">
                  <div className="h-8 bg-gray-800 border-b border-gray-700 flex items-center px-2">
                    <div className="w-2 h-2 rounded-full bg-gray-600 mr-1"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                  </div>
                  <div className="p-2">
                    <div className="h-3 w-12 bg-gray-700 rounded mb-1"></div>
                    <div className="h-2 w-full bg-gray-800 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
            {currentTheme === 'system' && (
              <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                <Check size={14} />
              </div>
            )}
          </div>
          <div className="p-3 text-center font-medium flex items-center justify-center gap-2">
            <Monitor size={16} className="text-gray-500" />
            System
          </div>
        </Card>
      </div>
      <p className="text-sm text-muted-foreground">
        {currentTheme === 'light' && "Light mode is active for all site visitors."}
        {currentTheme === 'dark' && "Dark mode is active for all site visitors."}
        {currentTheme === 'system' && "System preference will automatically switch between light and dark mode based on each visitor's device settings."}
      </p>
    </div>
  );
};
