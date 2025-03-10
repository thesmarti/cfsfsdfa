
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { Navbar } from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCoupons } from '@/hooks/useCoupons';
import { Coupon } from '@/types';
import { Check, Copy, ArrowLeft, Calendar, Tag, Clock, ExternalLink, ShoppingBag } from 'lucide-react';

const CouponDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getCouponById } = useCoupons();
  const { toast } = useToast();
  
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    if (id) {
      // In a real app, we'd make an API call here
      setLoading(true);
      // Simulate API delay
      setTimeout(() => {
        const result = getCouponById(id);
        setCoupon(result);
        setLoading(false);
      }, 500);
    }
  }, [id, getCouponById]);
  
  const handleCopyCode = () => {
    if (coupon) {
      navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      toast({
        title: "Code Copied!",
        description: "Coupon code copied to clipboard",
      });
      
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Determine if coupon is expired
  const isExpired = coupon && new Date(coupon.expiryDate) < new Date();
  
  // Time remaining calculation
  const getTimeRemaining = () => {
    if (!coupon) return '';
    
    const now = new Date();
    const expiry = new Date(coupon.expiryDate);
    const diffTime = expiry.getTime() - now.getTime();
    
    if (diffTime <= 0) return 'Expired';
    
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 30) {
      const diffMonths = Math.floor(diffDays / 30);
      return `${diffMonths} month${diffMonths > 1 ? 's' : ''} left`;
    }
    
    return `${diffDays} day${diffDays > 1 ? 's' : ''} left`;
  };
  
  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-28 pb-10">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link to="/">
            <Button variant="ghost" className="mb-6 gap-2">
              <ArrowLeft size={16} /> Back to Coupons
            </Button>
          </Link>
          
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-48 w-full mt-6" />
            </div>
          ) : coupon ? (
            <div className="animate-fade-in">
              <div className="mb-8">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-display font-bold mb-2">
                      {coupon.store} - {coupon.discount}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>Expires: {formatDate(coupon.expiryDate)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Tag size={14} />
                        <span>{coupon.category}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>Last Verified: {coupon.lastVerified ? formatDate(coupon.lastVerified) : 'Unknown'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Badge 
                    variant={isExpired ? "destructive" : "outline"}
                    className="font-semibold px-3 py-1 text-sm"
                  >
                    {isExpired ? 'Expired' : getTimeRemaining()}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <Card className="glass-card">
                    <CardContent className="p-6">
                      <h2 className="text-xl font-display font-semibold mb-4">
                        Description
                      </h2>
                      <p className="text-lg mb-6">
                        {coupon.description}
                      </p>
                      
                      <h3 className="text-lg font-medium mb-3">How to use this coupon:</h3>
                      <ol className="list-decimal list-inside space-y-2 mb-6">
                        <li>Copy the coupon code below</li>
                        <li>Visit the {coupon.store} website</li>
                        <li>Add products to your cart</li>
                        <li>Paste the coupon code at checkout</li>
                        <li>Enjoy your savings!</li>
                      </ol>
                      
                      <div className="bg-secondary/50 rounded-lg p-4 border border-border">
                        <p className="text-sm text-muted-foreground mb-2">
                          Terms & Conditions:
                        </p>
                        <p className="text-sm">
                          This coupon may not be combined with other offers. Valid for specified products only. 
                          Discount applies to qualifying items only. Shipping restrictions may apply.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <Card className="glass-card sticky top-24">
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <h3 className="text-lg font-semibold mb-2">Coupon Code</h3>
                        <div className="bg-secondary border-2 border-dashed border-primary/30 rounded-md p-3 font-mono text-lg mb-4 relative overflow-hidden">
                          {coupon.code}
                          {copied && (
                            <div className="absolute inset-0 bg-primary text-primary-foreground flex items-center justify-center animate-fade-in">
                              <Check size={18} className="mr-1" /> Copied!
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-3">
                          <Button
                            className="w-full gap-2 button-press"
                            onClick={handleCopyCode}
                            disabled={copied || isExpired}
                          >
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                            {copied ? "Copied!" : "Copy Code"}
                          </Button>
                          
                          <Button
                            variant="outline"
                            className="w-full gap-2 button-press"
                            onClick={() => window.open(`https://${coupon.store.toLowerCase().replace(' ', '')}.com`, '_blank')}
                          >
                            <ShoppingBag size={16} />
                            Shop at {coupon.store}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="border-t border-border pt-4">
                        <p className="text-center text-sm text-muted-foreground mb-2">
                          Share this coupon:
                        </p>
                        <div className="flex justify-center gap-2">
                          <Button variant="outline" size="icon" className="rounded-full button-press" onClick={() => {
                            window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank');
                          }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                          </Button>
                          <Button variant="outline" size="icon" className="rounded-full button-press" onClick={() => {
                            window.open(`https://twitter.com/intent/tweet?text=Check out this ${coupon.store} coupon: ${coupon.discount}&url=${window.location.href}`, '_blank');
                          }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                          </Button>
                          <Button variant="outline" size="icon" className="rounded-full button-press" onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            toast({
                              title: "Link Copied!",
                              description: "Coupon link copied to clipboard",
                            });
                          }}>
                            <ExternalLink size={16} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-display font-bold mb-4">
                Coupon Not Found
              </h2>
              <p className="text-muted-foreground mb-6">
                The coupon you are looking for may have been removed or expired.
              </p>
              <Link to="/">
                <Button>Return to Homepage</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CouponDetail;
