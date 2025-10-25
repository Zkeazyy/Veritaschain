// lib/pdf/types.ts
// Types pour la génération de certificats PDF

export interface CertificateData {
  // Données obligatoires
  hash: string;              // hex string SHA-256
  txHash: string;            // 0x...
  network: string;           // "sepolia" | "mainnet" | string
  contractAddress: string;   // 0x...
  
  // Données optionnelles
  issuerAddress?: string;    // 0x... (optionnel)
  issuedTo?: string;         // nom/email (si fourni)
  issuedAt?: string;         // ISO datetime (si non fourni, serveur met UTC now)
  appName?: string;          // ex: "VeritasChain"
  verifyBaseUrl?: string;    // ex: "https://seritaschain.vercel.app"
}

export interface CertificateConfig {
  // Configuration PDF
  pageSize: 'A4' | 'LETTER';
  orientation: 'portrait' | 'landscape';
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  
  // Polices
  fonts: {
    title: string;
    body: string;
    mono: string;
  };
  
  // Couleurs
  colors: {
    primary: string;
    secondary: string;
    text: string;
    background: string;
  };
}

export interface CertificateMetadata {
  id: string;                // VERI-YYYYMMDD-XXXXX
  generatedAt: string;       // ISO datetime UTC
  version: string;          // Version du générateur
  verifyUrl: string;        // URL complète de vérification
}

export interface CertificateResult {
  pdfBuffer: Buffer;
  metadata: CertificateMetadata;
  filename: string;
}

// Validation des inputs
export interface CertificateValidation {
  isValid: boolean;
  errors: string[];
}

// Configuration par défaut
export const DEFAULT_CERTIFICATE_CONFIG: CertificateConfig = {
  pageSize: 'A4',
  orientation: 'portrait',
  margins: {
    top: 36,
    right: 36,
    bottom: 36,
    left: 36,
  },
  fonts: {
    title: 'Helvetica-Bold',
    body: 'Helvetica',
    mono: 'Courier',
  },
  colors: {
    primary: '#0A5FFF',
    secondary: '#4A5568',
    text: '#1A202C',
    background: '#FFFFFF',
  },
};

// Formats de réseau supportés
export const SUPPORTED_NETWORKS = {
  sepolia: {
    name: 'Sepolia Testnet',
    explorer: 'https://sepolia.etherscan.io',
    chainId: 11155111,
  },
  mainnet: {
    name: 'Ethereum Mainnet',
    explorer: 'https://etherscan.io',
    chainId: 1,
  },
} as const;

export type SupportedNetwork = keyof typeof SUPPORTED_NETWORKS;
