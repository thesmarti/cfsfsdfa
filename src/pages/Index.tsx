
import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { CouponCard } from '@/components/CouponCard';
import { FeaturedCoupons } from '@/components/FeaturedCoupons';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SortOption, FilterOption } from '@/types';
import { useCoupons } from '@/hooks/useCoupons';
import { ChevronDown, Search, Filter } from 'lucide-react';

const Index = () => {
  const { 
    coupons, 
    featuredCoupons,
    loading, 
    error, 
    sortBy, 
    filterBy, 
    setSortBy, 
    setFilterBy 
  } = useCoupons();

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCoupons, setFilteredCoupons] = useState(coupons);
  const [activeTab, setActiveTab] = useState("all");

  // Apply search filter on coupons
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCoupons(coupons);
    } else {
      const lowercaseSearch = searchTerm.toLowerCase();
      setFilteredCoupons(
        coupons.filter(
          coupon =>
            coupon.store.toLowerCase().includes(lowercaseSearch) ||
            coupon.description.toLowerCase().includes(lowercaseSearch) ||
            coupon.code.toLowerCase().includes(lowercaseSearch)
        )
      );
    }
  }, [searchTerm, coupons]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setFilterBy(value as FilterOption);
  };

  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-28">
        {/* Hero Section */}
        <section className="text-center mb-12 max-w-4xl mx-auto">
          <div className="animate-slide-down">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
              Save Money with Premium Coupon Codes
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Browse our curated collection of verified discount codes and offers from your favorite brands.
            </p>
          </div>
          
          <div className="relative max-w-2xl mx-auto animate-slide-up">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              type="search"
              placeholder="Search for stores, brands, or coupon codes..."
              className="pl-12 h-12 rounded-full shadow-soft"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </section>
        
        {/* Featured Coupons Slider */}
        {featuredCoupons.length > 0 && (
          <section className="mb-12 animate-fade-in">
            <FeaturedCoupons coupons={featuredCoupons} />
          </section>
        )}
        
        {/* Main Coupons Content */}
        <section className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
            <h2 className="text-2xl font-display font-semibold">
              All Coupons
            </h2>
            
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center">
                <Filter size={16} className="mr-2 text-muted-foreground" />
                <span className="mr-2 text-sm font-medium">Sort:</span>
                <Select
                  value={sortBy}
                  onValueChange={(value) => setSortBy(value as SortOption)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="popular">Popular</SelectItem>
                    <SelectItem value="expiringSoon">Expiring Soon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 mb-8">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="expiringSoon">Expiring Soon</TabsTrigger>
              <TabsTrigger value="Electronics">Electronics</TabsTrigger>
              <TabsTrigger value="Fashion">Fashion</TabsTrigger>
              <TabsTrigger value="Food">Food</TabsTrigger>
              <TabsTrigger value="Retail">Retail</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-0">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="h-80 rounded-xl bg-gray-100 animate-pulse"></div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-lg text-red-500 mb-4">{error}</p>
                  <Button>Try Again</Button>
                </div>
              ) : filteredCoupons.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground mb-4">
                    {searchTerm ? "No coupons found matching your search." : "No coupons available in this category."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCoupons.map(coupon => (
                    <CouponCard key={coupon.id} coupon={coupon} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          {filteredCoupons.length > 9 && (
            <div className="flex justify-center mt-12">
              <Button variant="outline" size="lg" className="gap-2">
                Load More <ChevronDown size={16} />
              </Button>
            </div>
          )}
        </section>
      </main>
      
      <footer className="mt-24 py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} LOLCoupons. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
