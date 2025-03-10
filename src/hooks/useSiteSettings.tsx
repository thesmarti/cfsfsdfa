
import { useState, useEffect } from 'react';
import { SiteSettings } from '@/types';

const DEFAULT_SETTINGS: SiteSettings = {
  navBar: {
    showLogo: true,
    showText: true,
    logoUrl: 'https://via.placeholder.com/50x50?text=Logo',
    siteTitle: 'LOLCoupons',
  },
  colors: {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#ec4899',
  },
  general: {
    siteDescription: 'Find the best coupons and discounts online',
    footerText: '© 2023 LOLCoupons. All rights reserved.',
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
          setSettings(JSON.parse(savedSettings));
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
  };

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

  return {
    settings,
    loading,
    updateSettings,
    updateNavBarSettings,
    updateColorSettings,
    updateGeneralSettings,
  };
};
