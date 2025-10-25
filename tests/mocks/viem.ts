// tests/mocks/viem.ts
// Mock viem pour les appels blockchain

import { vi } from 'vitest';

export const mockPublicClient = {
  readContract: vi.fn(),
};

export function mockViemReadContract(data: any) {
  mockPublicClient.readContract.mockResolvedValue(data);
}

// Mock pour useAccount hook (wagmi)
export const mockUseAccount = {
  data: {
    address: '0x' + '0'.repeat(40),
    isConnected: true,
    status: 'connected',
  },
  isSuccess: true,
};

// Mock pour useReadContract hook (wagmi)
export function mockUseReadContract(data: any) {
  return {
    data,
    isLoading: false,
    isSuccess: true,
    isError: false,
  };
}
