import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 font-sans font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-cream-dark text-charcoal border border-border",
        saffron: "bg-saffron/15 text-saffron-dark border border-saffron/30",
        forest: "bg-forest/10 text-forest-dark border border-forest/20",
        gold: "bg-gold/15 text-brown border border-gold/30",
        brown: "bg-brown/10 text-brown-dark border border-brown/20",
        success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        warning: "bg-amber-50 text-amber-700 border border-amber-200",
        danger: "bg-red-50 text-red-600 border border-red-200",
        outline: "bg-transparent border border-border text-charcoal",
      },
      size: {
        sm: "text-xs px-2 py-0.5 rounded-md",
        md: "text-xs px-2.5 py-1 rounded-lg",
        lg: "text-sm px-3 py-1 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}
