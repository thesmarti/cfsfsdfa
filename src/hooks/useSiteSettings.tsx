
import { useState, useEffect } from 'react';
import { SiteSettings, NavButton } from '@/types';

const DEFAULT_SETTINGS: SiteSettings = {
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
    showAdminButton: false
  },
  colors: {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#ec4899',
    useCustomGradients: false,
    defaultGradient: 'bg-gradient-to-br from-violet-500 to-purple-600',
    fashionGradient: 'bg-gradient-to-br from-pink-500 to-purple-600',
    foodGradient: 'bg-gradient-to-br from-orange-400 to-red-500',
    electronicsGradient: 'bg-gradient-to-br from-blue-400 to-indigo-600',
    travelGradient: 'bg-gradient-to-br from-teal-400 to-emerald-500',
    beautyGradient: 'bg-gradient-to-br from-fuchsia-400 to-pink-500',
    homeGradient: 'bg-gradient-to-br from-amber-400 to-yellow-500',
  },
  general: {
    siteDescription: 'Find the best coupons and discounts online',
    footerText: '© 2025 GlowCoupons. All rights reserved.',
  },
};

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = () => {
      const savedSettings = localStorage.getItem('siteSettings');
      if (savedSettings) {
        try {
          const parsedSettings = JSON.parse(savedSettings);
          const mergedSettings = {
            ...DEFAULT_SETTINGS,
            ...parsedSettings,
            navBar: {
              ...DEFAULT_SETTINGS.navBar,
              ...parsedSettings.navBar,
              buttons: parsedSettings.navBar?.buttons || DEFAULT_SETTINGS.navBar.buttons,
            },
            colors: {
              ...DEFAULT_SETTINGS.colors,
              ...parsedSettings.colors,
            },
            general: {
              ...DEFAULT_SETTINGS.general,
              ...parsedSettings.general,
            }
          };
          setSettings(mergedSettings);
        } catch (error) {
          console.error('Error parsing site settings:', error);
          setSettings(DEFAULT_SETTINGS);
        }
      }
      setLoading(false);
    };

    loadSettings();
  }, []);

  const updateSettings = (newSettings: SiteSettings) => {
    setSettings(newSettings);
    localStorage.setItem('siteSettings', JSON.stringify(newSettings));
    applySettings(newSettings);
  };

  const applySettings = (appliedSettings: SiteSettings) => {
    document.documentElement.style.setProperty('--custom-primary', appliedSettings.colors.primary);
    document.documentElement.style.setProperty('--custom-secondary', appliedSettings.colors.secondary);
    document.documentElement.style.setProperty('--custom-accent', appliedSettings.colors.accent);
    
    try {
      document.documentElement.style.setProperty('--primary', hexToHsl(appliedSettings.colors.primary));
      document.documentElement.style.setProperty('--secondary', hexToHsl(appliedSettings.colors.secondary));
      document.documentElement.style.setProperty('--accent', hexToHsl(appliedSettings.colors.accent));
    } catch (error) {
      console.error('Error converting hex to HSL:', error);
    }
  };

  useEffect(() => {
    if (!loading) {
      applySettings(settings);
    }
  }, [loading, settings]);

  const updateNavBarSettings = (navBarSettings: Partial<SiteSettings['navBar']>) => {
    const updatedSettings = {
      ...settings,
      navBar: {
        ...settings.navBar,
        ...navBarSettings,
      },
    };
    updateSettings(updatedSettings);
  };

  const updateNavButtons = (buttons: NavButton[]) => {
    const updatedSettings = {
      ...settings,
      navBar: {
        ...settings.navBar,
        buttons,
      },
    };
    updateSettings(updatedSettings);
  };

  const updateColorSettings = (colorSettings: Partial<SiteSettings['colors']>) => {
    const updatedSettings = {
      ...settings,
      colors: {
        ...settings.colors,
        ...colorSettings,
      },
    };
    updateSettings(updatedSettings);
  };

  const updateGeneralSettings = (generalSettings: Partial<SiteSettings['general']>) => {
    const updatedSettings = {
      ...settings,
      general: {
        ...settings.general,
        ...generalSettings,
      },
    };
    updateSettings(updatedSettings);
  };

  const uploadLogo = (file: File): Promise<string> => {
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
          const base64Image = e.target.result.toString();
          updateNavBarSettings({ logoUrl: base64Image });
          resolve(base64Image);
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

  return {
    settings,
    loading,
    updateSettings,
    updateNavBarSettings,
    updateNavButtons,
    updateColorSettings,
    updateGeneralSettings,
    uploadLogo,
  };
};
