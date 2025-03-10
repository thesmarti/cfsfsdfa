
import { useState, useEffect } from 'react';
import { ThemeSelector } from './ThemeSelector';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CloudUpload, Info, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

type ThemeOption = "light" | "dark" | "system";

export const ThemeSettingsTab = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeOption>('system');
  const [isSyncing, setIsSyncing] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [rlsNeedsSetup, setRlsNeedsSetup] = useState(false);
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
        
        if (error) {
          // Check if this is an RLS error
          if (error.code === '42501') {
            console.log('RLS policy error detected');
            setRlsNeedsSetup(true);
            // Still load the theme from localStorage as fallback
            const storedTheme = localStorage.getItem('theme');
            const initialTheme = storedTheme === 'dark' ? 'dark' : 
                             storedTheme === 'light' ? 'light' : 
                             'system';
            
            setCurrentTheme(initialTheme);
            applyThemeToDocument(initialTheme);
            return;
          } else if (error.code !== 'PGRST116') {
            console.error('Error fetching theme setting:', error);
            throw error;
          }
        }
        
        if (data?.theme) {
          // Parse the theme safely
          let themeValue: string;
          
          if (typeof data.theme === 'string') {
            themeValue = data.theme;
          } else if (typeof data.theme === 'object') {
            themeValue = JSON.stringify(data.theme);
          } else {
            themeValue = String(data.theme);
          }
            
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
        setSaveError(null);
        setRlsNeedsSetup(false);
      } catch (error) {
        console.error('Error loading theme:', error);
        // Check if this could be an RLS error
        if (error && typeof error === 'object' && 'code' in error && error.code === '42501') {
          setRlsNeedsSetup(true);
        }
        toast({
          title: 'Error',
          description: 'Failed to load theme setting. Using local settings instead.',
          variant: 'destructive',
        });
        // Load from localStorage as fallback
        const storedTheme = localStorage.getItem('theme');
        const initialTheme = storedTheme === 'dark' ? 'dark' : 
                           storedTheme === 'light' ? 'light' : 
                           'system';
        setCurrentTheme(initialTheme);
        applyThemeToDocument(initialTheme);
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
    if (rlsNeedsSetup) {
      // If we already know RLS is not set up, don't attempt to save to Supabase
      setSaveError('Database permissions not configured (RLS policy needed)');
      return;
    }
    
    setIsSyncing(true);
    setSaveError(null);
    try {
      console.log('Saving theme to Supabase:', theme);
      
      // Check if settings record exists
      const { data, error: fetchError } = await supabase
        .from('site_settings')
        .select('id')
        .maybeSingle();
      
      if (fetchError) {
        if (fetchError.code === '42501') {
          // This is an RLS error
          setRlsNeedsSetup(true);
          throw new Error('Database permissions not configured (RLS policy needed)');
        } else if (fetchError.code !== 'PGRST116') {
          console.error('Error fetching settings:', fetchError);
          throw fetchError;
        }
      }
      
      if (data?.id) {
        console.log('Updating existing record with ID:', data.id);
        // Update existing record
        const { error } = await supabase
          .from('site_settings')
          .update({
            theme: theme, // pass the theme directly as a string
            updated_at: new Date().toISOString()
          })
          .eq('id', data.id);
          
        if (error) {
          if (error.code === '42501') {
            // This is an RLS error
            setRlsNeedsSetup(true);
            throw new Error('Database permissions not configured (RLS policy needed)');
          }
          console.error('Error updating theme:', error);
          throw error;
        }
      } else {
        console.log('Creating new settings record');
        // Insert new record
        const { error } = await supabase
          .from('site_settings')
          .insert({
            theme: theme, // pass the theme directly as a string
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          
        if (error) {
          if (error.code === '42501') {
            // This is an RLS error
            setRlsNeedsSetup(true);
            throw new Error('Database permissions not configured (RLS policy needed)');
          }
          console.error('Error inserting theme:', error);
          throw error;
        }
      }
      
      toast({
        title: 'Success',
        description: 'Theme setting saved and synced across all devices.',
      });
    } catch (error: any) {
      console.error('Error saving theme:', error);
      const errorMessage = error?.message || 'Failed to save theme setting';
      setSaveError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleThemeChange = async (theme: ThemeOption) => {
    // Always update local theme
    setCurrentTheme(theme);
    applyThemeToDocument(theme);
    
    // Try to save to Supabase if RLS might be configured
    if (!rlsNeedsSetup) {
      await saveThemeToSupabase(theme);
    }
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
        {rlsNeedsSetup && (
          <Alert className="mb-4 bg-amber-50 border-amber-200 text-amber-800">
            <AlertDescription className="flex items-center gap-2">
              <AlertTriangle size={18} />
              <div>
                <p className="font-semibold">Database permissions not configured</p>
                <p className="text-sm">Theme changes will only apply locally. To enable syncing, you must set up RLS policies in Supabase.</p>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        {!rlsNeedsSetup && (
          <Alert className="mb-4 bg-blue-50 border-blue-200 text-blue-800">
            <AlertDescription className="flex items-center gap-2">
              <CloudUpload size={18} />
              Theme settings are now saved to Supabase and will be synced across all devices.
            </AlertDescription>
          </Alert>
        )}
        
        {saveError && !rlsNeedsSetup && (
          <Alert className="mb-4 bg-red-50 border-red-200 text-red-800">
            <AlertDescription className="flex items-center gap-2">
              <Info size={18} />
              {saveError} - Theme changes applied locally only.
            </AlertDescription>
          </Alert>
        )}
        
        <ThemeSelector 
          currentTheme={currentTheme} 
          onThemeChange={handleThemeChange} 
        />
      </CardContent>
    </Card>
  );
};
