
import { useState, useEffect, useCallback } from 'react';
import { Coupon, SortOption, FilterOption } from '@/types';
import { useToast } from "@/components/ui/use-toast";

// This is a mock database for demonstration purposes
// In a real app, this would be replaced with an actual backend call
const mockCoupons: Coupon[] = [
  {
    id: '1',
    store: 'Amazon',
    code: 'SAVE20NOW',
    description: 'Get 20% off any purchase over $50',
    discount: '20% OFF',
    expiryDate: '2023-12-31',
    category: 'Electronics',
    featured: true,
    lastVerified: '2023-06-15',
    status: 'active',
    createdAt: '2023-01-15',
    updatedAt: '2023-06-15'
  },
  {
    id: '2',
    store: 'Best Buy',
    code: 'SUMMER30',
    description: '$30 off purchases of $100 or more',
    discount: '$30 OFF',
    expiryDate: '2023-08-31',
    category: 'Electronics',
    featured: true,
    lastVerified: '2023-06-20',
    status: 'active',
    createdAt: '2023-05-10',
    updatedAt: '2023-06-20'
  },
  {
    id: '3',
    store: 'Nike',
    code: 'RUN25OFF',
    description: '25% off running shoes',
    discount: '25% OFF',
    expiryDate: '2023-09-15',
    category: 'Fashion',
    featured: false,
    lastVerified: '2023-06-10',
    status: 'active',
    createdAt: '2023-06-01',
    updatedAt: '2023-06-10'
  },
  {
    id: '4',
    store: 'Uber Eats',
    code: 'EATFREE',
    description: 'Free delivery on your first order',
    discount: 'FREE DELIVERY',
    expiryDate: '2023-12-31',
    category: 'Food',
    featured: true,
    lastVerified: '2023-06-18',
    status: 'active',
    createdAt: '2023-06-05',
    updatedAt: '2023-06-18'
  },
  {
    id: '5',
    store: 'Walmart',
    code: 'SAVE10WM',
    description: '10% off your entire purchase',
    discount: '10% OFF',
    expiryDate: '2023-07-31',
    category: 'Retail',
    featured: false,
    lastVerified: '2023-06-12',
    status: 'active',
    createdAt: '2023-04-22',
    updatedAt: '2023-06-12'
  },
  {
    id: '6',
    store: 'Target',
    code: 'TARGET15',
    description: '$15 off purchases of $75 or more',
    discount: '$15 OFF',
    expiryDate: '2023-11-30',
    category: 'Retail',
    featured: false,
    lastVerified: '2023-06-14',
    status: 'active',
    createdAt: '2023-05-30',
    updatedAt: '2023-06-14'
  }
];

// In-memory database (this would be a real backend in production)
let couponsDatabase = [...mockCoupons];

export const useCoupons = () => {
  const { toast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [featuredCoupons, setFeaturedCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Sort and filter options
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  
  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
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
      // For 'popular' sorting we'd normally use data like clicks or use count
      
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

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  // Admin functions for managing coupons
  const addCoupon = useCallback(async (coupon: Omit<Coupon, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const now = new Date().toISOString();
      const newCoupon: Coupon = {
        ...coupon,
        id: Date.now().toString(), // In a real app, the backend would generate this
        createdAt: now,
        updatedAt: now
      };
      
      // Update our "database"
      couponsDatabase = [...couponsDatabase, newCoupon];
      
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove the coupon from our "database"
      couponsDatabase = couponsDatabase.filter(c => c.id !== id);
      
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

  const getCouponById = useCallback((id: string) => {
    return couponsDatabase.find(c => c.id === id) || null;
  }, []);

  return {
    coupons,
    featuredCoupons,
    loading,
    error,
    sortBy,
    filterBy,
    setSortBy,
    setFilterBy,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    getCouponById,
    refreshCoupons: fetchCoupons
  };
};
