
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coupon } from '@/types';
import { Tag, Calendar, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CouponCardProps {
  coupon: Coupon;
  className?: string;
}

export const CouponCard = ({ coupon, className = '' }: CouponCardProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
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

  const handleGetCoupon = () => {
    navigate(`/coupon/${coupon.id}`);
  };

  // Default image if none is provided
  const imageUrl = coupon.image || 'https://via.placeholder.com/300x150?text=No+Image';

  return (
    <Card className={`glass-card hover-lift overflow-hidden ${className} bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900`}>
      <div className="absolute top-0 right-0">
        {coupon.featured && (
          <Badge variant="default" className="m-2 bg-gradient-to-r from-pink-500 to-purple-500">
            Featured
          </Badge>
        )}
      </div>
      
      {/* Coupon Image */}
      <div className="w-full h-32 overflow-hidden bg-gray-100">
        <img 
          src={imageUrl} 
          alt={`${coupon.store} coupon`} 
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x150?text=Error+Loading+Image';
          }}
        />
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
            className={`font-semibold text-xs ${!isExpired && "bg-green-100 text-green-800 border-green-200"}`}
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
      </CardContent>
      
      <CardFooter className="pt-2">
        <Button
          variant="default"
          size="sm"
          className="w-full button-press bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
          onClick={handleGetCoupon}
          disabled={isExpired}
        >
          <ExternalLink size={16} className="mr-1" /> Get Coupon
        </Button>
      </CardFooter>
    </Card>
  );
};
