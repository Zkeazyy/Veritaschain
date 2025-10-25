import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import { z } from 'zod';
import contractABI from '@/lib/contractABI.json';

// Schéma de validation Zod
const verifyRequestSchema = z.object({
  hash: z.string().regex(/^0x[0-9a-fA-F]{64}$/, 'Format de hash invalide: doit commencer par 0x et contenir exactement 64 caractères hexadécimaux'),
});

/**
 * POST /api/verify
 * Body: { hash }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validation Zod
    const validationResult = verifyRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Données invalides', 
          details: validationResult.error.issues.map(e => e.message).join(', ')
        },
        { status: 400 }
      );
    }

    const { hash } = validationResult.data;

    const rpcUrl = process.env.RPC_URL || process.env.NEXT_PUBLIC_RPC_URL;
    const contractAddress = process.env.CONTRACT_ADDRESS || process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

    if (!rpcUrl || !contractAddress) {
      console.error('[verify] Configuration manquante (RPC_URL/CONTRACT_ADDRESS)');
      return NextResponse.json({ error: 'Configuration serveur incomplète' }, { status: 500 });
    }

    const publicClient = createPublicClient({ chain: sepolia, transport: http(rpcUrl) });

    const result = await publicClient.readContract({
      address: contractAddress as `0x${string}`,
      abi: contractABI,
      functionName: 'verify',
      args: [hash as `0x${string}`],
    });

    const [author, timestamp] = result as [string, bigint];

    const ts = Number(timestamp);
    const zeroAddress = '0x0000000000000000000000000000000000000000';
    const exists = author !== zeroAddress && ts > 0;

    if (!exists) {
      return NextResponse.json({ exists: false });
    }

    return NextResponse.json({
      exists: true,
      author,
      timestamp: ts,
      etherscanContractUrl: `https://sepolia.etherscan.io/address/${contractAddress}`
    });
  } catch (error) {
    console.error('[verify] Erreur interne:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}