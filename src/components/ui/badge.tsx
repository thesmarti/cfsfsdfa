
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { useSiteSettings } from "@/hooks/useSiteSettings";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        gradient: "border-transparent text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  const { settings } = useSiteSettings();
  
  // Apply gradient styling if variant is gradient and uiGradient is available
  const useGradient = variant === 'gradient' && settings.colors.uiGradient;
  
  return (
    <div className={cn(
      badgeVariants({ variant }), 
      useGradient ? settings.colors.uiGradient : undefined,
      className
    )} {...props} />
  )
}

export { Badge, badgeVariants }
