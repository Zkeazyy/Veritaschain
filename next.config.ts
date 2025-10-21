import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration pour la production
  output: 'standalone',
  
  // Optimisations
  compress: true,
  poweredByHeader: false,
  
  // Sécurité
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Variables d'environnement publiques
  env: {
    NEXT_PUBLIC_APP_NAME: 'VeritasChain',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
    NEXT_PUBLIC_NETWORK: 'Sepolia',
  },

  // Configuration des images
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
  },

  // Configuration TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },

  // Configuration ESLint
  eslint: {
    ignoreDuringBuilds: true, // Temporairement ignoré pour le déploiement
  },

  // Configuration expérimentale
  experimental: {
    // optimizeCss: true, // Désactivé temporairement pour éviter les erreurs de build
  },
};

export default nextConfig;