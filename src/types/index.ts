
export interface User {
  id: string;
  email: string;
  password?: string;
  role: 'admin' | 'user';
}

export interface Coupon {
  id: string;
  store: string;
  code: string;
  description: string;
  discount: string;
  category: 'GAME CODE' | 'DISCOUNT CODE' | 'COUPON CODE' | 'FREE CODE';
  expiryDate: string;
  link?: string;
  status: 'active' | 'expired' | 'upcoming';
  featured: boolean;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  // Missing properties being used in the codebase
  lastVerified?: string;
  redirectUrl?: string;
  image?: string;
  rating?: number;
  usedCount?: number;
  contentLockerLinkId?: string;
}

export interface ContentLockerLink {
  id: string;
  name: string;
  url: string;
  active: boolean;
  createdAt: string;
}

export interface NavButton {
  id: string;
  label: string;
  path: string;
  enabled: boolean;
}

export interface GradientPreset {
  id: string;
  name: string;
  value: string;
  category: string;
}

export interface SiteSettings {
  navBar: {
    showLogo: boolean;
    showText: boolean;
    logoUrl: string;
    siteTitle: string;
    buttons: NavButton[];
    showAdminButton: boolean;
    enableParticles: boolean;
    particlesColor: string;
    particlesDensity: number;
    navStyle: 'default' | 'centered';
    tagline: string;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    useCustomGradients: boolean;
    defaultGradient: string;
    fashionGradient: string;
    foodGradient: string;
    electronicsGradient: string;
    travelGradient: string;
    beautyGradient: string;
    homeGradient: string;
    gradientPresets: GradientPreset[];
    uiGradient: string;
  };
  general: {
    siteDescription: string;
    footerText: string;
  };
  seo: {
    title: string;
    description: string;
    favicon: string;
  };
}

// Adding missing types for sort and filter options
export type SortOption = 'newest' | 'popular' | 'expiringSoon';
export type FilterOption = 'all' | 'active' | 'expired' | 'upcoming' | 'GAME CODE' | 'DISCOUNT CODE' | 'COUPON CODE' | 'FREE CODE' | 'Electronics' | 'Fashion' | 'Food' | 'Retail';
