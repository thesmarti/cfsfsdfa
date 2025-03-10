
import { useState, useEffect } from 'react';
import { ThemeSelector } from './ThemeSelector';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from '@/components/ui/alert';

type ThemeOption = "light" | "dark" | "system";

export const ThemeSettingsTab = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeOption>('system');

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
    } else if (theme === 'dark') {
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      localStorage.setItem('theme', 'light');
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <AlertDescription>
            Note: Theme settings are saved locally in your browser and not synced across devices.
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
