
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Coupon, ContentLockerLink, SortOption, FilterOption } from '@/types';

// Custom hook to manage coupons and content locker links
export const useCoupons = () => {
  const { toast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [links, setLinks] = useState<ContentLockerLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');

  // Function to initialize coupons from localStorage
  const initializeCoupons = useCallback(() => {
    try {
      setLoading(true);
      const storedCoupons = localStorage.getItem('coupons');
      const initialCoupons = storedCoupons ? JSON.parse(storedCoupons) : [];
      setCoupons(initialCoupons);
    } catch (err) {
      setError('Failed to load coupons from local storage.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to initialize content locker links from localStorage
  const initializeLinks = useCallback(() => {
    try {
      setLoading(true);
      const storedLinks = localStorage.getItem('contentLockerLinks');
      const initialLinks = storedLinks ? JSON.parse(storedLinks) : [];
      setLinks(initialLinks);
    } catch (err) {
      setError('Failed to load content locker links from local storage.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeCoupons();
    initializeLinks();
  }, [initializeCoupons, initializeLinks]);

  const refreshCoupons = useCallback(() => {
    initializeCoupons();
  }, [initializeCoupons]);
  
  const activeCoupons = useMemo(() => {
    return coupons.filter(coupon => coupon.status === 'active');
  }, [coupons]);
  
  const featuredCoupons = useMemo(() => {
    return coupons.filter(coupon => coupon.featured === true);
  }, [coupons]);

  // Get a specific coupon by its ID
  const getCouponById = useCallback((id: string): Coupon | null => {
    const coupon = coupons.find(c => c.id === id);
    return coupon || null;
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('coupons', JSON.stringify(coupons));
  }, [coupons]);
  
  useEffect(() => {
    localStorage.setItem('contentLockerLinks', JSON.stringify(links));
  }, [links]);

  const addCoupon = async (coupon: Omit<Coupon, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      
      const newCoupon: Coupon = {
        ...coupon,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Use the explicitly provided values without adding random defaults
        rating: coupon.rating !== undefined ? coupon.rating : 4.5,
        usedCount: coupon.usedCount !== undefined ? coupon.usedCount : 0
      };
      
      // Update our "database"
      const updatedCoupons = [...coupons, newCoupon];
      setCoupons(updatedCoupons);
      
      // Save to localStorage
      localStorage.setItem('coupons', JSON.stringify(updatedCoupons));
      
      toast({
        title: "Success",
        description: "Coupon added successfully.",
      });
      
      return newCoupon;
    } catch (error) {
      console.error('Error adding coupon:', error);
      toast({
        title: "Error",
        description: "Failed to add coupon. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateCoupon = async (id: string, updates: Omit<Coupon, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      const updatedCoupons = coupons.map(coupon =>
        coupon.id === id ? { ...coupon, ...updates, updatedAt: new Date().toISOString() } : coupon
      );
      setCoupons(updatedCoupons);
      localStorage.setItem('coupons', JSON.stringify(updatedCoupons));
      toast({
        title: "Success",
        description: "Coupon updated successfully.",
      });
      return true;
    } catch (error) {
      console.error('Error updating coupon:', error);
      toast({
        title: "Error",
        description: "Failed to update coupon. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteCoupon = async (id: string) => {
    try {
      setLoading(true);
      const updatedCoupons = coupons.filter(coupon => coupon.id !== id);
      setCoupons(updatedCoupons);
      localStorage.setItem('coupons', JSON.stringify(updatedCoupons));
      toast({
        title: "Success",
        description: "Coupon deleted successfully.",
      });
      return true;
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast({
        title: "Error",
        description: "Failed to delete coupon. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const bulkUpdateCoupons = async (ids: string[], updates: Partial<Coupon>) => {
    try {
      setLoading(true);
      const updatedCoupons = coupons.map(coupon =>
        ids.includes(coupon.id) ? { ...coupon, ...updates, updatedAt: new Date().toISOString() } : coupon
      );
      setCoupons(updatedCoupons);
      localStorage.setItem('coupons', JSON.stringify(updatedCoupons));
      toast({
        title: "Success",
        description: "Coupons updated successfully.",
      });
      return true;
    } catch (error) {
      console.error('Error updating coupons:', error);
      toast({
        title: "Error",
        description: "Failed to update coupons. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const bulkDeleteCoupons = async (ids: string[]) => {
    try {
      setLoading(true);
      const updatedCoupons = coupons.filter(coupon => !ids.includes(coupon.id));
      setCoupons(updatedCoupons);
      localStorage.setItem('coupons', JSON.stringify(updatedCoupons));
      toast({
        title: "Success",
        description: "Coupons deleted successfully.",
      });
      return true;
    } catch (error) {
      console.error('Error deleting coupons:', error);
      toast({
        title: "Error",
        description: "Failed to delete coupons. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const addLink = async (link: Omit<ContentLockerLink, 'id' | 'createdAt'>) => {
    try {
      setLoading(true);
      const newLink: ContentLockerLink = {
        ...link,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      const updatedLinks = [...links, newLink];
      setLinks(updatedLinks);
      localStorage.setItem('contentLockerLinks', JSON.stringify(updatedLinks));
      toast({
        title: "Success",
        description: "Content locker link added successfully.",
      });
      return newLink;
    } catch (error) {
      console.error('Error adding content locker link:', error);
      toast({
        title: "Error",
        description: "Failed to add content locker link. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateLink = async (id: string, updates: Partial<ContentLockerLink>) => {
    try {
      setLoading(true);
      const linkToUpdate = links.find(link => link.id === id);
      
      if (!linkToUpdate) {
        throw new Error('Link not found');
      }
      
      const updatedLink = { ...linkToUpdate, ...updates };
      const updatedLinks = links.map(link =>
        link.id === id ? updatedLink : link
      );
      
      setLinks(updatedLinks);
      localStorage.setItem('contentLockerLinks', JSON.stringify(updatedLinks));
      
      toast({
        title: "Success",
        description: "Content locker link updated successfully.",
      });
      
      return updatedLink;
    } catch (error) {
      console.error('Error updating content locker link:', error);
      toast({
        title: "Error",
        description: "Failed to update content locker link. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteLink = async (id: string) => {
    try {
      setLoading(true);
      const updatedLinks = links.filter(link => link.id !== id);
      setLinks(updatedLinks);
      localStorage.setItem('contentLockerLinks', JSON.stringify(updatedLinks));
      toast({
        title: "Success",
        description: "Content locker link deleted successfully.",
      });
      return true;
    } catch (error) {
      console.error('Error deleting content locker link:', error);
      toast({
        title: "Error",
        description: "Failed to delete content locker link. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    coupons,
    links,
    activeCoupons,
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
    bulkUpdateCoupons,
    bulkDeleteCoupons,
    refreshCoupons,
    getCouponById,
    addLink,
    updateLink,
    deleteLink
  };
};
