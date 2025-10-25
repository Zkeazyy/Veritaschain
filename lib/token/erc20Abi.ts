// lib/token/erc20Abi.ts
// ABI minimale pour les fonctions ERC-20 nécessaires au module VTS

/**
 * ABI ERC-20 minimale pour la lecture des données du token VTS
 * Contient uniquement les fonctions nécessaires : balanceOf, totalSupply, decimals, symbol, name
 */

export const ERC20_ABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// Types TypeScript pour les fonctions ERC-20
export type Erc20Function = 
  | 'balanceOf'
  | 'totalSupply'
  | 'decimals'
  | 'symbol'
  | 'name';

// Interface pour les résultats des appels
export interface Erc20Result {
  balanceOf: bigint;
  totalSupply: bigint;
  decimals: number;
  symbol: string;
  name: string;
}

// Fonctions utilitaires pour les appels de contrat
export const ERC20_FUNCTIONS = {
  balanceOf: (account: `0x${string}`) => ({
    address: 'contract' as const,
    abi: ERC20_ABI,
    functionName: 'balanceOf' as const,
    args: [account],
  }),
  
  totalSupply: () => ({
    address: 'contract' as const,
    abi: ERC20_ABI,
    functionName: 'totalSupply' as const,
  }),
  
  decimals: () => ({
    address: 'contract' as const,
    abi: ERC20_ABI,
    functionName: 'decimals' as const,
  }),
  
  symbol: () => ({
    address: 'contract' as const,
    abi: ERC20_ABI,
    functionName: 'symbol' as const,
  }),
  
  name: () => ({
    address: 'contract' as const,
    abi: ERC20_ABI,
    functionName: 'name' as const,
  }),
} as const;
