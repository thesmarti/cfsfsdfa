import { useState, useEffect, useCallback } from 'react';
import { Coupon, SortOption, FilterOption, ContentLockerLink } from '@/types';
import { useToast } from "@/components/ui/use-toast";

// Default coupons to use if none in localStorage
const defaultCoupons: Coupon[] = [
  {
    id: '1',
    store: 'Amazon',
    code: 'SAVE20NOW',
    description: 'Get 20% off any purchase over $50',
    discount: '20% OFF',
    expiryDate: '2023-12-31',
    category: 'DISCOUNT CODE',
    featured: true,
    lastVerified: '2023-06-15',
    status: 'active',
    createdAt: '2023-01-15',
    updatedAt: '2023-06-15',
    redirectUrl: 'https://amazon.com',
    image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    usedCount: 754
  },
  {
    id: '2',
    store: 'Best Buy',
    code: 'SUMMER30',
    description: '$30 off purchases of $100 or more',
    discount: '$30 OFF',
    expiryDate: '2023-08-31',
    category: 'DISCOUNT CODE',
    featured: true,
    lastVerified: '2023-06-20',
    status: 'active',
    createdAt: '2023-05-10',
    updatedAt: '2023-06-20',
    redirectUrl: 'https://bestbuy.com',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.0,
    usedCount: 412
  },
  {
    id: '3',
    store: 'Nike',
    code: 'RUN25OFF',
    description: '25% off running shoes',
    discount: '25% OFF',
    expiryDate: '2023-09-15',
    category: 'COUPON CODE',
    featured: false,
    lastVerified: '2023-06-10',
    status: 'active',
    createdAt: '2023-06-01',
    updatedAt: '2023-06-10',
    redirectUrl: 'https://nike.com',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 3.5,
    usedCount: 289
  },
  {
    id: '4',
    store: 'Uber Eats',
    code: 'EATFREE',
    description: 'Free delivery on your first order',
    discount: 'FREE DELIVERY',
    expiryDate: '2023-12-31',
    category: 'FREE CODE',
    featured: true,
    lastVerified: '2023-06-18',
    status: 'active',
    createdAt: '2023-06-05',
    updatedAt: '2023-06-18',
    redirectUrl: 'https://ubereats.com',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    usedCount: 967
  },
  {
    id: '5',
    store: 'Walmart',
    code: 'SAVE10WM',
    description: '10% off your entire purchase',
    discount: '10% OFF',
    expiryDate: '2023-07-31',
    category: 'DISCOUNT CODE',
    featured: false,
    lastVerified: '2023-06-12',
    status: 'active',
    createdAt: '2023-04-22',
    updatedAt: '2023-06-12',
    redirectUrl: 'https://walmart.com',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 3.5,
    usedCount: 213
  },
  {
    id: '6',
    store: 'Steam',
    code: 'GAME15OFF',
    description: '15% off select Steam games',
    discount: '15% OFF',
    expiryDate: '2023-11-30',
    category: 'GAME CODE',
    featured: false,
    lastVerified: '2023-06-14',
    status: 'active',
    createdAt: '2023-05-30',
    updatedAt: '2023-06-14',
    redirectUrl: 'https://store.steampowered.com',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    usedCount: 532
  }
];

// Default links to use if none in localStorage
const defaultLinks: ContentLockerLink[] = [
  {
    id: '1',
    name: 'Amazon Shop',
    url: 'https://amazon.com',
    active: true,
    createdAt: '2023-01-01'
  },
  {
    id: '2',
    name: 'Best Buy Deals',
    url: 'https://bestbuy.com',
    active: true,
    createdAt: '2023-01-02'
  },
  {
    id: '3',
    name: 'Nike Store',
    url: 'https://nike.com',
    active: false,
    createdAt: '2023-01-03'
  }
];

