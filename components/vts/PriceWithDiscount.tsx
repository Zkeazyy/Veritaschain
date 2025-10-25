// components/vts/PriceWithDiscount.tsx
// Composant affichant les prix avec réduction VTS

'use client';

import React from 'react';
import { useVtsBalance } from '@/hooks/useVtsBalance';
import { useVtsPricing } from '@/hooks/useVtsDiscount';
import { VTS_CONFIG } from '@/lib/token/config';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Coins, Info } from 'lucide-react';

export interface PriceWithDiscountProps {
  amountCents: number; // Prix de base en centimes
  currency?: 'EUR' | 'USD';
  discountPercent?: number; // Override optionnel
  showVtsHint?: boolean; // Affiche l'indication VTS si non éligible
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showOriginalPrice?: boolean; // Affiche le prix original barré
}

export function PriceWithDiscount({
  amountCents,
  currency = 'EUR',
  discountPercent,
  showVtsHint = true,
  className = '',
  size = 'md',
  showOriginalPrice = true,
}: PriceWithDiscountProps) {
  const { enabled, balanceFormatted } = useVtsBalance();
  const pricing = useVtsPricing(amountCents, balanceFormatted, discountPercent);
  
  // Module VTS désactivé - afficher le prix normal
  if (!enabled) {
    return (
      <div className={className}>
        <PriceDisplay 
          amount={amountCents}
          currency={currency}
          size={size}
        />
      </div>
    );
  }
  
  // Prix avec réduction VTS
  if (pricing.eligible) {
    return (
      <div className={className}>
        <div className="space-y-1">
          {/* Prix réduit */}
          <div className="flex items-center gap-2">
            <PriceDisplay 
              amount={pricing.discountedPrice}
              currency={currency}
              size={size}
              className="text-green-600 font-semibold"
            />
            <Badge variant="default" className="text-xs">
              <Coins className="w-3 h-3 mr-1" />
              -{pricing.discountPercent}%
            </Badge>
          </div>
          
          {/* Prix original barré */}
          {showOriginalPrice && (
            <div className="flex items-center gap-2">
              <PriceDisplay 
                amount={pricing.originalPrice}
                currency={currency}
                size="sm"
                className="line-through text-muted-foreground"
              />
              <span className="text-xs text-muted-foreground">
                Économie: {pricing.formattedSavings} {currency}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Prix normal avec hint VTS
  return (
    <div className={className}>
      <div className="space-y-1">
        <PriceDisplay 
          amount={amountCents}
          currency={currency}
          size={size}
        />
        
        {showVtsHint && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 text-xs text-muted-foreground cursor-help">
                  <Info className="w-3 h-3" />
                  <span>{VTS_CONFIG.messages.discountHint}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1">
                  <p className="font-medium">Réduction VTS disponible</p>
                  <p className="text-sm">
                    Détenez {VTS_CONFIG.discountThreshold} VTS pour bénéficier de -{VTS_CONFIG.discountPercent}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Votre solde: {balanceFormatted} VTS
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
}

// Composant interne pour l'affichage du prix
function PriceDisplay({
  amount,
  currency,
  size,
  className = '',
}: {
  amount: number;
  currency: string;
  size: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const formattedAmount = (amount / 100).toFixed(2);
  
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };
  
  return (
    <span className={`${sizeClasses[size]} ${className}`}>
      {formattedAmount} {currency}
    </span>
  );
}

// Composant simplifié pour les listes de prix
export function PriceList({ 
  prices, 
  currency = 'EUR',
  showVtsHint = true 
}: {
  prices: Array<{
    id: string;
    name: string;
    amountCents: number;
    description?: string;
  }>;
  currency?: 'EUR' | 'USD';
  showVtsHint?: boolean;
}) {
  const { enabled, balanceFormatted } = useVtsBalance();
  
  return (
    <div className="space-y-4">
      {prices.map((price) => (
        <div key={price.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="font-medium">{price.name}</h3>
              {price.description && (
                <p className="text-sm text-muted-foreground">{price.description}</p>
              )}
            </div>
            <div className="text-right">
              <PriceWithDiscount
                amountCents={price.amountCents}
                currency={currency}
                showVtsHint={showVtsHint}
                size="md"
              />
            </div>
          </div>
        </div>
      ))}
      
      {enabled && showVtsHint && (
        <div className="text-center pt-2">
          <p className="text-xs text-muted-foreground">
            💡 Détenez {VTS_CONFIG.discountThreshold} VTS pour débloquer les réductions
          </p>
        </div>
      )}
    </div>
  );
}
