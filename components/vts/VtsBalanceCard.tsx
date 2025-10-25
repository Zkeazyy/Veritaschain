// components/vts/VtsBalanceCard.tsx
// Carte affichant le solde VTS et les avantages

'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useVtsBalance } from '@/hooks/useVtsBalance';
import { useVtsDiscount } from '@/hooks/useVtsDiscount';
import { useVtsNetworkStatus } from '@/hooks/useVtsBalance';
import { VTS_CONFIG } from '@/lib/token/config';
import { 
  Coins, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink,
  TrendingUp 
} from 'lucide-react';

interface VtsBalanceCardProps {
  className?: string;
  showLearnMore?: boolean;
  learnMoreHref?: string;
}

export function VtsBalanceCard({ 
  className, 
  showLearnMore = true,
  learnMoreHref = '/docs/vts'
}: VtsBalanceCardProps) {
  const { enabled, loading, balanceFormatted, symbol, error } = useVtsBalance();
  const discount = useVtsDiscount(balanceFormatted);
  const networkStatus = useVtsNetworkStatus();
  
  // Module désactivé
  if (!enabled) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5" />
            Mon solde VTS
          </CardTitle>
          <CardDescription>
            Module VTS bientôt disponible
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground text-sm">
              {VTS_CONFIG.messages.notAvailable}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Erreur
  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5" />
            Mon solde VTS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
            <p className="text-destructive text-sm">
              Erreur lors du chargement du solde VTS
            </p>
            <p className="text-muted-foreground text-xs mt-1">
              Vérifiez votre connexion réseau
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Chargement
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5" />
            Mon solde VTS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">
              {VTS_CONFIG.messages.loading}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Contenu principal
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="w-5 h-5" />
          Mon solde VTS
        </CardTitle>
        <CardDescription>
          Token de réduction pour VeritasChain
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Solde principal */}
        <div className="text-center">
          <div className="text-3xl font-bold mb-1">
            {balanceFormatted} {symbol}
          </div>
          <Badge 
            variant={discount.eligible ? 'default' : 'secondary'}
            className="mb-2"
          >
            {discount.eligible ? (
              <>
                <CheckCircle className="w-3 h-3 mr-1" />
                Réduction active
              </>
            ) : (
              <>
                <TrendingUp className="w-3 h-3 mr-1" />
                En cours d'activation
              </>
            )}
          </Badge>
        </div>
        
        {/* Statut de réduction */}
        <div className="text-center">
          {discount.eligible ? (
            <div className="space-y-1">
              <p className="text-green-600 font-medium">
                Vous bénéficiez de -{discount.discountPercent}% sur l'abonnement
              </p>
              <p className="text-xs text-muted-foreground">
                Réduction appliquée automatiquement
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm">
                {VTS_CONFIG.messages.thresholdInfo}
              </p>
              <p className="text-xs text-muted-foreground">
                Il vous manque {discount.needsMore.toFixed(0)} VTS
              </p>
            </div>
          )}
        </div>
        
        {/* Barre de progression */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progression</span>
            <span>{parseFloat(balanceFormatted).toFixed(0)} / {discount.threshold} VTS</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${Math.min(100, (parseFloat(balanceFormatted) / discount.threshold) * 100)}%` 
              }}
            />
          </div>
        </div>
        
        {/* Avertissement réseau */}
        {networkStatus.warningMessage && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <p className="text-yellow-800 text-sm">
                {networkStatus.warningMessage}
              </p>
            </div>
          </div>
        )}
        
        {/* Lien d'aide */}
        {showLearnMore && (
          <div className="text-center pt-2">
            <Button variant="outline" size="sm" asChild>
              <a href={learnMoreHref} target="_blank" rel="noopener noreferrer">
                En savoir plus
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
