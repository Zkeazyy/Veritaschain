// components/vts/VtsBadge.tsx
// Badge compact affichant l'état VTS de l'utilisateur

'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useVtsBalance } from '@/hooks/useVtsBalance';
import { useVtsDiscount } from '@/hooks/useVtsDiscount';
import { VTS_CONFIG } from '@/lib/token/config';
import { Loader2, Coins } from 'lucide-react';

interface VtsBadgeProps {
  className?: string;
  showIcon?: boolean;
}

export function VtsBadge({ className, showIcon = true }: VtsBadgeProps) {
  const { enabled, loading, balanceFormatted, symbol, error } = useVtsBalance();
  const discount = useVtsDiscount(balanceFormatted);
  
  // Module désactivé - ne rien afficher
  if (!enabled) {
    return null;
  }
  
  // Erreur - afficher un badge d'erreur discret
  if (error) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="secondary" className={className}>
              {showIcon && <Coins className="w-3 h-3 mr-1" />}
              VTS : Erreur
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Impossible de charger le solde VTS</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  // Chargement
  if (loading) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="secondary" className={className}>
              {showIcon && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
              VTS : Chargement...
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>{VTS_CONFIG.messages.loading}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  // État normal - afficher selon l'éligibilité
  const badgeVariant = discount.eligible ? 'default' : 'secondary';
  const badgeText = discount.eligible 
    ? `VTS actif : -${discount.discountPercent}%`
    : `VTS : ${parseFloat(balanceFormatted).toFixed(0)}/${discount.threshold}`;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant={badgeVariant} className={className}>
            {showIcon && <Coins className="w-3 h-3 mr-1" />}
            {badgeText}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-medium">Solde VTS : {balanceFormatted} {symbol}</p>
            <p className="text-sm text-muted-foreground">
              {discount.eligible 
                ? `Vous bénéficiez de -${discount.discountPercent}% sur l'abonnement`
                : `Détenez ${discount.threshold} VTS pour activer -${discount.discountPercent}%`
              }
            </p>
            {discount.needsMore > 0 && (
              <p className="text-xs text-muted-foreground">
                Il vous manque {discount.needsMore.toFixed(0)} VTS
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Composant simplifié sans tooltip pour les espaces restreints
export function VtsBadgeSimple({ className, showIcon = true }: VtsBadgeProps) {
  const { enabled, loading, balanceFormatted, symbol } = useVtsBalance();
  const discount = useVtsDiscount(balanceFormatted);
  
  if (!enabled) return null;
  
  if (loading) {
    return (
      <Badge variant="secondary" className={className}>
        {showIcon && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
        VTS...
      </Badge>
    );
  }
  
  const badgeVariant = discount.eligible ? 'default' : 'secondary';
  const badgeText = discount.eligible 
    ? `VTS -${discount.discountPercent}%`
    : `${parseFloat(balanceFormatted).toFixed(0)}/${discount.threshold}`;
  
  return (
    <Badge variant={badgeVariant} className={className}>
      {showIcon && <Coins className="w-3 h-3 mr-1" />}
      {badgeText}
    </Badge>
  );
}
