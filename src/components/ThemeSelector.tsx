
import React from 'react';
import { Card } from "@/components/ui/card";
import { Check } from 'lucide-react';

export interface ThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

export const ThemeSelector = ({ currentTheme, onThemeChange }: ThemeSelectorProps) => {
  const themes = [
    {
      name: 'light',
      title: 'Light',
      description: 'Clean, bright appearance for daytime use',
    },
    {
      name: 'dark',
      title: 'Dark',
      description: 'Reduced eye strain in low-light environments',
    },
    {
      name: 'system',
      title: 'System',
      description: 'Follows your system preferences automatically',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {themes.map((theme) => (
        <Card
          key={theme.name}
          className={`relative cursor-pointer p-4 hover:border-primary transition-all ${
            currentTheme === theme.name ? 'border-2 border-primary' : ''
          }`}
          onClick={() => onThemeChange(theme.name)}
        >
          <div className={`rounded-md p-4 mb-2 ${
            theme.name === 'dark' 
              ? 'bg-gray-900 border border-gray-700' 
              : theme.name === 'light'
                ? 'bg-white border border-gray-200' 
                : 'bg-gradient-to-r from-white to-gray-900 border border-gray-400'
          }`}>
            <div className={`h-4 w-20 rounded mb-2 ${
              theme.name === 'dark' 
                ? 'bg-gray-700' 
                : theme.name === 'light'
                  ? 'bg-gray-200' 
                  : 'bg-gradient-to-r from-gray-200 to-gray-700'
            }`}></div>
            <div className={`h-3 w-14 rounded mb-2 ${
              theme.name === 'dark' 
                ? 'bg-gray-700' 
                : theme.name === 'light'
                  ? 'bg-gray-200' 
                  : 'bg-gradient-to-r from-gray-200 to-gray-700'
            }`}></div>
            <div className={`h-3 w-16 rounded ${
              theme.name === 'dark' 
                ? 'bg-gray-700' 
                : theme.name === 'light'
                  ? 'bg-gray-200' 
                  : 'bg-gradient-to-r from-gray-200 to-gray-700'
            }`}></div>
          </div>
          
          <h3 className="font-medium">{theme.title}</h3>
          <p className="text-sm text-muted-foreground">{theme.description}</p>
          
          {currentTheme === theme.name && (
            <div className="absolute top-2 right-2 h-5 w-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
              <Check size={12} />
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};
