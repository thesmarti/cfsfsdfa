import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/CustomNavbar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Calendar, Tag, ArrowLeft, Lock, Star, StarHalf, StarOff, Users } from 'lucide-react';
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
    if (coupon.redirectUrl) {
      window.location.href = coupon.redirectUrl;
    } else {
      setShowLoading(false);
    }
  };
  
  const isExpired = coupon && new Date(coupon.expiryDate) < new Date();
  
  const contentLockerLink = coupon?.contentLockerLinkId 
    ? links.find(link => link.id === coupon.contentLockerLinkId)
    : null;

  const gradientClass = settings.colors.uiGradient || 'bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500';
  
  const couponCode = coupon?.code || "SAVE25NOW";
  const codeLength = couponCode.length;
  const halfLength = Math.ceil(codeLength / 2);
  const visiblePart = couponCode.substring(0, halfLength);
  const blurredPart = couponCode.substring(halfLength);
  
  // Default rating and used count if not provided
  const rating = coupon?.rating || Math.floor(Math.random() * 2) + 3; // Random between 3-5 if not set
  const usedCount = coupon?.usedCount || Math.floor(Math.random() * 900) + 100; // Random between 100-999 if not set
  
  // Generate star rating UI
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} size={16} className="fill-yellow-400 text-yellow-400" />);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" size={16} className="fill-yellow-400 text-yellow-400" />);
    }
    
    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StarOff key={`empty-${i}`} size={16} className="text-gray-300" />);
    }
    
    return stars;
  };
  
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
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    {renderStars(rating)}
                    <span className="ml-2 text-sm">({rating.toFixed(1)})</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users size={16} className="mr-1" /> 
                    <span className="font-semibold text-primary">{usedCount}</span> Users used this coupon
                  </div>
                </div>
                
                <div className="text-xl mb-8">
                  {coupon.description}
                </div>
                
                <div className="bg-secondary border border-border px-6 py-4 rounded-md font-mono text-center text-lg relative overflow-hidden flex justify-center">
                  <span className="inline-block">{visiblePart}</span>
                  <span className="inline-block blur-md">{blurredPart}</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/10 dark:bg-white/10 backdrop-blur-sm p-2 rounded">
                      <Lock className="inline-block" size={16} />
                      <span className="ml-1 text-sm font-medium">Complete tasks to reveal full code</span>
                    </div>
                  </div>
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
                  <ExternalLink size={18} className="mr-2" /> Unlock Coupon
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
                  <span>Click on <strong>"Unlock Coupon"</strong> button.</span>
                </li>
                <li className="flex gap-2">
                  <span className={`rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-white ${gradientClass}`}>2</span>
                  <span>Complete the required tasks on the website.</span>
                </li>
                <li className="flex gap-2">
                  <span className={`rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-white ${gradientClass}`}>3</span>
                  <span>Once completed, the coupon code will be unlocked for you to use at <strong>{coupon.store}</strong>.</span>
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
