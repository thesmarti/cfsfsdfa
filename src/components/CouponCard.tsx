
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
  
  // Get gradient based on category
  const getGradient = () => {
    const category = coupon.category.toLowerCase();
    
    if (category.includes('fashion')) {
      return 'bg-gradient-to-br from-pink-500 to-purple-600 dark:from-pink-600 dark:to-purple-800';
    } else if (category.includes('food')) {
      return 'bg-gradient-to-br from-orange-400 to-red-500 dark:from-orange-500 dark:to-red-700';
    } else if (category.includes('electronics')) {
      return 'bg-gradient-to-br from-blue-400 to-indigo-600 dark:from-blue-500 dark:to-indigo-800';
    } else if (category.includes('travel')) {
      return 'bg-gradient-to-br from-teal-400 to-emerald-500 dark:from-teal-500 dark:to-emerald-700';
    } else if (category.includes('beauty')) {
      return 'bg-gradient-to-br from-fuchsia-400 to-pink-500 dark:from-fuchsia-500 dark:to-pink-700';
    } else if (category.includes('home')) {
      return 'bg-gradient-to-br from-amber-400 to-yellow-500 dark:from-amber-500 dark:to-yellow-700';
    } else {
      return 'bg-gradient-to-br from-violet-500 to-purple-600 dark:from-violet-600 dark:to-purple-800';
    }
  };

  return (
    <Card className={`hover-lift overflow-hidden ${className} ${isExpired ? 'opacity-75' : ''}`}>
      {/* Category indicator strip */}
      <div className={`h-1 w-full ${getGradient()}`}></div>
      
      {/* Coupon Image */}
      <div className="w-full h-36 overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
        <img 
          src={imageUrl} 
          alt={`${coupon.store} coupon`} 
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x150?text=Error+Loading+Image';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-60"></div>
      </div>
      
      <CardHeader className="pb-2 relative z-10">
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
            className={`font-semibold text-xs ${!isExpired && "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"}`}
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
          className={`w-full button-press ${
            isExpired 
              ? 'bg-gray-300 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-700' 
              : `${getGradient()} hover:shadow-lg border-none`
          }`}
          onClick={handleGetCoupon}
          disabled={isExpired}
        >
          <ExternalLink size={16} className="mr-1" /> Get Coupon
        </Button>
      </CardFooter>
    </Card>
  );
};
