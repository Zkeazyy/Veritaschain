import React from 'react';
import { cn } from '@/lib/utils';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'error' | 'warning';
}

export function Alert({ 
  className, 
  variant = 'default',
  ...props 
}: AlertProps) {
  const variants = {
    default: "bg-background text-foreground",
    success: "bg-green-50 text-green-800 border-green-200",
    error: "bg-red-50 text-red-800 border-red-200",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
  };

  return (
    <div
      className={cn(
        "relative w-full rounded-lg border p-4",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function AlertDescription({ 
  className, 
  ...props 
}: AlertDescriptionProps) {
  return (
    <p
      className={cn("text-sm", className)}
      {...props}
    />
  );
}