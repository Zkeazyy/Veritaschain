// lib/token/config.ts
// Configuration centralisée pour le token VTS

/**
 * Configuration du token Veritas Token (VTS)
 * Module désactivé si NEXT_PUBLIC_VTS_CONTRACT_ADDRESS n'est pas défini
 */

// Activation du module VTS
export const VTS_ENABLED = Boolean(process.env.NEXT_PUBLIC_VTS_CONTRACT_ADDRESS);

// Configuration du token
export const VTS_CONFIG = {
  // Adresse du contrat VTS
  contractAddress: process.env.NEXT_PUBLIC_VTS_CONTRACT_ADDRESS || '',
  
  // Réseau recommandé
  network: process.env.NEXT_PUBLIC_NETWORK || 'sepolia',
  
  // Nom de l'application
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'VeritasChain',
  
  // Propriétés du token
  decimals: 18,
  symbol: 'VTS',
  name: 'Veritas Token',
  
  // Seuils et remises
  discountThreshold: 500, // Seuil en VTS (500 VTS)
  discountPercent: 30,    // Réduction en % (30%)
  
  // Messages d'aide (FR)
  messages: {
    thresholdInfo: 'Détenez ≥ 500 VTS pour bénéficier de -30% sur l\'abonnement.',
    loading: 'Chargement du solde VTS...',
    notAvailable: 'Module VTS bientôt disponible.',
    networkWarning: 'Réseau recommandé : {network}',
    eligible: 'VTS actif : -{percent}%',
    notEligible: 'VTS : {current}/{threshold} pour activer -{percent}%',
    discountHint: 'Détenez {threshold} VTS pour -{percent}%',
  },
} as const;

// Types utilitaires
export type VtsConfig = typeof VTS_CONFIG;

// Fonctions utilitaires
export const formatVtsAmount = (amountWei: bigint): string => {
  const amount = Number(amountWei) / Math.pow(10, VTS_CONFIG.decimals);
  return amount.toFixed(2);
};

export const parseVtsAmount = (amount: string): bigint => {
  const amountNumber = parseFloat(amount);
  return BigInt(Math.floor(amountNumber * Math.pow(10, VTS_CONFIG.decimals)));
};

export const isVtsEligible = (balanceFormatted: string): boolean => {
  const balance = parseFloat(balanceFormatted);
  return balance >= VTS_CONFIG.discountThreshold;
};

export const calculateDiscount = (amountCents: number, discountPercent: number): number => {
  return Math.floor(amountCents * (1 - discountPercent / 100));
};

// Validation de la configuration
export const validateVtsConfig = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (VTS_ENABLED) {
    if (!VTS_CONFIG.contractAddress) {
      errors.push('NEXT_PUBLIC_VTS_CONTRACT_ADDRESS est requis');
    }
    
    if (!VTS_CONFIG.contractAddress.startsWith('0x')) {
      errors.push('NEXT_PUBLIC_VTS_CONTRACT_ADDRESS doit commencer par 0x');
    }
    
    if (VTS_CONFIG.contractAddress.length !== 42) {
      errors.push('NEXT_PUBLIC_VTS_CONTRACT_ADDRESS doit faire 42 caractères');
    }
    
    if (VTS_CONFIG.discountThreshold <= 0) {
      errors.push('Le seuil de réduction doit être positif');
    }
    
    if (VTS_CONFIG.discountPercent <= 0 || VTS_CONFIG.discountPercent > 100) {
      errors.push('Le pourcentage de réduction doit être entre 1 et 100');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};
