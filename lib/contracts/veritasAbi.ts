// lib/contracts/veritasAbi.ts
// ABI du contrat VeritasChain - Source unique pour le frontend

export const VERITAS_ABI = [
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "hash",
        "type": "bytes32"
      }
    ],
    "name": "anchor",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "hash",
        "type": "bytes32"
      }
    ],
    "name": "verify",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "hash",
        "type": "bytes32"
      }
    ],
    "name": "getAnchoringInfo",
    "outputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "blockNumber",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "hash",
        "type": "bytes32"
      }
    ],
    "name": "verifyWithEvent",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalAnchored",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "hash",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "blockNumber",
        "type": "uint256"
      }
    ],
    "name": "Anchored",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "hash",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "exists",
        "type": "bool"
      }
    ],
    "name": "Verified",
    "type": "event"
  }
] as const;

// Types TypeScript pour les fonctions du contrat
export type VeritasChainContract = {
  anchor: (hash: `0x${string}`) => Promise<void>;
  verify: (hash: `0x${string}`) => Promise<boolean>;
  getAnchoringInfo: (hash: `0x${string}`) => Promise<{
    sender: `0x${string}`;
    blockNumber: bigint;
    timestamp: bigint;
  }>;
  verifyWithEvent: (hash: `0x${string}`) => Promise<boolean>;
  getTotalAnchored: () => Promise<bigint>;
};

// Types pour les événements
export type AnchoredEvent = {
  hash: `0x${string}`;
  sender: `0x${string}`;
  blockNumber: bigint;
};

export type VerifiedEvent = {
  hash: `0x${string}`;
  exists: boolean;
};

// Configuration du contrat
export const VERITAS_CONFIG = {
  name: "VeritasChain",
  version: "1.0.0",
  description: "Contrat d'ancrage de documents sur la blockchain",
  functions: {
    anchor: "Ancrage d'un hash de document",
    verify: "Vérification de l'existence d'un hash ancré",
    getAnchoringInfo: "Récupération des informations d'ancrage",
    verifyWithEvent: "Vérification avec événement",
    getTotalAnchored: "Compteur du nombre total de hashs ancrés"
  },
  events: {
    Anchored: "Événement émis lors de l'ancrage d'un document",
    Verified: "Événement émis lors de la vérification d'un document"
  }
} as const;