// Load data from localStorage or use defaults
const loadFromStorage = (key: string, defaultValue: any) => {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// Save data to localStorage
const saveToStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

export const useCoupons = () => {
  const { toast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [featuredCoupons, setFeaturedCoupons] = useState<Coupon[]>([]);
  const [links, setLinks] = useState<ContentLockerLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Sort and filter options
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');

  // Load data from localStorage on initial mount
  useEffect(() => {
    const couponsFromStorage = loadFromStorage('coupons', defaultCoupons);
    const linksFromStorage = loadFromStorage('links', defaultLinks);
    
    // Initialize database with data from localStorage
    couponsDatabase = [...couponsFromStorage];
    linksDatabase = [...linksFromStorage];
    
    fetchCoupons();
    fetchLinks();
  }, []);
  
  // In-memory databases
  let couponsDatabase = loadFromStorage('coupons', defaultCoupons);
  let linksDatabase = loadFromStorage('links', defaultLinks);
  
  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Get coupons from our "database"
      let result = [...couponsDatabase];
      
      // Apply filters
      if (filterBy !== 'all') {
        if (['active', 'expired', 'upcoming'].includes(filterBy)) {
          result = result.filter(coupon => coupon.status === filterBy);
        } else {
          // Filter by category
          result = result.filter(coupon => coupon.category === filterBy);
        }
      }
      
      // Apply sorting
      if (sortBy === 'newest') {
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } else if (sortBy === 'expiringSoon') {
        result.sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
      }
      
      setCoupons(result);
      setFeaturedCoupons(result.filter(coupon => coupon.featured));
      setError(null);
    } catch (err) {
      console.error('Error fetching coupons:', err);
      setError('Failed to load coupons. Please try again later.');
      toast({
        title: "Error",
        description: "Failed to load coupons. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [sortBy, filterBy, toast]);

  const fetchLinks = useCallback(async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 200));
      setLinks(linksDatabase);
    } catch (err) {
      console.error('Error fetching links:', err);
      toast({
        title: "Error",
        description: "Failed to load content locker links.",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Admin functions for managing coupons
  const addCoupon = useCallback(async (coupon: Omit<Coupon, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      
      // If rating is not provided, set a default rating
      if (!coupon.rating) {
        coupon.rating = Math.floor(Math.random() * 2) + 3 + Math.random() * 0.5;
      }
      
      // If usedCount is not provided, set a random default
      if (!coupon.usedCount) {
        coupon.usedCount = Math.floor(Math.random() * 900) + 100;
      }
      
      const now = new Date().toISOString();
      const newCoupon: Coupon = {
        ...coupon,
        id: Date.now().toString(),
        createdAt: now,
        updatedAt: now
      };
      
      // Update our "database"
      couponsDatabase = [...couponsDatabase, newCoupon];
      
      // Save to localStorage
      saveToStorage('coupons', couponsDatabase);
      
      // Refresh the coupon list
      await fetchCoupons();
      
      toast({
        title: "Success",
        description: "Coupon added successfully!",
      });
      
      return newCoupon;
    } catch (err) {
      console.error('Error adding coupon:', err);
      toast({
        title: "Error",
        description: "Failed to add coupon. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchCoupons, toast]);

  const updateCoupon = useCallback(async (id: string, updates: Partial<Coupon>) => {
    try {
      setLoading(true);
      
      // Find and update the coupon in our "database"
      const couponIndex = couponsDatabase.findIndex(c => c.id === id);
      
      if (couponIndex === -1) {
        throw new Error('Coupon not found');
      }
      
      const updatedCoupon = {
        ...couponsDatabase[couponIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      couponsDatabase = [
        ...couponsDatabase.slice(0, couponIndex),
        updatedCoupon,
        ...couponsDatabase.slice(couponIndex + 1)
      ];
      
      // Save to localStorage
      saveToStorage('coupons', couponsDatabase);
      
      // Refresh the coupon list
      await fetchCoupons();
      
      toast({
        title: "Success",
        description: "Coupon updated successfully!",
      });
      
      return updatedCoupon;
    } catch (err) {
      console.error('Error updating coupon:', err);
      toast({
        title: "Error",
        description: "Failed to update coupon. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchCoupons, toast]);

  const deleteCoupon = useCallback(async (id: string) => {
    try {
      setLoading(true);
      
      // Remove the coupon from our "database"
      couponsDatabase = couponsDatabase.filter(c => c.id !== id);
      
      // Save to localStorage
      saveToStorage('coupons', couponsDatabase);
      
      // Refresh the coupon list
      await fetchCoupons();
      
      toast({
        title: "Success",
        description: "Coupon deleted successfully!",
      });
      
      return true;
    } catch (err) {
      console.error('Error deleting coupon:', err);
      toast({
        title: "Error",
        description: "Failed to delete coupon. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchCoupons, toast]);

  // Bulk update and delete functions
  const bulkUpdateCoupons = useCallback(async (ids: string[], updates: Partial<Coupon>) => {
    try {
      setLoading(true);
      
      // Update each coupon
      const now = new Date().toISOString();
      
      couponsDatabase = couponsDatabase.map(coupon => {
        if (ids.includes(coupon.id)) {
          return {
            ...coupon,
            ...updates,
            updatedAt: now
          };
        }
        return coupon;
      });
      
      // Save to localStorage
      saveToStorage('coupons', couponsDatabase);
      
      // Refresh the coupon list
      await fetchCoupons();
      
      toast({
        title: "Success",
        description: `${ids.length} coupons updated successfully!`,
      });
      
      return true;
    } catch (err) {
      console.error('Error updating coupons in bulk:', err);
      toast({
        title: "Error",
        description: "Failed to update coupons. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchCoupons, toast]);

  const bulkDeleteCoupons = useCallback(async (ids: string[]) => {
    try {
      setLoading(true);
      
      // Remove the coupons from our "database"
      couponsDatabase = couponsDatabase.filter(c => !ids.includes(c.id));
      
      // Save to localStorage
      saveToStorage('coupons', couponsDatabase);
      
      // Refresh the coupon list
      await fetchCoupons();
      
      toast({
        title: "Success",
        description: `${ids.length} coupons deleted successfully!`,
      });
      
      return true;
    } catch (err) {
      console.error('Error deleting coupons in bulk:', err);
      toast({
        title: "Error",
        description: "Failed to delete coupons. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchCoupons, toast]);

  // Content Locker Links functions
  const addLink = useCallback(async (link: Omit<ContentLockerLink, 'id' | 'createdAt'>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newLink: ContentLockerLink = {
        ...link,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      
      // Update our "database"
      linksDatabase = [...linksDatabase, newLink];
      
      // Save to localStorage
      saveToStorage('links', linksDatabase);
      
      // Refresh the links list
      await fetchLinks();
      
      toast({
        title: "Success",
        description: "Link added successfully!",
      });
      
      return newLink;
    } catch (err) {
      console.error('Error adding link:', err);
      toast({
        title: "Error",
        description: "Failed to add link. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  }, [fetchLinks, toast]);

  const updateLink = useCallback(async (id: string, updates: Partial<ContentLockerLink>) => {
    try {
      // Find and update the link in our "database"
      const linkIndex = linksDatabase.findIndex(l => l.id === id);
      
      if (linkIndex === -1) {
        throw new Error('Link not found');
      }
      
      const updatedLink = {
        ...linksDatabase[linkIndex],
        ...updates
      };
      
      linksDatabase = [
        ...linksDatabase.slice(0, linkIndex),
        updatedLink,
        ...linksDatabase.slice(linkIndex + 1)
      ];
      
      // Save to localStorage
      saveToStorage('links', linksDatabase);
      
      // Refresh the links list
      await fetchLinks();
      
      toast({
        title: "Success",
        description: "Link updated successfully!",
      });
      
      return updatedLink;
    } catch (err) {
      console.error('Error updating link:', err);
      toast({
        title: "Error",
        description: "Failed to update link. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  }, [fetchLinks, toast]);

  const deleteLink = useCallback(async (id: string) => {
    try {
      // Remove the link from our "database"
      linksDatabase = linksDatabase.filter(l => l.id !== id);
      
      // Save to localStorage
      saveToStorage('links', linksDatabase);
      
      // Refresh the links list
      await fetchLinks();
      
      toast({
        title: "Success",
        description: "Link deleted successfully!",
      });
      
      return true;
    } catch (err) {
      console.error('Error deleting link:', err);
      toast({
        title: "Error",
        description: "Failed to delete link. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }, [fetchLinks, toast]);

  const getCouponById = useCallback((id: string) => {
    return couponsDatabase.find(c => c.id === id) || null;
  }, []);

  return {
    coupons,
    featuredCoupons,
    links,
    loading,
    error,
    sortBy,
    filterBy,
    setSortBy,
    setFilterBy,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    bulkUpdateCoupons,
    bulkDeleteCoupons,
    getCouponById,
    refreshCoupons: fetchCoupons,
    addLink,
    updateLink,
    deleteLink
  };
};
