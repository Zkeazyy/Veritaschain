// 🎯 Central config consumed by Cursor & code
export const config = {
  contractAddress: "0x7b7C41cf5bc986F406c7067De6e69f200c27D63f",
  chainId: 11155111, // Sepolia
  siteBaseUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || process.env.RPC_URL || "",
  
  // Limites
  limits: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png'],
    rateLimit: {
      maxRequests: 30,
      windowMs: 5 * 60 * 1000, // 5 minutes
    },
  },
  
  // Etherscan
  etherscan: {
    baseUrl: 'https://sepolia.etherscan.io',
    contractUrl: (address: string) => `https://sepolia.etherscan.io/address/${address}`,
    txUrl: (hash: string) => `https://sepolia.etherscan.io/tx/${hash}`,
  },
} as const;

export type Config = typeof config;
