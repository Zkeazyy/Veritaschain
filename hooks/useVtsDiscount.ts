// hooks/useVtsDiscount.ts
// Hook pour calculer les réductions VTS

import { useMemo } from 'react';
import { VTS_CONFIG, isVtsEligible, calculateDiscount } from '@/lib/token/config';

/**
 * Hook pour calculer les réductions VTS basées sur le solde
 * 
 * @param balanceFormatted - Solde VTS formaté (ex: "123.45")
 * @param customThreshold - Seuil personnalisé (optionnel)
 * @param customPercent - Pourcentage personnalisé (optionnel)
 * @returns {Object} État de l'éligibilité et calculs de réduction
 */
export function useVtsDiscount(
  balanceFormatted: string,
  customThreshold?: number,
  customPercent?: number
) {
  const threshold = customThreshold ?? VTS_CONFIG.discountThreshold;
  const discountPercent = customPercent ?? VTS_CONFIG.discountPercent;
  
  const result = useMemo(() => {
    // Vérification de l'éligibilité
    const eligible = isVtsEligible(balanceFormatted);
    
    // Calcul du pourcentage de réduction
    const percent = eligible ? discountPercent : 0;
    
    // Fonction pour calculer le prix réduit
    const getDiscountedPrice = (amountCents: number): number => {
      if (!eligible) return amountCents;
      return calculateDiscount(amountCents, discountPercent);
    };
    
    // Fonction pour calculer l'économie
    const getSavings = (amountCents: number): number => {
      if (!eligible) return 0;
      return amountCents - getDiscountedPrice(amountCents);
    };
    
    // Messages d'état
    const statusMessage = eligible 
      ? VTS_CONFIG.messages.eligible.replace('{percent}', discountPercent.toString())
      : VTS_CONFIG.messages.notEligible
          .replace('{current}', parseFloat(balanceFormatted).toFixed(0))
          .replace('{threshold}', threshold.toString())
          .replace('{percent}', discountPercent.toString());
    
    const hintMessage = VTS_CONFIG.messages.discountHint
      .replace('{threshold}', threshold.toString())
      .replace('{percent}', discountPercent.toString());
    
    return {
      eligible,
      percent,
      threshold,
      discountPercent,
      getDiscountedPrice,
      getSavings,
      statusMessage,
      hintMessage,
      // Données brutes pour debug
      balance: parseFloat(balanceFormatted),
      needsMore: Math.max(0, threshold - parseFloat(balanceFormatted)),
    };
  }, [balanceFormatted, threshold, discountPercent]);
  
  return result;
}

/**
 * Hook pour calculer les réductions sur un prix spécifique
 * 
 * @param amountCents - Prix en centimes
 * @param balanceFormatted - Solde VTS formaté
 * @param customDiscountPercent - Réduction personnalisée (optionnel)
 * @returns {Object} Calculs de prix avec réduction
 */
export function useVtsPricing(
  amountCents: number,
  balanceFormatted: string,
  customDiscountPercent?: number
) {
  const discount = useVtsDiscount(balanceFormatted, undefined, customDiscountPercent);
  
  return useMemo(() => {
    const originalPrice = amountCents;
    const discountedPrice = discount.getDiscountedPrice(amountCents);
    const savings = discount.getSavings(amountCents);
    const discountAmount = originalPrice - discountedPrice;
    
    return {
      originalPrice,
      discountedPrice,
      savings,
      discountAmount,
      discountPercent: discount.percent,
      eligible: discount.eligible,
      // Formatage pour l'affichage
      formattedOriginal: (originalPrice / 100).toFixed(2),
      formattedDiscounted: (discountedPrice / 100).toFixed(2),
      formattedSavings: (savings / 100).toFixed(2),
    };
  }, [amountCents, balanceFormatted, customDiscountPercent, discount]);
}

/**
 * Hook pour obtenir les informations de configuration VTS
 * 
 * @returns {Object} Configuration actuelle
 */
export function useVtsConfig() {
  return {
    enabled: VTS_CONFIG.contractAddress !== '',
    threshold: VTS_CONFIG.discountThreshold,
    discountPercent: VTS_CONFIG.discountPercent,
    symbol: VTS_CONFIG.symbol,
    network: VTS_CONFIG.network,
    messages: VTS_CONFIG.messages,
  };
}
