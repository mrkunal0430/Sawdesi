"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { forwardRef, cloneElement, isValidElement } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-sans font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-forest text-cream hover:bg-forest-dark active:scale-[0.98] shadow-sm hover:shadow-md",
        secondary:
          "bg-saffron text-white hover:bg-saffron-dark active:scale-[0.98] shadow-sm hover:shadow-md",
        ghost:
          "bg-transparent text-charcoal hover:bg-cream-dark border border-border active:scale-[0.98]",
        outline:
          "bg-transparent border-2 border-forest text-forest hover:bg-forest hover:text-cream active:scale-[0.98]",
        "outline-saffron":
          "bg-transparent border-2 border-saffron text-saffron hover:bg-saffron hover:text-white active:scale-[0.98]",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]",
        link: "text-forest underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        sm: "h-8 px-4 text-sm rounded-lg",
        md: "h-11 px-6 text-sm rounded-xl",
        lg: "h-13 px-8 text-base rounded-xl",
        xl: "h-14 px-10 text-base rounded-2xl",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, asChild, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size }), className);

    if (asChild && isValidElement(children)) {
      return cloneElement(children as React.ReactElement<React.HTMLAttributes<HTMLElement>>, {
        className: cn(classes, (children as React.ReactElement<{ className?: string }>).props.className),
        ...props,
      });
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { buttonVariants };
