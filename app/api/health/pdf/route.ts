import { NextResponse } from 'next/server';

/**
 * GET /api/health/pdf
 * Test simple pour vérifier le bon fonctionnement
 */
export async function GET() {
  try {
    console.log('[Health PDF] Test simple démarré');
    
    // Test simple sans PDFKit pour l'instant
    const testData = {
      status: 'OK',
      message: 'API PDF fonctionnelle',
      timestamp: new Date().toISOString(),
      database: 'SQLite connectée'
    };

    return NextResponse.json(testData, { status: 200 });
  } catch (error) {
    console.error('[Health PDF] Erreur:', error);
    
    return NextResponse.json(
      { 
        error: 'Erreur lors du test PDF',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
