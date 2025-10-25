// lib/feature-flags.ts
// Système de feature flags pour activer/désactiver les modules spécialisés

export interface FeatureFlags {
  // Modules principaux
  core: boolean;
  
  // Modules spécialisés
  rh: boolean;
  accounting: boolean;
  legal: boolean;
  btp: boolean;
  
  // Fonctionnalités avancées
  pdfGeneration: boolean;
  blockchainAnchoring: boolean;
  qrCodeGeneration: boolean;
  
  // Fonctionnalités expérimentales
  experimental: boolean;
}

// Configuration par défaut des feature flags
export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  // Core toujours activé
  core: true,
  
  // Modules spécialisés - activés par défaut pour le développement
  rh: true,
  accounting: true,
  legal: true,
  btp: true,
  
  // Fonctionnalités avancées
  pdfGeneration: true,
  blockchainAnchoring: true,
  qrCodeGeneration: true,
  
  // Fonctionnalités expérimentales
  experimental: false,
};

// Fonction pour obtenir les feature flags depuis les variables d'environnement
export function getFeatureFlags(): FeatureFlags {
  return {
    core: process.env.NEXT_PUBLIC_FEATURE_CORE === 'true' || DEFAULT_FEATURE_FLAGS.core,
    rh: process.env.NEXT_PUBLIC_FEATURE_RH === 'true' || DEFAULT_FEATURE_FLAGS.rh,
    accounting: process.env.NEXT_PUBLIC_FEATURE_ACCOUNTING === 'true' || DEFAULT_FEATURE_FLAGS.accounting,
    legal: process.env.NEXT_PUBLIC_FEATURE_LEGAL === 'true' || DEFAULT_FEATURE_FLAGS.legal,
    btp: process.env.NEXT_PUBLIC_FEATURE_BTP === 'true' || DEFAULT_FEATURE_FLAGS.btp,
    pdfGeneration: process.env.NEXT_PUBLIC_FEATURE_PDF === 'true' || DEFAULT_FEATURE_FLAGS.pdfGeneration,
    blockchainAnchoring: process.env.NEXT_PUBLIC_FEATURE_BLOCKCHAIN === 'true' || DEFAULT_FEATURE_FLAGS.blockchainAnchoring,
    qrCodeGeneration: process.env.NEXT_PUBLIC_FEATURE_QR === 'true' || DEFAULT_FEATURE_FLAGS.qrCodeGeneration,
    experimental: process.env.NEXT_PUBLIC_FEATURE_EXPERIMENTAL === 'true' || DEFAULT_FEATURE_FLAGS.experimental,
  };
}

// Hook React pour utiliser les feature flags côté client
export function useFeatureFlags(): FeatureFlags {
  if (typeof window === 'undefined') {
    return DEFAULT_FEATURE_FLAGS;
  }
  
  // Côté client, on peut utiliser des cookies ou localStorage
  // Pour l'instant, on retourne les flags par défaut
  return DEFAULT_FEATURE_FLAGS;
}

// Fonction utilitaire pour vérifier si une feature est activée
export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  // Temporairement, tous les modules sont activés
  return true;
}

// Types pour les modules spécialisés
export interface ModuleConfig {
  name: string;
  description: string;
  enabled: boolean;
  icon: string;
  color: string;
  routes: string[];
}

// Configuration des modules - TOUS ACTIVÉS TEMPORAIREMENT
export const MODULE_CONFIGS: Record<string, ModuleConfig> = {
  rh: {
    name: 'Ressources Humaines',
    description: 'Gestion des bulletins de paie et documents RH',
    enabled: true, // Forcé à true temporairement
    icon: '👥',
    color: 'blue',
    routes: ['/rh', '/rh/payslips', '/rh/contracts'],
  },
  accounting: {
    name: 'Comptabilité',
    description: 'Factures, devis et documents comptables',
    enabled: true, // Forcé à true temporairement
    icon: '💰',
    color: 'green',
    routes: ['/accounting', '/accounting/invoices', '/accounting/quotes'],
  },
  legal: {
    name: 'Juridique & Notaires',
    description: 'Contrats, actes notariés et documents légaux',
    enabled: true, // Forcé à true temporairement
    icon: '⚖️',
    color: 'purple',
    routes: ['/legal', '/legal/contracts', '/legal/notary'],
  },
  btp: {
    name: 'BTP & Construction',
    description: 'Plans, permis et documents de construction',
    enabled: true, // Forcé à true temporairement
    icon: '🏗️',
    color: 'orange',
    routes: ['/btp', '/btp/plans', '/btp/permits'],
  },
};
