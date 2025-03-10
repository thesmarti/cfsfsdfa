
export interface Coupon {
  id: string;
  store: string;
  code: string;
  description: string;
  discount: string;
  expiryDate: string;
  category: string;
  featured?: boolean;
  lastVerified?: string;
  status: 'active' | 'expired' | 'upcoming';
  createdAt: string;
  updatedAt: string;
  redirectUrl?: string;
  image?: string;
  contentLockerLinkId?: string; // New field to link to content locker
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

export type SortOption = 'newest' | 'popular' | 'expiringSoon';
export type FilterOption = 'all' | 'active' | 'expired' | string;

export interface ContentLockerLink {
  id: string;
  name: string;
  url: string;
  active: boolean;
  createdAt: string;
}

export interface SiteSettings {
  navBar: {
    showLogo: boolean;
    showText: boolean;
    logoUrl: string;
    siteTitle: string;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    useCustomGradients?: boolean;
    defaultGradient?: string;
    fashionGradient?: string;
    foodGradient?: string;
    electronicsGradient?: string;
    travelGradient?: string;
    beautyGradient?: string;
    homeGradient?: string;
  };
  general: {
    siteDescription: string;
    footerText: string;
  };
}
