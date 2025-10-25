import { NextRequest, NextResponse } from 'next/server';
import { createWalletClient, createPublicClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
import { z } from 'zod';
import contractABI from '@/lib/contractABI.json';
import { isChainEnabled, isMockMode, logMockMode, getNetworkName } from '@/lib/server/featureFlags';

// Schéma de validation Zod
const anchorRequestSchema = z.object({
  hash: z.string().regex(/^0x[0-9a-fA-F]{64}$/, 'Format de hash invalide: doit commencer par 0x et contenir exactement 64 caractères hexadécimaux'),
  fileName: z.string().min(1, 'Le nom de fichier est requis').max(255, 'Le nom de fichier est trop long'),
});

/**
 * API Route pour ancrer un hash de document sur la blockchain
 * POST /api/anchor
 * Body: { hash: string, fileName: string }
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Démarrage de l\'ancrage de document');

    const body = await request.json();
    
    // Validation Zod
    const validationResult = anchorRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Données invalides', 
          details: validationResult.error.issues.map(e => e.message).join(', ')
        },
        { status: 400 }
      );
    }

    const { hash, fileName } = validationResult.data;

    console.log(`📄 Ancrage demandé pour: ${fileName}`);
    console.log(`🔐 Hash: ${hash}`);

    // Mode mock si blockchain désactivée
    if (!isChainEnabled() || isMockMode()) {
      logMockMode(`Ancrage simulé pour ${fileName}`, { hash });
      
      const mockResult = {
        ok: true,
        txHash: '0x' + '0'.repeat(64),
        network: getNetworkName(),
        author: '0x' + '0'.repeat(40),
        timestamp: Math.floor(Date.now() / 1000),
      };
      
      return NextResponse.json(mockResult, {
        headers: { 'X-Mode': 'mock' },
      });
    }

    // Vérification des variables d'environnement
    const privateKey = process.env.PRIVATE_KEY;
    const rpcUrl = process.env.RPC_URL || process.env.NEXT_PUBLIC_RPC_URL;
    const contractAddress = process.env.CONTRACT_ADDRESS || process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

    if (!privateKey || !rpcUrl || !contractAddress) {
      console.error('❌ Variables d\'environnement manquantes');
      return NextResponse.json({ error: 'Configuration serveur incomplète' }, { status: 500 });
    }

    // Configuration des clients viem
    const account = privateKeyToAccount(privateKey as `0x${string}`);
    const walletClient = createWalletClient({
      account,
      chain: sepolia,
      transport: http(rpcUrl),
    });

    const publicClient = createPublicClient({
      chain: sepolia,
      transport: http(rpcUrl),
    });

    console.log('📡 Envoi de la transaction anchor...');

    // Envoi de la transaction
    const txHash = await walletClient.writeContract({
      address: contractAddress as `0x${string}`,
      abi: contractABI,
      functionName: 'anchor',
      args: [hash as `0x${string}`],
    });

    console.log('⏳ Attente de la confirmation de la transaction...');

    // Attente de la confirmation
    const receipt = await publicClient.waitForTransactionReceipt({
      hash: txHash,
      timeout: 60000, // 1 minute de timeout
    });

    console.log(`✅ Transaction confirmée dans le bloc: ${Number(receipt.blockNumber)}`);

    // Lecture des informations après l'ancrage
    const result = await publicClient.readContract({
      address: contractAddress as `0x${string}`,
      abi: contractABI,
      functionName: 'verify',
      args: [hash as `0x${string}`],
    });

    const [author, timestamp] = result as [string, bigint];

    const anchorResult = {
      txHash,
      author: author as `0x${string}`,
      timestamp: Number(timestamp),
    };

    console.log('✅ Ancrage réussi:', anchorResult);

    return NextResponse.json(anchorResult);

  } catch (error) {
    console.error('❌ Erreur lors de l\'ancrage:', error);

    // Erreurs blockchain (400)
    if (error instanceof Error && error.message.includes('Already anchored')) {
      return NextResponse.json(
        { error: 'Ce document a déjà été ancré sur la blockchain' },
        { status: 400 }
      );
    }

    // Erreurs génériques (500)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
