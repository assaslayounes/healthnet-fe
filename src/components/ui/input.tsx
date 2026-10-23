import * as React from 'react';
import { cn } from '@/lib/utils';
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...p }, ref) => (
  <input ref={ref} className={cn('h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20', className)} {...p} />
));
export function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (<label className="block space-y-1.5"><span className="text-sm font-semibold">{label}</span>{children}{error && <span className="block text-xs text-red-600">{error}</span>}</label>);
}
