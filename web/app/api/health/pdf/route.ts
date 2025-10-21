import { NextResponse } from 'next/server';
import { generateCertificate } from '@/lib/pdf';

/**
 * GET /api/health/pdf
 * Génère un PDF de test pour vérifier le bon fonctionnement
 */
export async function GET() {
  try {
    // Données de test selon les spécifications
    const testData = {
      fileName: 'veritaschain-sample.txt',
      hash: '0xba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
      txHash: '0x1111111111111111111111111111111111111111111111111111111111111111',
      timestamp: '2025-10-20T12:00:00.000Z',
      contract: '0x7b7C41cf5bc986F406c7067De6e69f200c27D63f',
      author: '0x1234567890123456789012345678901234567890',
    };

    console.log('[Health PDF] Génération du PDF de test avec les données:', testData);

    const pdfBuffer = await generateCertificate(testData);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="veritaschain-test-certificate.pdf"',
        'Content-Length': pdfBuffer.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('[Health PDF] Erreur lors de la génération du PDF de test:', error);
    
    return NextResponse.json(
      { 
        error: 'Erreur lors de la génération du PDF de test',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
