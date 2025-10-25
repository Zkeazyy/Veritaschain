'use client';

import { useState, useEffect } from 'react';
import { createWalletClient, createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import { config } from '@/lib/config';
import contractABI from '@/lib/contractABI.json';

// Types
export type Hex = `0x${string}`;
export type AddressHex = `0x${string}`;

export interface WalletState {
  isConnected: boolean;
  address?: AddressHex;
  chainId?: number;
  error?: string;
}

export interface AnchorResult {
  txHash: Hex;
  author: AddressHex;
  timestamp: number;
}

// Hook pour la connexion Web3
export function useWeb3Wallet() {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
  });

  // Vérifier la connexion au chargement
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setWalletState({ isConnected: false, error: 'MetaMask non détecté' });
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      if (accounts.length > 0) {
        setWalletState({
          isConnected: true,
          address: accounts[0] as AddressHex,
          chainId: parseInt(chainId, 16),
        });
      } else {
        setWalletState({ isConnected: false });
      }
    } catch (error) {
      setWalletState({ 
        isConnected: false, 
        error: error instanceof Error ? error.message : 'Erreur de connexion' 
      });
    }
  };

  const connectWallet = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask non détecté. Veuillez installer MetaMask.');
    }

    try {
      // Demander la connexion
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      // Vérifier le réseau
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const currentChainId = parseInt(chainId, 16);

      if (currentChainId !== config.chainId) {
        // Demander le changement de réseau
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${config.chainId.toString(16)}` }],
        });
      }

      setWalletState({
        isConnected: true,
        address: accounts[0] as AddressHex,
        chainId: config.chainId,
      });

      return accounts[0] as AddressHex;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion';
      setWalletState({ isConnected: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  };

  const disconnectWallet = () => {
    setWalletState({ isConnected: false });
  };

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
    checkConnection,
  };
}

// Fonction pour ancrer un document avec MetaMask
export async function anchorDocumentWithWallet(
  hash: any,
  fileName: string,
  walletAddress: any
): Promise<AnchorResult> {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask non détecté');
  }

  // Créer le client wallet avec MetaMask
  const walletClient = createWalletClient({
    account: walletAddress as AddressHex,
    chain: sepolia,
    transport: http(config.rpcUrl),
  });

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(config.rpcUrl),
  });

  try {
    // Envoyer la transaction
    const txHash = await walletClient.writeContract({
      address: config.contractAddress as AddressHex,
      abi: contractABI,
      functionName: 'anchor',
      args: [hash],
    });

    // Attendre la confirmation
    const receipt = await publicClient.waitForTransactionReceipt({ 
      hash: txHash,
      timeout: 60000 
    });

    // Lire les données du contrat
    const result = await publicClient.readContract({
      address: config.contractAddress as AddressHex,
      abi: contractABI,
      functionName: 'verify',
      args: [hash],
    });

    const [author, timestamp] = result as [string, bigint];

    return {
      txHash,
      author: author as AddressHex,
      timestamp: Number(timestamp),
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('User rejected')) {
        throw new Error('Transaction annulée par l\'utilisateur');
      }
      if (error.message.includes('Already anchored')) {
        throw new Error('Ce document a déjà été ancré sur la blockchain');
      }
      if (error.message.includes('insufficient funds')) {
        throw new Error('Fonds insuffisants pour payer les frais de transaction');
      }
    }
    throw new Error(`Erreur lors de l'ancrage : ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
}

// Fonction pour générer le certificat PDF
export async function generateCertificatePDF(
  fileName: string,
  hash: Hex,
  txHash: Hex,
  author: AddressHex,
  timestamp: number
): Promise<void> {
  const response = await fetch('/api/pdf', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fileName,
      hash,
      txHash,
      contract: config.contractAddress,
      author,
      timestamp,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erreur lors de la génération du certificat');
  }

  // Télécharger le PDF
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `certificate_${Date.now()}_${fileName.replace(/\s+/g, '_')}_pro.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

// Déclaration globale pour TypeScript
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
    };
  }
}
