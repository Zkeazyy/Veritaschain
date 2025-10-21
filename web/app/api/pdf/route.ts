import { NextRequest, NextResponse } from 'next/server';
import { generateCertificate, generateFileName } from '@/lib/pdf';

/**
 * POST /api/pdf
 * Génère un certificat PDF pour un document ancré
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validation basique des champs obligatoires
    if (!body.fileName || !body.hash) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants: fileName et hash sont requis' },
        { status: 400 }
      );
    }
    
    // Validation du format du hash
    if (!/^0x[0-9a-fA-F]{64}$/.test(body.hash)) {
      return NextResponse.json(
        { error: 'Format de hash invalide: doit commencer par 0x et contenir exactement 64 caractères hexadécimaux' },
        { status: 400 }
      );
    }
    
    const data = {
      fileName: body.fileName,
      hash: body.hash,
      txHash: body.txHash, // Optionnel
      contract: body.contract, // Optionnel
      author: body.author, // Optionnel
      timestamp: body.timestamp, // Optionnel
    };
    
    console.log('[PDF API] Génération du certificat pour:', data.fileName);
    
    const pdfBuffer = await generateCertificate(data);
    const fileName = generateFileName(data.fileName);
    
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('[PDF API] Erreur:', error);
    
    if (error instanceof Error && error.message.includes('Hash invalide')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json(
      { error: 'Erreur lors de la génération du PDF' },
      { status: 500 }
    );
  }
}
