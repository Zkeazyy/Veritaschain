// lib/server/featureFlags.ts
// Feature flags pour activer/désactiver les fonctionnalités blockchain

/**
 * Vérifie si le chaînage blockchain est activé
 * @returns true si la blockchain est activée (adresse de contrat définie)
 */
export function isChainEnabled(): boolean {
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  return Boolean(contractAddress && contractAddress !== '' && contractAddress !== '0x0000000000000000000000000000000000000000');
}

/**
 * Vérifie si on est en mode production
 * @returns true si en production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Détermine si on doit utiliser le mode mock
 * @returns true si en mode mock
 */
export function isMockMode(): boolean {
  // En production, ne jamais mocker si un contrat est défini
  if (isProduction() && isChainEnabled()) {
    return false;
  }
  
  // En développement, utiliser le mode mock si pas de contrat
  return !isChainEnabled();
}

/**
 * Retourne le réseau actuel
 * @returns Le nom du réseau
 */
export function getNetworkName(): string {
  return process.env.NEXT_PUBLIC_NETWORK || 'mock';
}

/**
 * Logs en mode mock
 */
export function logMockMode(action: string, details?: any) {
  if (isMockMode()) {
    console.warn(`⚠️ [MOCK MODE] ${action}`, details || '');
  }
}
