
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
  link: string;
  status: 'active' | 'expired' | 'upcoming';
  featured: boolean;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContentLockerLink {
  id: string;
  name: string;
  url: string;
  active: boolean;
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
