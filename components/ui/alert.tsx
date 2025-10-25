import React from 'react';
import { cn } from '@/lib/utils';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'destructive' | 'warning';
}

export function Alert({ 
  className, 
  variant = 'default',
  ...props 
}: AlertProps) {
  const variants = {
    default: "bg-background text-foreground border-border",
    success: "bg-green-50 text-green-800 border-green-200",
    destructive: "bg-red-50 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-200 dark:border-red-800",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
  };

  return (
    <div
      className={cn(
        "relative w-full rounded-lg border p-4 [&>svg]:text-foreground",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function AlertTitle({ 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h5
      className={cn("mb-1 font-medium leading-none tracking-tight", className)}
      {...props}
    />
  );
}

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