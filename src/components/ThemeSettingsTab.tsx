
import { useState, useEffect } from 'react';
import { ThemeSelector } from './ThemeSelector';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check, Info } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type ThemeOption = "light" | "dark" | "system";

export const ThemeSettingsTab = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeOption>('system');
  const { toast } = useToast();

  // Load current theme on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      setCurrentTheme('dark');
    } else if (storedTheme === 'light') {
      setCurrentTheme('light');
    } else {
      setCurrentTheme('system');
    }
  }, []);

  const handleThemeChange = (theme: ThemeOption) => {
    setCurrentTheme(theme);
    
    if (theme === 'system') {
      localStorage.removeItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      toast({
        title: "Theme updated",
        description: "Your site now follows the system theme preferences",
      });
    } else if (theme === 'dark') {
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark');
      
      toast({
        title: "Dark theme applied",
        description: "Your site now uses dark mode for all visitors",
      });
    } else {
      localStorage.setItem('theme', 'light');
      document.documentElement.classList.remove('dark');
      
      toast({
        title: "Light theme applied",
        description: "Your site now uses light mode for all visitors",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert variant="outline" className="bg-muted/50">
          <Info className="h-4 w-4" />
          <AlertDescription>
            This setting controls the theme for all site visitors. Individual users will not be able to change it.
          </AlertDescription>
        </Alert>
        
        <ThemeSelector 
          currentTheme={currentTheme} 
          onThemeChange={handleThemeChange} 
        />
      </CardContent>
    </Card>
  );
};
