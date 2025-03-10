
import { useState, useEffect } from 'react';
import { ThemeSelector } from './ThemeSelector';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CloudUpload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

type ThemeOption = "light" | "dark" | "system";

export const ThemeSettingsTab = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeOption>('system');
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  // Load theme from Supabase on mount
  useEffect(() => {
    const loadThemeFromSupabase = async () => {
      setIsSyncing(true);
      try {
        console.log('Loading theme from Supabase');
        const { data, error } = await supabase
          .from('site_settings')
          .select('theme')
          .maybeSingle();
        
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching theme setting:', error);
          throw error;
        }
        
        if (data?.theme) {
          // Parse the theme from Json type to string
          const themeValue = typeof data.theme === 'string' 
            ? data.theme as ThemeOption
            : JSON.stringify(data.theme);
            
          // Make sure it's a valid theme option
          const validTheme = ['light', 'dark', 'system'].includes(themeValue) 
            ? themeValue as ThemeOption 
            : 'system';
            
          console.log('Theme loaded from Supabase:', validTheme);
          setCurrentTheme(validTheme);
          applyThemeToDocument(validTheme);
        } else {
          // If no theme setting exists yet, set up with current theme
          console.log('No theme setting found, using system default');
          // Get theme from localStorage for first-time migration
          const storedTheme = localStorage.getItem('theme');
          const initialTheme = storedTheme === 'dark' ? 'dark' : 
                             storedTheme === 'light' ? 'light' : 
                             'system';
          
          setCurrentTheme(initialTheme);
          applyThemeToDocument(initialTheme);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
        toast({
          title: 'Error',
          description: 'Failed to load theme setting. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsSyncing(false);
      }
    };

    loadThemeFromSupabase();
  }, []);

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
      console.log('Saving theme to Supabase:', theme);
      
      // Check if settings record exists
      const { data, error: fetchError } = await supabase
        .from('site_settings')
        .select('id')
        .maybeSingle();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching settings:', fetchError);
        throw fetchError;
      }
      
      if (data?.id) {
        console.log('Updating existing record with ID:', data.id);
        // Update existing record
        const { error } = await supabase
          .from('site_settings')
          .update({ 
            // Store theme as a JSON string value
            theme: theme as unknown as Json,
            updated_at: new Date().toISOString()
          })
          .eq('id', data.id);
          
        if (error) {
          console.error('Error updating theme:', error);
          throw error;
        }
      } else {
        console.log('Creating new settings record');
        // Insert new record
        const { error } = await supabase
          .from('site_settings')
          .insert({ 
            theme: theme as unknown as Json,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          
        if (error) {
          console.error('Error inserting theme:', error);
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
