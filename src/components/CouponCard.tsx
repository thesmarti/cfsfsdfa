
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coupon } from '@/types';
import { Check, Copy, ExternalLink, Tag, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CouponCardProps {
  coupon: Coupon;
  className?: string;
}

export const CouponCard = ({ coupon, className = '' }: CouponCardProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    toast({
      title: "Code Copied!",
      description: "Coupon code copied to clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Determine if coupon is expired
  const isExpired = new Date(coupon.expiryDate) < new Date();
  const daysLeft = Math.ceil((new Date(coupon.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card className={`glass-card hover-lift overflow-hidden ${className}`}>
      <div className="absolute top-0 right-0">
        {coupon.featured && (
          <Badge variant="default" className="m-2 bg-primary">
            Featured
          </Badge>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-display mb-1 line-clamp-1">
              {coupon.store}
            </CardTitle>
            <CardDescription className="flex items-center gap-1 text-xs">
              <Tag size={12} />
              {coupon.category}
            </CardDescription>
          </div>
          <Badge 
            variant={isExpired ? "destructive" : "outline"} 
            className="font-semibold text-xs"
          >
            {isExpired ? 'Expired' : daysLeft <= 7 ? `${daysLeft} days left` : 'Active'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="mb-4">
          <div className="text-base font-medium line-clamp-2 h-12">
            {coupon.description}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
            <Calendar size={12} />
            Expires: {formatDate(coupon.expiryDate)}
          </div>
        </div>
        
        <div className="flex justify-center my-2">
          <div className="bg-secondary border border-border px-4 py-2 rounded-md font-mono text-center relative overflow-hidden">
            {coupon.code}
            {copied && (
              <div className="absolute inset-0 bg-primary text-primary-foreground flex items-center justify-center animate-fade-in">
                <Check size={16} className="mr-1" /> Copied!
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2 pt-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 button-press"
          onClick={handleCopyCode}
          disabled={copied || isExpired}
        >
          {copied ? <Check size={16} className="mr-1" /> : <Copy size={16} className="mr-1" />}
          {copied ? "Copied!" : "Copy Code"}
        </Button>
        
        <Link to={`/coupon/${coupon.id}`} className="flex-1">
          <Button
            variant="default"
            size="sm"
            className="w-full button-press"
          >
            <ExternalLink size={16} className="mr-1" /> Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
