
import { useState, useEffect } from 'react';
import { Coupon, ContentLockerLink } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Store, Tag, Check } from 'lucide-react';

interface LoadingOverlayProps {
  coupon: Coupon;
  onComplete: () => void;
  loadingTime?: number;
  contentLockerLink?: ContentLockerLink;
}

export const LoadingOverlay = ({ coupon, onComplete, loadingTime = 3000, contentLockerLink }: LoadingOverlayProps) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isCodeVisible, setIsCodeVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (loadingTime / 100));
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 100);

    const timeout = setTimeout(() => {
      setIsComplete(true);
      setIsCodeVisible(true);
      
      // Wait a moment before redirecting to show the complete state
      setTimeout(() => {
        onComplete();
      }, 1500);
    }, loadingTime);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [loadingTime, onComplete]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto glass-card bg-white dark:bg-gray-800 overflow-hidden animate-scale-in">
        <CardHeader className="pb-2 text-center">
          <div className="mx-auto mb-2 flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
            <Store size={24} />
          </div>
          <CardTitle className="text-xl font-display">
            {coupon.store}
          </CardTitle>
          <CardDescription className="flex items-center gap-1 text-xs justify-center">
            <Tag size={12} />
            {coupon.category}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pb-2 text-center">
          <div className="text-base font-medium mb-6">
            {coupon.description}
          </div>

          {/* Donut Loading Animation */}
          <div className="relative mx-auto mb-6 w-24 h-24">
            <svg className="w-24 h-24" viewBox="0 0 100 100">
              <circle 
                className="text-gray-200 stroke-current" 
                strokeWidth="10" 
                cx="50" 
                cy="50" 
                r="40" 
                fill="transparent"
              />
              <circle 
                className="text-primary stroke-current transition-all duration-300" 
                strokeWidth="10" 
                strokeLinecap="round" 
                cx="50" 
                cy="50" 
                r="40" 
                fill="transparent"
                strokeDasharray={`${2.5 * Math.PI * 40}`}
                strokeDashoffset={`${2.5 * Math.PI * 40 * (1 - progress / 100)}`}
                transform="rotate(-90 50 50)"
              />
              <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" className="text-lg font-bold fill-primary">
                {isComplete ? <tspan x="50" y="50">100%</tspan> : <tspan x="50" y="50">{Math.round(progress)}%</tspan>}
              </text>
            </svg>
            
            {isComplete && (
              <div className="absolute inset-0 flex items-center justify-center animate-scale-in">
                <div className="bg-green-500 text-white rounded-full p-2">
                  <Check size={32} strokeWidth={3} />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold">Your coupon code:</p>
            <div className={`bg-secondary border border-border px-4 py-3 rounded-md font-mono text-center ${isCodeVisible ? 'transition-all duration-500 blur-md' : 'blur-md'}`}>
              <p className="text-sm">The coupon will unlock when you complete the tasks on the website</p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-4 text-center text-sm text-muted-foreground">
          {isComplete ? (
            <p className="w-full">Redirecting you to the store...</p>
          ) : (
            <p className="w-full">Please wait while we redirect you...</p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};
