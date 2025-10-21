'use client';

import { useState } from 'react';

interface WalletConnectButtonProps {
  onConnect: () => void;
  onDisconnect: () => void;
  isConnected: boolean;
  address?: string;
}

export function WalletConnectButton({ 
  onConnect, 
  onDisconnect, 
  isConnected, 
  address 
}: WalletConnectButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isConnected) {
      onDisconnect();
    } else {
      setIsLoading(true);
      try {
        await onConnect();
      } catch (error) {
        console.error('Erreur de connexion:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`px-4 py-2 rounded-md font-medium transition-colors ${
        isConnected
          ? 'bg-green-100 text-green-800 hover:bg-green-200'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
          <span>Connexion...</span>
        </div>
      ) : isConnected ? (
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span>{formatAddress(address!)}</span>
        </div>
      ) : (
        'Connecter Wallet'
      )}
    </button>
  );
}
