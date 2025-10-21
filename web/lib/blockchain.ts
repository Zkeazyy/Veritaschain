import { createWalletClient, createPublicClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
import { config } from './config';
import contractABI from './contractABI.json';

// Types
export type Hex = `0x${string}`;
export type AddressHex = `0x${string}`;

export interface AnchorResult {
  txHash: Hex;
  author: AddressHex;
  timestamp: number;
}

export interface VerifyResult {
  exists: boolean;
  author?: AddressHex;
  timestamp?: number;
  etherscanContractUrl?: string;
}

// Clients viem
export function createBlockchainClients() {
  const account = privateKeyToAccount(process.env.PRIVATE_KEY as Hex);
  
  const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http(config.rpcUrl),
  });
  
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(config.rpcUrl),
  });
  
  return { walletClient, publicClient };
}

// Ancrage d'un document
export async function anchorDocument(hash: Hex, fileName: string): Promise<AnchorResult> {
  const { walletClient, publicClient } = createBlockchainClients();
  
  const txHash = await walletClient.writeContract({
    address: config.contractAddress as AddressHex,
    abi: contractABI,
    functionName: 'anchor',
    args: [hash],
  });
  
  const receipt = await publicClient.waitForTransactionReceipt({ 
    hash: txHash,
    timeout: 60000 
  });
  
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
}

// Ancrage en lot
export async function anchorBatch(hashes: Hex[]): Promise<{ txHash: Hex; blockNumber: number; count: number }> {
  const { walletClient, publicClient } = createBlockchainClients();
  
  const txHash = await walletClient.writeContract({
    address: config.contractAddress as AddressHex,
    abi: contractABI,
    functionName: 'anchorBatch',
    args: [hashes],
  });
  
  const receipt = await publicClient.waitForTransactionReceipt({ 
    hash: txHash,
    timeout: 60000 
  });
  
  return {
    txHash,
    blockNumber: Number(receipt.blockNumber),
    count: hashes.length,
  };
}

// Vérification d'un document
export async function verifyDocument(hash: Hex): Promise<VerifyResult> {
  const { publicClient } = createBlockchainClients();
  
  const result = await publicClient.readContract({
    address: config.contractAddress as AddressHex,
    abi: contractABI,
    functionName: 'verify',
    args: [hash],
  });

  const [author, timestamp] = result as [string, bigint];
  
  const ts = Number(timestamp);
  const zeroAddress = '0x0000000000000000000000000000000000000000';
  const exists = author !== zeroAddress && ts > 0;
  
  if (!exists) {
    return { exists: false };
  }
  
  return {
    exists: true,
    author: author as AddressHex,
    timestamp: ts,
    etherscanContractUrl: config.etherscan.contractUrl(config.contractAddress),
  };
}
