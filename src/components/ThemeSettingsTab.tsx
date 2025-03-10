
import { useState, useEffect } from 'react';
import { ThemeSelector } from './ThemeSelector';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { CloudUpload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

type ThemeOption = "light" | "dark" | "system";

export const ThemeSettingsTab = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeOption>('system');
  const [isSyncing, setIsSyncing] = useState(false);
  const supabase = useSupabaseClient();
  const { toast } = useToast();

  // Load theme from Supabase on mount
  useEffect(() => {
    const loadThemeFromSupabase = async () => {
      setIsSyncing(true);
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('theme')
          .single();
        
        if (error) {
          console.error('Error fetching theme setting:', error);
          // If no theme setting exists yet, set up with current theme
          if (error.code === 'PGRST116') {
            // Get theme from localStorage for first-time migration
            const storedTheme = localStorage.getItem('theme');
            const initialTheme = storedTheme === 'dark' ? 'dark' : 
                                storedTheme === 'light' ? 'light' : 
                                'system';
            
            await saveThemeToSupabase(initialTheme);
            setCurrentTheme(initialTheme);
            applyThemeToDocument(initialTheme);
          }
        } else if (data?.theme) {
          // Update local state with the theme from Supabase
          setCurrentTheme(data.theme as ThemeOption);
          applyThemeToDocument(data.theme as ThemeOption);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      } finally {
        setIsSyncing(false);
      }
    };

    loadThemeFromSupabase();
  }, [supabase]);

  const applyThemeToDocument = (theme: ThemeOption) => {
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

  const saveThemeToSupabase = async (theme: ThemeOption) => {
    setIsSyncing(true);
    try {
      // Check if settings record exists
      const { data } = await supabase
        .from('site_settings')
        .select('id')
        .single();
      
      if (data?.id) {
        // Update existing record
        const { error } = await supabase
          .from('site_settings')
          .update({ 
            theme: theme,
            updated_at: new Date().toISOString()
          })
          .eq('id', data.id);
          
        if (error) {
          throw error;
        }
      } else {
        // Insert new record
        const { error } = await supabase
          .from('site_settings')
          .insert({ 
            theme: theme,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          
        if (error) {
          throw error;
        }
      }
      
      toast({
        title: 'Success',
        description: 'Theme setting saved to Supabase and synced across all devices.',
      });
    } catch (error) {
      console.error('Error saving theme:', error);
      toast({
        title: 'Error',
        description: 'Failed to save theme setting. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleThemeChange = async (theme: ThemeOption) => {
    setCurrentTheme(theme);
    applyThemeToDocument(theme);
    await saveThemeToSupabase(theme);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Settings</CardTitle>
        <CardDescription>
          Choose your preferred theme for the website
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4 bg-blue-50 border-blue-200 text-blue-800">
          <AlertDescription className="flex items-center gap-2">
            <CloudUpload size={18} />
            Theme settings are now saved to Supabase and will be synced across all devices.
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
