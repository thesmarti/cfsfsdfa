
import { useState, useEffect } from 'react';
import { SiteSettings, NavButton, GradientPreset } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Json } from '@/integrations/supabase/types';

const DEFAULT_GRADIENT_PRESETS: GradientPreset[] = [
  { id: 'purple-pink', name: 'Purple to Pink', value: 'bg-gradient-to-br from-violet-500 to-pink-600', category: 'default' },
  { id: 'blue-teal', name: 'Blue to Teal', value: 'bg-gradient-to-br from-blue-500 to-teal-400', category: 'default' },
  { id: 'orange-red', name: 'Orange to Red', value: 'bg-gradient-to-br from-orange-400 to-red-500', category: 'food' },
  { id: 'green-lime', name: 'Green to Lime', value: 'bg-gradient-to-br from-green-500 to-lime-300', category: 'default' },
  { id: 'pink-orange', name: 'Pink to Orange', value: 'bg-gradient-to-br from-pink-500 to-orange-400', category: 'fashion' },
  { id: 'indigo-purple', name: 'Indigo to Purple', value: 'bg-gradient-to-br from-indigo-500 to-purple-600', category: 'default' },
  { id: 'yellow-green', name: 'Yellow to Green', value: 'bg-gradient-to-br from-yellow-400 to-green-500', category: 'food' },
  { id: 'red-pink', name: 'Red to Pink', value: 'bg-gradient-to-br from-red-500 to-pink-500', category: 'default' },
  { id: 'teal-cyan', name: 'Teal to Cyan', value: 'bg-gradient-to-br from-teal-500 to-cyan-400', category: 'travel' },
  { id: 'amber-orange', name: 'Amber to Orange', value: 'bg-gradient-to-br from-amber-400 to-orange-500', category: 'home' },
  { id: 'fuchsia-pink', name: 'Fuchsia to Pink', value: 'bg-gradient-to-br from-fuchsia-500 to-pink-500', category: 'beauty' },
  { id: 'blue-indigo', name: 'Blue to Indigo', value: 'bg-gradient-to-br from-blue-500 to-indigo-600', category: 'electronics' },
];

