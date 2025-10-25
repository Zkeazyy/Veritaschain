// lib/wagmi-config.ts
// Configuration wagmi pour VeritasChain

import { createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';

// Configuration des chaînes supportées
export const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.infura.io/v3/adc27d09a5464d119b406fbcfe66805f'),
  },
});

// Types pour TypeScript
export type Config = typeof config;
