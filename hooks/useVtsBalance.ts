// hooks/useVtsBalance.ts
// Hook pour lire le solde VTS de l'utilisateur connecté

import { useReadContract } from 'wagmi';
import { useAccount } from 'wagmi';
import { VTS_ENABLED, VTS_CONFIG, formatVtsAmount } from '@/lib/token/config';
import { ERC20_ABI } from '@/lib/token/erc20Abi';

/**
 * Hook pour lire le solde VTS de l'utilisateur connecté
 * 
 * @returns {Object} État du solde VTS
 * - enabled: boolean - Module VTS activé
 * - loading: boolean - Chargement en cours
 * - error: Error | null - Erreur éventuelle
 * - balanceWei: bigint - Solde en wei
 * - balanceFormatted: string - Solde formaté (ex: "123.45")
 * - symbol: string - Symbole du token ("VTS")
 */
export function useVtsBalance() {
  const { address: userAddress, isConnected } = useAccount();
  
  // Si le module VTS est désactivé ou pas d'adresse utilisateur
  if (!VTS_ENABLED || !userAddress || !isConnected) {
    return {
      enabled: false,
      loading: false,
      error: null,
      balanceWei: BigInt(0),
      balanceFormatted: '0.00',
      symbol: VTS_CONFIG.symbol,
    };
  }
  
  // Lecture du solde via le contrat ERC-20
  const { data: balanceWei, isLoading, error } = useReadContract({
    address: VTS_CONFIG.contractAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [userAddress],
    query: {
      enabled: VTS_ENABLED && !!userAddress,
      refetchInterval: 30000, // Revalidation toutes les 30 secondes
    },
  });
  
  // Formatage du solde
  const balanceFormatted = balanceWei ? formatVtsAmount(balanceWei) : '0.00';
  
  return {
    enabled: true,
    loading: isLoading,
    error: error as Error | null,
    balanceWei: balanceWei || BigInt(0),
    balanceFormatted,
    symbol: VTS_CONFIG.symbol,
  };
}

/**
 * Hook pour lire les métadonnées du token VTS
 * 
 * @returns {Object} Métadonnées du token
 */
export function useVtsMetadata() {
  const { data: symbol, isLoading: symbolLoading } = useReadContract({
    address: VTS_CONFIG.contractAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'symbol',
    query: {
      enabled: VTS_ENABLED,
    },
  });
  
  const { data: name, isLoading: nameLoading } = useReadContract({
    address: VTS_CONFIG.contractAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'name',
    query: {
      enabled: VTS_ENABLED,
    },
  });
  
  const { data: decimals, isLoading: decimalsLoading } = useReadContract({
    address: VTS_CONFIG.contractAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'decimals',
    query: {
      enabled: VTS_ENABLED,
    },
  });
  
  return {
    enabled: VTS_ENABLED,
    loading: symbolLoading || nameLoading || decimalsLoading,
    symbol: symbol || VTS_CONFIG.symbol,
    name: name || VTS_CONFIG.name,
    decimals: decimals || VTS_CONFIG.decimals,
  };
}

/**
 * Hook pour vérifier la connectivité réseau
 * 
 * @returns {Object} État de la connectivité
 */
export function useVtsNetworkStatus() {
  const { chain } = useAccount();
  
  const isCorrectNetwork = chain?.name?.toLowerCase() === VTS_CONFIG.network.toLowerCase();
  
  return {
    enabled: VTS_ENABLED,
    currentNetwork: chain?.name || 'Unknown',
    recommendedNetwork: VTS_CONFIG.network,
    isCorrectNetwork,
    warningMessage: !isCorrectNetwork 
      ? VTS_CONFIG.messages.networkWarning.replace('{network}', VTS_CONFIG.network)
      : null,
  };
}
