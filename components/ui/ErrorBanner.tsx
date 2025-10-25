// components/ui/ErrorBanner.tsx
// Bannière d'erreur avec shadcn Alert

import React from 'react';
import { Alert, AlertDescription, AlertTitle } from './alert';
import { AlertCircle, X } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface ErrorBannerProps {
  title?: string;
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export function ErrorBanner({ title, message, onDismiss, className }: ErrorBannerProps) {
  return (
    <Alert variant="destructive" className={cn('relative', className)} role="alert" aria-live="polite">
      <AlertCircle className="h-4 w-4" aria-hidden="true" />
      {(title || onDismiss) && (
        <div className="flex items-start justify-between">
          {title && <AlertTitle>{title}</AlertTitle>}
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="h-auto p-1 ml-2"
              aria-label="Fermer l'erreur"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

// Variante pour erreurs inline
export function ErrorInline({ message, className }: { message: string; className?: string }) {
  return (
    <div className={cn('flex items-center space-x-2 text-sm text-destructive', className)} role="alert">
      <AlertCircle className="h-4 w-4" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
