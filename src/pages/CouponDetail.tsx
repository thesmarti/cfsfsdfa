
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Calendar, Tag, ArrowLeft, Lock } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useCoupons } from '@/hooks/useCoupons';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { Skeleton } from "@/components/ui/skeleton";

const CouponDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getCouponById, links } = useCoupons();
  const { settings } = useSiteSettings();
  
  const [loading, setLoading] = useState(true);
  const [coupon, setCoupon] = useState<any>(null);
  const [showLoading, setShowLoading] = useState(false);
  
  useEffect(() => {
    if (id) {
      const couponData = getCouponById(id);
      
      // Simulate loading
      setTimeout(() => {
        setCoupon(couponData);
        setLoading(false);
      }, 500);
    }
  }, [id, getCouponById]);
  
  if (!id || (!loading && !coupon)) {
    navigate('/not-found');
    return null;
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const handleShowRestriction = () => {
    toast({
      title: "Coupon Locked",
      description: "This coupon is locked. You need to complete tasks on the website to unlock it.",
    });
  };
  
  const handleGetCoupon = () => {
    setShowLoading(true);
  };
  
  const handleLoadingComplete = () => {
    // If we have a redirect URL, go there, otherwise just hide the overlay
    if (coupon.redirectUrl) {
      window.location.href = coupon.redirectUrl;
    } else {
      setShowLoading(false);
    }
  };
  
  const isExpired = coupon && new Date(coupon.expiryDate) < new Date();
  
  // Find the associated content locker link if any
  const contentLockerLink = coupon?.contentLockerLinkId 
    ? links.find(link => link.id === coupon.contentLockerLinkId)
    : null;

  const gradientClass = settings.colors.uiGradient || 'bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500';
  
  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-28">
        <Button 
          variant="ghost" 
          size="sm"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} className="mr-1" /> Back
        </Button>
        
        {loading ? (
          <div className="max-w-3xl mx-auto">
            <Skeleton className="h-12 w-1/3 mb-4" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-8 animate-fade-in">
              {coupon.store} Coupon
            </h1>
            
            <Card className="glass-card animate-scale-in mb-10 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div>
                    <CardTitle className="text-2xl font-display mb-1">
                      {coupon.store}
                    </CardTitle>
                    <div className="flex gap-3 mt-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Tag size={12} />
                        {coupon.category}
                      </Badge>
                      <Badge 
                        variant={isExpired ? "destructive" : "outline"} 
                        className={!isExpired ? "bg-green-100 text-green-800 border-green-200" : ""}
                      >
                        {isExpired ? 'Expired' : 'Active'}
                      </Badge>
                      {coupon.featured && (
                        <Badge variant="gradient" className={gradientClass}>
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar size={14} className="text-muted-foreground" />
                    <span className="text-muted-foreground">Expires:</span> 
                    <span className="font-medium">{formatDate(coupon.expiryDate)}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="py-6">
                <div className="text-xl mb-8">
                  {coupon.description}
                </div>
                
                <div className="bg-secondary border border-border px-6 py-4 rounded-md font-mono text-center text-lg relative overflow-hidden blur-md">
                  <Lock className="inline-block mr-2" size={16} />
                  <span>Coupon is locked</span>
                </div>
                
                <div className="text-xs text-muted-foreground mt-3 text-center">
                  Complete tasks on the website to unlock this coupon
                </div>
              </CardContent>
              
              <CardFooter className="flex gap-4 flex-wrap">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 button-press"
                  onClick={handleShowRestriction}
                  disabled={isExpired}
                >
                  <Lock size={18} className="mr-2" />
                  Locked Coupon
                </Button>
                
                <Button
                  variant="gradient"
                  size="lg"
                  className={`flex-1 button-press ${gradientClass}`}
                  onClick={handleGetCoupon}
                  disabled={isExpired}
                >
                  <ExternalLink size={18} className="mr-2" /> Go to Website
                </Button>
              </CardFooter>
            </Card>
            
            <div className="mt-12 text-center">
              <h2 className="text-xl font-display font-semibold mb-4">
                How to use this coupon?
              </h2>
              <ol className="text-left max-w-xl mx-auto space-y-4 text-muted-foreground">
                <li className="flex gap-2">
                  <span className={`rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-white ${gradientClass}`}>1</span>
                  <span>Click on <strong>"Go to Website"</strong> button to go to the store website.</span>
                </li>
                <li className="flex gap-2">
                  <span className={`rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-white ${gradientClass}`}>2</span>
                  <span>Complete the required tasks on the website.</span>
                </li>
                <li className="flex gap-2">
                  <span className={`rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-white ${gradientClass}`}>3</span>
                  <span>Once completed, the coupon code will be unlocked for you to use at checkout.</span>
                </li>
              </ol>
            </div>
            
            <footer className="mt-16 text-center text-sm text-muted-foreground">
              {settings.general.footerText}
            </footer>
          </div>
        )}
      </main>
      
      {showLoading && coupon && (
        <LoadingOverlay 
          coupon={coupon} 
          onComplete={handleLoadingComplete}
          contentLockerLink={contentLockerLink}
        />
      )}
    </div>
  );
};

export default CouponDetail;