const STATIC_SETTINGS: SiteSettings = {
  navBar: {
    showLogo: true,
    showText: true,
    logoUrl: 'https://static.vecteezy.com/system/resources/thumbnails/012/872/334/small_2x/discount-coupon-3d-png.png',
    siteTitle: 'GlowCoupons',
    buttons: [
      { id: 'home', label: 'Home', path: '/', enabled: true },
      { id: 'categories', label: 'Categories', path: '/categories', enabled: true },
      { id: 'stores', label: 'Stores', path: '/stores', enabled: true }
    ],
    showAdminButton: false,
    enableParticles: false,
    particlesColor: '#ffffff',
    particlesDensity: 50
  },
  colors: {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#ec4899',
    useCustomGradients: true,
    defaultGradient: 'bg-gradient-to-br from-violet-500 to-purple-600',
    fashionGradient: 'bg-gradient-to-br from-pink-500 to-purple-600',
    foodGradient: 'bg-gradient-to-br from-orange-400 to-red-500',
    electronicsGradient: 'bg-gradient-to-br from-blue-400 to-indigo-600',
    travelGradient: 'bg-gradient-to-br from-teal-400 to-emerald-500',
    beautyGradient: 'bg-gradient-to-br from-fuchsia-400 to-pink-500',
    homeGradient: 'bg-gradient-to-br from-amber-400 to-yellow-500',
    gradientPresets: DEFAULT_GRADIENT_PRESETS,
    uiGradient: 'bg-gradient-to-r from-indigo-500 to-purple-600',
  },
  general: {
    siteDescription: 'Find the best coupons and discounts online',
    footerText: '© 2025 GlowCoupons. All rights reserved.',
  },
  seo: {
    title: 'GlowCoupons - Best Discounts & Promo Codes',
    description: 'Find and save with the best coupons, discount codes, and promotions from top stores and brands.',
    favicon: '/favicon.ico',
  },
  textContent: {
    heroTitle: 'Save Big with Exclusive Coupons',
    heroSubtitle: 'Discover the best deals and discounts from your favorite stores',
    featuredDealsTitle: 'Featured Deals',
    allCouponsTitle: 'All Coupons',
    categoriesSectionTitle: 'Browse by Category',
    ctaButtonText: 'Get Code',
    noResultsText: 'No coupons found. Try a different search term or filter.',
    searchPlaceholder: 'Search for coupons or stores...',
  }
};

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>(STATIC_SETTINGS);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        console.log('Fetching settings from Supabase');
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .maybeSingle();
        
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching settings:', error);
          throw error;
        }
        
        if (data) {
          console.log('Received data from Supabase:', data);
          
          // Create a correctly structured merged settings object that matches our types
          const mergedSettings: SiteSettings = {
            ...STATIC_SETTINGS,
            navBar: {
              ...STATIC_SETTINGS.navBar,
              ...(data.navbar as any || {})
            },
            colors: {
              ...STATIC_SETTINGS.colors,
              ...(data.colors as any || {})
            },
            general: {
              ...STATIC_SETTINGS.general,
              ...(data.general as any || {})
            },
            seo: {
              ...STATIC_SETTINGS.seo,
              ...(data.seo as any || {})
            },
            textContent: {
              ...STATIC_SETTINGS.textContent,
              ...(data.text_content as any || {})
            }
          };
          
          if (!mergedSettings.colors.gradientPresets || mergedSettings.colors.gradientPresets.length === 0) {
            mergedSettings.colors.gradientPresets = DEFAULT_GRADIENT_PRESETS;
          }
          
          console.log('Merged settings:', mergedSettings);
          setSettings(mergedSettings);
          applySettings(mergedSettings);
        } else {
          console.log('No settings found, using defaults');
          setSettings(STATIC_SETTINGS);
          applySettings(STATIC_SETTINGS);
        }
      } catch (error) {
        console.error('Error fetching settings from Supabase:', error);
        toast({
          title: "Error loading settings",
          description: "Could not load settings from database. Using defaults.",
          variant: "destructive"
        });
        setSettings(STATIC_SETTINGS);
        applySettings(STATIC_SETTINGS);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const saveSettingsToSupabase = async (updatedSettings: SiteSettings) => {
    try {
      console.log('Saving settings to Supabase:', updatedSettings);
      
      const { data, error: fetchError } = await supabase
        .from('site_settings')
        .select('id')
        .maybeSingle();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error checking for existing settings:', fetchError);
        throw fetchError;
      }
      
      // Transform the SiteSettings object to match Supabase's expected schema
      // Make sure all complex objects are properly serializable as Json
      const supabaseSettings = {
        colors: transformToJsonCompatible(updatedSettings.colors),
        navbar: transformToJsonCompatible(updatedSettings.navBar),
        general: transformToJsonCompatible(updatedSettings.general),
        seo: transformToJsonCompatible(updatedSettings.seo),
        text_content: transformToJsonCompatible(updatedSettings.textContent),
        updated_at: new Date().toISOString()
      };
      
      console.log('Transformed settings for Supabase:', supabaseSettings);
      
      if (data?.id) {
        console.log('Updating existing settings with ID:', data.id);
        const { error } = await supabase
          .from('site_settings')
          .update(supabaseSettings)
          .eq('id', data.id);
          
        if (error) {
          console.error('Error updating settings:', error);
          throw error;
        }
      } else {
        console.log('Creating new settings record');
        const { error } = await supabase
          .from('site_settings')
          .insert({
            ...supabaseSettings,
            created_at: new Date().toISOString()
          });
          
        if (error) {
          console.error('Error inserting settings:', error);
          throw error;
        }
      }
      
      console.log('Settings saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving settings to Supabase:', error);
      toast({
        title: "Error saving settings",
        description: "Changes were applied locally but could not be saved to the database.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Helper function to transform complex objects to JSON-compatible format
  const transformToJsonCompatible = (obj: any): Json => {
    // Convert complex objects to simple key-value pairs
    // This ensures compatibility with Supabase's Json type
    return JSON.parse(JSON.stringify(obj)) as Json;
  };

  const updateSettings = async (newSettings: SiteSettings) => {
    console.log('Updating settings:', newSettings);
    if (!newSettings.colors.gradientPresets || newSettings.colors.gradientPresets.length === 0) {
      newSettings.colors.gradientPresets = DEFAULT_GRADIENT_PRESETS;
    }
    
    setSettings(newSettings);
    applySettings(newSettings);
    
    await saveSettingsToSupabase(newSettings);
  };

  const applySettings = (appliedSettings: SiteSettings) => {
    document.documentElement.style.setProperty('--custom-primary', appliedSettings.colors.primary);
    document.documentElement.style.setProperty('--custom-secondary', appliedSettings.colors.secondary);
    document.documentElement.style.setProperty('--custom-accent', appliedSettings.colors.accent);
    
    if (appliedSettings.colors.useCustomGradients && appliedSettings.colors.uiGradient) {
      document.documentElement.style.setProperty('--ui-gradient', appliedSettings.colors.uiGradient);
      
      const oldClasses = Array.from(document.documentElement.classList)
        .filter(c => c.startsWith('ui-gradient-'));
      
      if (oldClasses.length > 0) {
        oldClasses.forEach(c => document.documentElement.classList.remove(c));
      }
      
      const cleanClassName = 'ui-gradient-' + appliedSettings.colors.uiGradient
        .replace(/bg-/g, '')
        .replace(/from-|to-|via-/g, '')
        .replace(/[^a-zA-Z0-9-]/g, '-');
      
      document.documentElement.classList.add(cleanClassName);
    } else {
      const oldClasses = Array.from(document.documentElement.classList)
        .filter(c => c.startsWith('ui-gradient-'));
      
      if (oldClasses.length > 0) {
        oldClasses.forEach(c => document.documentElement.classList.remove(c));
      }
      
      document.documentElement.style.removeProperty('--ui-gradient');
    }
    
    try {
      document.documentElement.style.setProperty('--primary', hexToHsl(appliedSettings.colors.primary));
      document.documentElement.style.setProperty('--secondary', hexToHsl(appliedSettings.colors.secondary));
      document.documentElement.style.setProperty('--accent', hexToHsl(appliedSettings.colors.accent));
    } catch (error) {
      console.error('Error converting hex to HSL:', error);
    }

    if (appliedSettings.seo) {
      if (appliedSettings.seo.title) {
        document.title = appliedSettings.seo.title;
      }
      
      let metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', appliedSettings.seo.description);
      } else {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        metaDescription.setAttribute('content', appliedSettings.seo.description);
        document.head.appendChild(metaDescription);
      }
      
      let favIcon = document.querySelector('link[rel="icon"]');
      if (favIcon) {
        favIcon.setAttribute('href', appliedSettings.seo.favicon);
      }
    }
  };

  const updateNavBarSettings = async (navBarSettings: Partial<SiteSettings['navBar']>) => {
    console.log('Updating navbar settings:', navBarSettings);
    const updatedSettings = {
      ...settings,
      navBar: {
        ...settings.navBar,
        ...navBarSettings,
      },
    };
    await updateSettings(updatedSettings);
  };

  const updateNavButtons = async (buttons: NavButton[]) => {
    console.log('Updating nav buttons:', buttons);
    const updatedSettings = {
      ...settings,
      navBar: {
        ...settings.navBar,
        buttons,
      },
    };
    await updateSettings(updatedSettings);
  };

  const updateColorSettings = async (colorSettings: Partial<SiteSettings['colors']>) => {
    console.log('Updating color settings:', colorSettings);
    if (!settings.colors.gradientPresets && !colorSettings.gradientPresets) {
      colorSettings.gradientPresets = DEFAULT_GRADIENT_PRESETS;
    }
    
    const updatedSettings = {
      ...settings,
      colors: {
        ...settings.colors,
        ...colorSettings,
      },
    };
    await updateSettings(updatedSettings);
  };

  const updateGeneralSettings = async (generalSettings: Partial<SiteSettings['general']>) => {
    console.log('Updating general settings:', generalSettings);
    const updatedSettings = {
      ...settings,
      general: {
        ...settings.general,
        ...generalSettings,
      },
    };
    await updateSettings(updatedSettings);
  };

  const updateSeoSettings = async (seoSettings: Partial<SiteSettings['seo']>) => {
    console.log("Updating SEO settings:", seoSettings);
    const updatedSettings = {
      ...settings,
      seo: {
        ...settings.seo,
        ...seoSettings,
      },
    };
    await updateSettings(updatedSettings);
  };

  const updateTextContent = async (textContent: Partial<SiteSettings['textContent']>) => {
    console.log('Updating text content:', textContent);
    const updatedSettings = {
      ...settings,
      textContent: {
        ...settings.textContent,
        ...textContent,
      },
    };
    await updateSettings(updatedSettings);
  };

  const uploadLogo = async (file: File): Promise<string> => {
    try {
      console.log('Uploading logo file:', file.name);
      const base64Image = await readFileAsDataURL(file);
      console.log('Logo converted to base64');
      
      await updateNavBarSettings({ logoUrl: base64Image });
      
      return base64Image;
    } catch (error) {
      console.error('Error uploading logo:', error);
      throw error;
    }
  };

  const uploadFavicon = async (file: File): Promise<string> => {
    try {
      console.log('Uploading favicon file:', file.name);
      const base64Image = await readFileAsDataURL(file);
      console.log("Favicon base64:", base64Image.substring(0, 50) + "...");
      
      await updateSeoSettings({ favicon: base64Image });
      
      return base64Image;
    } catch (error) {
      console.error('Error uploading favicon:', error);
      throw error;
    }
  };

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('No file selected'));
        return;
      }
      
      if (!file.type.match('image.*')) {
        reject(new Error('File is not an image'));
        return;
      }
      
      if (file.size > 2 * 1024 * 1024) {
        reject(new Error('File is too large (max 2MB)'));
        return;
      }
      
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          resolve(e.target.result.toString());
        } else {
          reject(new Error('Error reading file'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };
      
      reader.readAsDataURL(file);
    });
  };

  const hexToHsl = (hex: string): string => {
    hex = hex.replace(/^#/, '');
    
    let r = parseInt(hex.substring(0, 2), 16) / 255;
    let g = parseInt(hex.substring(2, 4), 16) / 255;
    let b = parseInt(hex.substring(4, 6), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    
    const l = (max + min) / 2;
    
    let h, s;
    
    if (max === min) {
      h = s = 0;
    } else {
      s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
      
      switch (max) {
        case r:
          h = (g - b) / (max - min) + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / (max - min) + 2;
          break;
        case b:
          h = (r - g) / (max - min) + 4;
          break;
        default:
          h = 0;
      }
      
      h = Math.round(h * 60);
    }
    
    const hslValue = `${h} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    return hslValue;
  };

  const applyUIGradient = async (preset: GradientPreset) => {
    console.log('Applying UI gradient:', preset);
    const updatedSettings = {
      ...settings,
      colors: {
        ...settings.colors,
        uiGradient: preset.value,
      },
    };
    await updateSettings(updatedSettings);
  };

  return {
    settings,
    loading,
    updateSettings,
    updateNavBarSettings,
    updateNavButtons,
    updateColorSettings,
    updateGeneralSettings,
    updateSeoSettings,
    updateTextContent,
    uploadLogo,
    uploadFavicon,
    applyUIGradient,
  };
};
