import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
const variants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50',
  { variants: {
      variant: { default: 'bg-primary text-primary-foreground hover:bg-primary/90',
                 outline: 'border border-border bg-background hover:bg-muted',
                 ghost: 'hover:bg-muted' },
      size: { default: 'h-10 px-4', sm: 'h-9 px-3 text-xs', lg: 'h-12 px-6 text-base', icon: 'h-10 w-10' } },
    defaultVariants: { variant: 'default', size: 'default' } });
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof variants> { asChild?: boolean }
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild, ...p }, ref) => {
  const C = asChild ? Slot : 'button';
  return <C ref={ref} className={cn(variants({ variant, size }), className)} {...p} />;
});
